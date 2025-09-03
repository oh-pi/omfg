
import { GoogleGenAI } from "@google/genai";
import { QueryClassification } from '../types';
import { CLASSIFICATION_PROMPT } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully,
  // but for this context, throwing an error is appropriate.
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

export const classifyPrompt = async (prompt: string): Promise<QueryClassification> => {
  try {
    const response = await ai.models.generateContent({
        model,
        contents: CLASSIFICATION_PROMPT(prompt),
    });

    const classificationText = response.text.trim().toUpperCase();

    if (classificationText === QueryClassification.TRIVIAL) {
      return QueryClassification.TRIVIAL;
    }
    if (classificationText === QueryClassification.COMPLEX) {
      return QueryClassification.COMPLEX;
    }

    console.warn(`Unexpected classification from Gemini: "${classificationText}". Defaulting to COMPLEX.`);
    return QueryClassification.COMPLEX; // Default to complex if parsing fails
  } catch (error) {
    console.error("Error classifying prompt with Gemini:", error);
    // In case of an API error, default to COMPLEX to be safe
    return QueryClassification.COMPLEX;
  }
};
