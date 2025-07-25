import { useEffect, useRef, useState } from 'react'
import Progress from './components/Progress'
import ProbToken from './components/Token'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  	// Model loading
  	const [ready, setReady] = useState(null);
  	const [disabled, setDisabled] = useState(false);
  	const [progressItems, setProgressItems] = useState([]);

  	// Inputs and outputs
  	const [input, setInput] = useState('It was the best of times, it was the worst of times.');
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

	return (
	<>
		<Header />
		<div className='container'>
			<textarea value={input} rows={3} onChange={e => setInput(e.target.value)}></textarea>
			{outputTokens.length > 0 && (
				<div className='output'>
					{outputTokens.map((item, idx) => (
						<ProbToken key={idx} token={item.token} probability={item.probability} alternative={item.best} />
					))}
				</div>
			)}
		</div>

		<button disabled={disabled} onClick={score}>Score</button>
	
		<div className='progress-bars-container'>
		{ready === false && (
			<label>Loading model...</label>
		)}
		{progressItems.map(data => (
			<div key={data.file}>
			<Progress text={data.file} percentage={data.progress} />
			</div>
		))}
		</div>
	</>
	)
}

export default App