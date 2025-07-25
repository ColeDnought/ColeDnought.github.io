import { AutoModel, AutoTokenizer, softmax } from '@huggingface/transformers';

const model_name = 'Xenova/distilgpt2';
var model = null;
var tokenizer = null;

self.addEventListener('message', async (event) => {

    if (!model || !tokenizer) {
        model = await AutoModel.from_pretrained(model_name, 
            { quantized: true, 
                dtype: 'fp16',
                model_file_name: 'decoder_model',
                progress_callback: x => {
                    self.postMessage(x)
            }});
        tokenizer = await AutoTokenizer.from_pretrained(model_name, { quantized: true });
        model.generation_config.output_scores = true;

        self.postMessage({
            status: 'ready'
        })
    }

    const tokens = await tokenizer(event.data.text, { add_special_tokens: true });
    const generated = await model(tokens);

    self.postMessage({
        status: 'update',
        token: tokenizer.decode([tokens.input_ids[0].ort_tensor.cpuData[0]]),
        prob: 1 / tokenizer.vocab_size,
        prob_sum: 0.5,
        best: '<start>' // Calculated from starting weights
    });

    // Cross-reference logits with the tokenizer vocabulary
    for (let i = 0; i < generated.logits.dims[1] - 1; i++) {
        // Get the token ID and decode it to a string
        const token_id = tokens.input_ids[0].ort_tensor.cpuData[i+1]; // Offset tokens 1 ahead
        const token = tokenizer.decode([token_id]);

        // Get the softmax probabilities for the token
        const probs = softmax(generated.logits[0][i].ort_tensor.cpuData);
        const token_prob = probs[token_id]

        // Get the lower prob density function
        const lower_pdf = probs.reduce((accumulator, currentValue) => {
            if (currentValue <= token_prob){
                return accumulator + currentValue
            } else {
                return accumulator
            }
        }, 0)
        
        // Find the most likely token based on the logits
        const max_val = generated.logits[0][i].max().item()
        const most_likely_ind = generated.logits[0][i].indexOf(max_val)
        const most_likely_token = tokenizer.decode([most_likely_ind])

        console.log(`Token: ${token}, Probability: ${token_prob}, Lower PDF: ${lower_pdf}, Most Likely Token: ${most_likely_token}`);

        self.postMessage({
            status: 'update',
            token: token,
            prob: token_prob,
            prob_sum: lower_pdf,
            best: most_likely_token
        });
    }

    self.postMessage({
        status: 'complete'
    })

});