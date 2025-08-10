import { useEffect, useRef, useState } from 'react'
import Progress from './components/Progress'
import ProbToken from './components/Token'
import Header from './components/Header'
import ColorScale from './components/ColorScale'
import ExamplePicker from './components/ExamplePicker'
import './App.css'

function App() {
	// Model loading
	const [ready, setReady] = useState(null);
	const [disabled, setDisabled] = useState(false);
	const [progressItems, setProgressItems] = useState([]);
	const [modelLoading, setModelLoading] = useState(false);

	// Inputs and outputs
	const startPrompt = 'Type a sentence here, and press "score" to see how likely each word is, according to GPT.';
	const [input, setInput] = useState(startPrompt);
	const [outputTokens, setOutputTokens] = useState([]);
  
	// Create a reference to the worker object.
	const worker = useRef(null);

	// We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
	useEffect(() => {
		if (!worker.current) {
		// Create the worker if it does not yet exist.
		worker.current = new Worker(new URL('./worker.js', import.meta.url), {
			type: 'module'
		});
		}

		// Create a callback function for messages from the worker thread.
		const onMessageReceived = (e) => {
			switch (e.data.status) {
				case 'initiate':
				// Model file start load: add a new progress item to the list.
				setReady(false);
				setProgressItems(prev => [...prev, e.data]);
				setModelLoading(true);
				break;
			
				case 'progress':
				// Model file progress: update one of the progress items.
				setProgressItems(
					prev => prev.map(item => {
					if (item.file === e.data.file) {
						return { ...item, progress: e.data.progress }
					}
					return item;
					})
				);
				break;
			
				case 'done':
				// Model file loaded: remove the progress item from the list.
				setProgressItems(
					prev => prev.filter(item => item.file !== e.data.file)
				);
				setModelLoading(false);
				break;
			
				case 'ready':
				// Pipeline ready: the worker is ready to accept messages.
				setReady(true);
				break;
			
				case 'update':
				// Generation update: update the output text.
				// Append new token with probability
				setOutputTokens(prev => [...prev, { token: e.data.token, probability: e.data.prob_sum, best: e.data.best }]);

				break;
			
				case 'complete':
				// Generation complete: re-enable the "Translate" button
				setDisabled(false);
				break;

				case 'error':
				// An error occurred during inference.
				console.error('Error:', e.data.message);
				setDisabled(false);
				break;
			}
		};

	// Attach the callback function as an event listener.
	worker.current.addEventListener('message', onMessageReceived);

	// Define a cleanup function for when the component is unmounted.
	return () => worker.current.removeEventListener('message', onMessageReceived);
	});

	const score = () => {
		setDisabled(true);
		setOutputTokens([]);
		worker.current.postMessage({
			text: input,
		});
	}

	const handleExampleSelect = (exampleText) => {
		setInput(exampleText);
	}

	// Check if input text would overlap with example picker
	const shouldHideExamplePicker = () => {
		// Hide if user has typed anything different from the default examples
		const defaultExample1 = 'It was the best of times, it was the worst of times.';
		const defaultExample2 = 'It was the best of times, it was the BLURST of times?!';
		
		return input !== defaultExample1 && 
			input !== defaultExample2 && 
			input !== startPrompt &&
			input.length > 0;
	}

	return (
	<>
		<Header />
		<div className='container'>
			<div className='input-section'>
				<textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
				<ExamplePicker 
					onExampleSelect={handleExampleSelect} 
					isVisible={!shouldHideExamplePicker()}
				/>
			</div>
			{outputTokens.length > 0 && (
				<div className='output'>
					{outputTokens.map((item, idx) => (
						<ProbToken key={idx} token={item.token} probability={item.probability} alternative={item.best} />
					))}
				</div>
			)}
		</div>

	  <button disabled={disabled || modelLoading} onClick={score}>
		{modelLoading ? 'Loading model' : 'Score'}
	  </button>
	
		{modelLoading && (
			<div className='progress-bars-container'>
				{progressItems.map(data => (
					<div key={data.file}>
						<Progress text={data.file} percentage={data.progress} />
					</div>
				))}
			</div>
		)}
		{ready && <ColorScale />}
	</>
	)
}

export default App