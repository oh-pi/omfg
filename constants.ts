
export const CLASSIFICATION_PROMPT = (query: string) => `
Analyze the user's query and classify it as either "TRIVIAL" or "COMPLEX".

- A "TRIVIAL" query is simple, fact-based, can be answered concisely, or involves a single, straightforward task. Examples: "What is the capital of France?", "Summarize this sentence", "Translate 'hello' to Spanish".
- A "COMPLEX" query requires reasoning, creativity, in-depth explanation, multi-step thinking, or code generation. Examples: "Explain quantum entanglement in simple terms", "Write a python script to parse a log file", "Plan a 3-day trip to Tokyo".

Respond with only the single word "TRIVIAL" or "COMPLEX".

User Query: "${query}"
`;
