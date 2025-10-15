import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { ImageData } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash-image';

// Utility to convert data URL to base64 and mimeType
const dataUrlToBlob = (dataUrl: string) => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1];
    const base64 = parts[1];
    if (!mimeType || !base64) {
        throw new Error("Invalid data URL");
    }
    return { base64, mimeType };
};


export const editImageWithPrompt = async (
  originalImage: ImageData,
  prompt: string
): Promise<ImageData> => {
  try {
    const { base64, mimeType } = dataUrlToBlob(originalImage.url);

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (imagePart && imagePart.inlineData) {
      const editedBase64 = imagePart.inlineData.data;
      const editedMimeType = imagePart.inlineData.mimeType;
      return {
        base64: editedBase64,
        mimeType: editedMimeType,
        url: `data:${editedMimeType};base64,${editedBase64}`,
      };
    } else {
      const textResponse = response.text;
      const fallbackError = "The AI couldn't generate an image. It said: " + (textResponse || "No reason given.");
      throw new Error(fallbackError);
    }
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to edit image. ${errorMessage}`);
  }
};
