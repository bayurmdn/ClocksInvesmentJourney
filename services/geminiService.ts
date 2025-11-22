import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JournalEntry } from "../types";

const ASSET_ALLOCATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    value: { type: Type.NUMBER },
    percentage: { type: Type.NUMBER },
    color: { type: Type.STRING, description: "A hex color code suitable for this asset class" }
  },
  required: ["name", "value", "percentage", "color"]
};

const ACTION_ITEM_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    date: { type: Type.STRING },
    asset: { type: Type.STRING },
    action: { type: Type.STRING },
    status: { type: Type.STRING, enum: ["pending", "completed"] }
  },
  required: ["date", "asset", "action", "status"]
};

const PORTFOLIO_STATS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    totalAssets: { type: Type.NUMBER },
    totalPnL: { type: Type.NUMBER },
    pnlPercentage: { type: Type.NUMBER },
    assetBreakdown: {
      type: Type.ARRAY,
      items: ASSET_ALLOCATION_SCHEMA
    }
  },
  required: ["totalAssets", "totalPnL", "assetBreakdown"]
};

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    content: { type: Type.STRING, description: "A comprehensive markdown formatted journal entry with sections for Summary, Growth, and Reflection." },
    stats: PORTFOLIO_STATS_SCHEMA,
    actionPlan: {
      type: Type.ARRAY,
      items: ACTION_ITEM_SCHEMA
    }
  },
  required: ["title", "content", "stats", "actionPlan"]
};

export const analyzePortfolioEntry = async (
  textInput: string,
  imagesBase64?: string[]
): Promise<Partial<JournalEntry>> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is missing. Please ensure it is set in your environment.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const parts: any[] = [];

    // Add Images if they exist
    if (imagesBase64 && imagesBase64.length > 0) {
        imagesBase64.forEach(img => {
             // Strip prefix if present (e.g., "data:image/png;base64,")
            const base64Data = img.includes("base64,") 
                ? img.split("base64,")[1] 
                : img;
                
            parts.push({
                inlineData: {
                mimeType: "image/png", // Assuming PNG or JPEG
                data: base64Data,
                },
            });
        });
    }

    // Add Text Prompt
    const prompt = `
      You are an expert financial analyst and portfolio manager. 
      Analyze the provided notes and/or portfolio screenshots.
      
      Your goal is to create a detailed "Investment Growth Journal" entry.
      
      1. Extract specific numbers: Total Assets, P&L, and Asset Allocation. If multiple images are provided, aggregate the data if they represent different accounts, or take the latest if they are updates.
      2. Generate a professional Markdown summary titled "Investment Growth Journal — [Month Year]".
      3. Identify key insights, market conditions, and specific actionable advice for the next month.
      4. Structure the 'content' field with Markdown headers (##), bold text, and bullet points.
      5. Create a structured action plan.
      
      User Notes: "${textInput}"
      
      Return the response in strict JSON format adhering to the schema.
    `;
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction: "You are WealthArchitect AI, a sophisticated investment companion. Your tone is professional, encouraging, and analytical. You help the user reach Rp1 Billion by 2029."
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsedData = JSON.parse(resultText);
    
    return {
      title: parsedData.title,
      content: parsedData.content,
      stats: parsedData.stats,
      actionPlan: parsedData.actionPlan,
      date: new Date().toISOString(),
      id: crypto.randomUUID(),
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};