import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { Pipeline } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Model selection constants
const FLASH_MODEL = 'gemini-2.5-flash';
const PRO_MODEL = 'gemini-3-pro-preview'; // Using preview for complex reasoning

export const generateSqlFromNaturalLanguage = async (
  prompt: string, 
  schemaContext: string
): Promise<string> => {
  try {
    const finalPrompt = `
      You are an expert SQL Data Engineer.
      
      Context Schemas:
      ${schemaContext}

      User Request: "${prompt}"

      Task: Generate a valid ANSI SQL query to answer the user request based on the schema provided.
      Return ONLY the SQL code. Do not use markdown formatting like \`\`\`sql. Just the raw string.
    `;

    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: finalPrompt,
    });

    return response.text?.trim() || "-- Could not generate SQL";
  } catch (error) {
    console.error("Gemini SQL Error:", error);
    return "-- Error generating SQL. Please check API Key or Prompt.";
  }
};

export const analyzePipelinePerformance = async (pipeline: Pipeline): Promise<string> => {
  try {
    const pipelineJson = JSON.stringify(pipeline, null, 2);
    const finalPrompt = `
      You are a Senior Data Architect.
      Analyze the following data pipeline JSON structure.
      Identify potential bottlenecks, suggest optimizations for latency, and verify node types.
      
      Pipeline Data:
      ${pipelineJson}

      Provide a concise, bullet-point analysis.
    `;

    const response = await ai.models.generateContent({
      model: PRO_MODEL, // Using Pro for deeper reasoning
      contents: finalPrompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to analyze pipeline at this time.";
  }
};

export const generateSampleData = async (tableName: string, rowCount: number): Promise<any[]> => {
  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: `Generate ${rowCount} rows of realistic dummy data for a database table named "${tableName}" in JSON format. Return a JSON array of objects. Do not wrap in markdown code blocks.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              value: { type: Type.NUMBER },
              category: { type: Type.STRING },
              timestamp: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    if (response.text) {
      return JSON.parse(response.text);
    }
    return [];
  } catch (error) {
    console.error("Gemini Data Gen Error:", error);
    return [];
  }
};

export const explainSqlError = async (sql: string, errorMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: FLASH_MODEL,
      contents: `The following SQL query failed:\n${sql}\n\nError Message:\n${errorMessage}\n\nExplain why it failed and suggest a fix concisely.`
    });
    return response.text || "No explanation found.";
  } catch (error) {
    return "Could not diagnose error.";
  }
}
