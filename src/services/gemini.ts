import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ExchangeRateResponse {
  rate: number;
  lastUpdated: string;
  source: string;
  context: string;
}

export async function fetchExchangeRate(from: string, to: string): Promise<ExchangeRateResponse> {
  const prompt = `What is the current exchange rate from ${from} to ${to}? 
  Provide the numeric rate, the approximate last updated time, and a brief 1-sentence context about the current trend or reason for this rate.
  Use Google Search to ensure the data is up-to-date.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rate: { type: Type.NUMBER, description: "The exchange rate value" },
          lastUpdated: { type: Type.STRING, description: "Timestamp or date of the rate" },
          source: { type: Type.STRING, description: "Source of the information" },
          context: { type: Type.STRING, description: "Brief context about the rate trend" },
        },
        required: ["rate", "lastUpdated", "source", "context"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return {
      rate: data.rate || 1,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
      source: data.source || "Google Search",
      context: data.context || "No additional context available.",
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    throw new Error("Failed to fetch exchange rate");
  }
}
