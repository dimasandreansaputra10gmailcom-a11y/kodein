import { GoogleGenAI } from "@google/genai";
import { AIPersonality, AIChatMessage } from "../store/useAIStore";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getBuddyChatResponse(userMessage: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Buddy Bot, a friendly AI companion for a coding learning app called Kode.in. 
      You are helping Indonesian students (ages 8-18). 
      Speak in Bahasa Indonesia with a fun, encouraging, and adventurous tone. Use emojis.
      The user said: "${userMessage}"
      Short and helpful response (max 2 sentences):`,
    });
    
    return response.text || "Ups, Buddy Bot sedang istirahat sejenak! Tetap semangat ya! 🚀";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ups, Buddy Bot sedang istirahat sejenak! Tetap semangat ya! 🚀";
  }
}

export async function getAICompanionResponse(
  userMessage: string, 
  history: AIChatMessage[], 
  aiConfig: { name: string; type: AIPersonality }
) {
  try {
    const systemInstruction = `You are an AI Companion named Buddy Bot for an Indonesian coding education platform called Kode.in.
    Your personality rule: You are a friendly tutor. Speak in Bahasa Indonesia. Use simple explanations, beginner-friendly tone, and be encouraging. Do NOT use too many emojis. Keep emojis very minimal.
    Format your response using Markdown (for code blocks, bold, etc.). Keep it concise and helpful.`;

    // Construct history for context (optional, we can pass it as a single string or parts)
    const recentHistory = history.slice(-6).map(msg => `${msg.sender === 'ai' ? 'Buddy Bot' : 'User'}: ${msg.text}`).join('\n');
    
    const prompt = `Context (Conversation History):
${recentHistory}

User: ${userMessage}
Buddy Bot:`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || `Maaf, aku tidak bisa memproses permintaanmu sekarang.`;
  } catch (error) {
    console.error('AI Companion Error: ', error);
    return "Maaf, aku sedang mengalami gangguan koneksi. Coba lagi nanti ya!";
  }
}

export async function getQuizQuestion() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a simple coding quiz for a beginner Indonesian student.
      Return only a JSON object like this:
      {
        "question": "text",
        "options": ["opt1", "opt2", "opt3"],
        "correctIndex": number
      }`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return {
      question: "Apa simbol untuk membuat variabel di Python?",
      options: ["=", ":", "=="],
      correctIndex: 0
    };
  }
}

