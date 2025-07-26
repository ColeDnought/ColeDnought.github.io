import NamePlate from "../components/NamePlate";
import Token from "../components/Token";
import { Link } from "react-router";
import './FAQ.css'

const FAQ = () => {
  return (
    <div className="faq">
        <Link to="/" className="back-arrow">&larr;</Link>
        <h2>You may have some questions, like:</h2>
        <div className="questions">
            <a href="#1"><span>What is <NamePlate />?</span></a>
            <a href="#2"><span>How do I use it?</span></a>
            <a href="#3"><span>How does it work?</span></a>
        </div>

        <div id="1" className="question">
            <h3>What is <NamePlate />?</h3>
            <p>You may have heard of Large Language Models (LLMs) such as ChatGPT. 
                These models are designed to approximate human language. 
                If you have heard of these models, you might have asked:</p>
            <p><i>How do they work?</i></p>
            <p>The short answer is that a Language Model finds the probability of the next word, given the words that are already there.
                On the surface, this is mechanically like the autocomplete that your phone keyboard does. 
                Of course, there's a lot more going on behind the scenes</p>
            <p>For each word, a LLM provides a probability distribution over it's entire vocabulary. 
                The words that a model thinks are most likely to come next are assigned higher probabilities.
                To pick the next word, a model will sample the probability distribution and then add it to the end of the sequence.
                Then the process repeats until the model thinks its time to stop</p>
            
            <p><NamePlate /> is a tool to explore those probabilites.
            For a sequence of words, you can see which ones the model thinks are likely, and which ones surprise it</p>
        </div>

        <div id="2" className="question">
            <h3>How do I use <NamePlate />?</h3>
            <p>To use <NamePlate />, simply type a sequence of words into the input box. 
            After giving the model a moment to load, it will display your input with color-coded probabilities: red for low probability words, and blue for high probability ones.
            If you hover over a word, you can see the word the model thinks is most likely for that position. Give it a try:</p>
            <p className="output"><Token token="Try" probability={1.0} alternative="Try" /> <Token token="me" probability={0.3} alternative="it" /></p>
        </div>
        <div id="3" className="question">
            <h3>How does this all work?</h3>
            <p>Large Language Models are, well, <strong>large</strong>. 
            However, <NamePlate /> runs <i>entirely in your browser</i>.
            This means that we don't need any special hardware, and all your data stays right here.</p>
            <p>How was this done? The first step is shrinking a Large Language Model. 
            This was done using a process called <a href="https://arxiv.org/abs/1503.02531">Knowledge Distillation</a>, 
            where a large model is used to "teach" a smaller, more efficient model. <NamePlate /> uses
            a <a href="https://huggingface.co/distilbert/distilgpt2">distilled version of GPT-2</a>, a predecessor of ChatGPT.</p>
            <p>This is why the <NamePlate /> takes a moment to load at the beginning, we're downloading the entire model!</p>
            <p>Once we've distilled a model, we have to use it. To do this, <NamePlate /> leverages 
            the <a href="https://huggingface.co/docs/transformers.js/index">Transformers.js library</a> and <a href="https://onnxruntime.ai/docs/">Open Neural Network Exchange (ONNX) Runtime</a>
            These open-source libraries allow our model to run in your browser without any setup.</p>

            <p>If you would like to see more technical details or contribute to this project, I 
                encourage you to check out the <a href="">codebase</a>
            </p>
        </div>
    </div>
  );
};

export default FAQ;
