import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix } from "../utils";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-2.5-flash-image (Nano Banana)
const MODEL_NAME = 'gemini-2.5-flash-image';

export const generateClothesImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [{ text: `Generate a high-quality, standalone product photo of a piece of clothing based on this description: ${prompt}. The background should be plain white or simple. Do not include a person.` }],
      },
    });

    // Handle potential multiple parts or different structures
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Generate Clothes Error:", error);
    throw error;
  }
};

export const generateTryOn = async (
  personBase64: string,
  clothesBase64: string
): Promise<string> => {
  try {
    const personData = stripBase64Prefix(personBase64);
    const clothesData = stripBase64Prefix(clothesBase64);

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: "Instructions: Create a photorealistic full-body image of the person from the first image wearing the clothing from the second image. \n\n" +
                  "1. Maintain the person's exact facial features, skin tone, and body shape.\n" +
                  "2. Fit the clothing naturally onto the person's body, respecting physics and lighting.\n" +
                  "3. The final image should be a high-quality fashion shot."
          },
          {
            inlineData: {
              mimeType: 'image/png', // Assuming generic png/jpeg compatibility
              data: personData
            }
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: clothesData
            }
          }
        ]
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No try-on image generated.");

  } catch (error) {
    console.error("Gemini Try-On Error:", error);
    throw error;
  }
};
