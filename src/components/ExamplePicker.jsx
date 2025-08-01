import './ExamplePicker.css';

const ExamplePicker = ({ onExampleSelect, isVisible }) => {
	// Example prompts
	const examples = {
		'Example 1': 'It was the best of times, it was the worst of times.',
		'Example 2': 'It was the best of times, it was the BLURST of times?!'
	};

	const handleExampleChange = (e) => {
		const selectedExample = e.target.value;
		if (selectedExample && examples[selectedExample]) {
			onExampleSelect(examples[selectedExample]);
		}
	};

	if (!isVisible) return null;

	return (
		<select className="example-picker" onChange={handleExampleChange} defaultValue="">
			<option value="">Try an example</option>
			<option value="Example 1">Example 1</option>
			<option value="Example 2">Example 2</option>
		</select>
	);
};

export default ExamplePicker;
