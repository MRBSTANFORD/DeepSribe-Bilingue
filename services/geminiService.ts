
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentData, ProcessedTopic, GroundingChunk } from "../types";
import { generateId } from "../utils/storageUtils";

// CRITICAL: Force strict isolation of the API key to ensure developer is never billed for user activity.
const getAIClient = () => {
  // 1. Check Local Storage First (User's Manual Entry)
  const userKey = localStorage.getItem('deepscribe_user_apikey');
  if (userKey && userKey.trim().length > 10) {
    return new GoogleGenAI({ apiKey: userKey.trim() });
  }

  // 2. Fallback to Bridge (process.env.API_KEY injected by AI Studio Bridge)
  // We ONLY use this if confirmed to be the bridge environment
  const bridgeKey = process.env.API_KEY;
  if (bridgeKey && bridgeKey !== "" && window.aistudio) {
    return new GoogleGenAI({ apiKey: bridgeKey });
  }

  // If no user-provided key is found, we throw. 
  // This is the absolute fail-safe against dev billing.
  throw new Error("API_KEY_REQUIRED_FOR_BILLING_SAFETY");
};

const transcriptionSchema = {
  type: Type.OBJECT,
  properties: {
    language: { type: Type.STRING },
    summary: { type: Type.STRING },
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      }
    },
    transcription: { type: Type.STRING }
  },
  required: ["language", "summary", "topics", "transcription"]
};

const formatTranscription = (text: string): string => {
  if (!text) return "";
  return text.replace(/\s*(\[\d{2}:\d{2}\])\s*/g, '\n\n$1 ').trim(); 
};

export const generateDocumentFromAudio = async (
  base64Audio: string,
  mimeType: string,
  systemInstruction: string,
  targetLanguage: string
): Promise<DocumentData> => {
  const ai = getAIClient();
  const languageInstruction = targetLanguage === 'Same as Audio' ? 'the same language as the audio' : targetLanguage;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType: mimeType } },
          { text: `Listen to this audio. Detect language. Summary, Topics, and Transcription in ${languageInstruction}. Output JSON.` }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: transcriptionSchema,
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (parsed.transcription) parsed.transcription = formatTranscription(parsed.transcription);
    return { ...parsed, id: generateId(), createdAt: Date.now() } as DocumentData;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

export const generateDocumentFromTranscript = async (
  transcript: string,
  systemInstruction: string,
  targetLanguage: string
): Promise<DocumentData> => {
  const ai = getAIClient();
  const languageInstruction = targetLanguage === 'Same as Audio' ? 'the same language as the transcript' : targetLanguage;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: `Raw transcript: ${transcript}. Task: Detect language. Summary, Topics, Transcription in ${languageInstruction}. Output JSON.` }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: transcriptionSchema,
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    if (parsed.transcription) parsed.transcription = formatTranscription(parsed.transcription);
    return { ...parsed, id: generateId(), createdAt: Date.now() } as DocumentData;
  } catch (error) {
    console.error("Transcript processing error:", error);
    throw error;
  }
};

export const enrichTopicWithSearch = async (
  topicTitle: string,
  topicContext: string,
  language: string,
  promptTemplate: string
): Promise<{ text: string, sources: { title: string; uri: string }[] }> => {
  const ai = getAIClient();
  try {
    const prompt = promptTemplate.replace("{{TOPIC}}", topicTitle).replace("{{CONTEXT}}", topicContext).replace("{{LANGUAGE}}", language);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    const text = response.text || "";
    const sources: { title: string; uri: string }[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[];
      chunks.forEach(chunk => { if (chunk.web?.uri && chunk.web?.title) sources.push({ title: chunk.web.title, uri: chunk.web.uri }); });
    }
    return { text, sources: sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i) };
  } catch (error) {
    console.error("Enrichment error:", error);
    return { text: "Search failed.", sources: [] };
  }
};

export const chatWithDocument = async (
  documentContext: string,
  history: { role: 'user' | 'model', text: string }[],
  newMessage: string,
  useWeb: boolean = false
): Promise<string> => {
  const ai = getAIClient();
  const chatHistory = history.map(h => ({ role: h.role, parts: [{ text: h.text }] }));
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: chatHistory,
      config: {
        tools: useWeb ? [{ googleSearch: {} }] : undefined,
        systemInstruction: `Analyze doc: ${documentContext}`
      }
    });
    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "No response.";
  } catch (error) {
    console.error("Chat error", error);
    return "Error communicating with AI.";
  }
};

export const generateMarketingImage = async (prompt: string): Promise<string | null> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] }
    });
    if (response.candidates?.[0]?.content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image gen error", error);
    throw error;
  }
};
