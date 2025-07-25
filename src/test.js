import { AutoTokenizer } from '@huggingface/transformers';

const tokenizer_name = 'Xenova/distilgpt2';
const tokenizer = await AutoTokenizer.from_pretrained(tokenizer_name, { quantized: true });

const tokens = tokenizer.encode(["It was the best of times it was the worst of times."]);
const decoded = tokenizer.decode(tokens, { skip_special_tokens: false });
