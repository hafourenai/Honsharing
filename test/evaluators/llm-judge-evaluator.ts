import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const JUDGE_GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
];

const JUDGE_GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
];

export interface LLMJudgeScore {
  faithfulness: number;
  answerRelevancy: number;
  empathyQuality: number;
  groundedness: number;
  overall: number;
  reasoning: {
    faithfulness: string;
    answerRelevancy: string;
    empathyQuality: string;
    groundedness: string;
  };
}

const JUDGE_SYSTEM_PROMPT = `
Kamu adalah evaluator ketat untuk chatbot curhat bernama Honey.
Tugasmu: nilai respons chatbot berdasarkan 4 dimensi di bawah.
Gunakan skala 0-100. Berikan alasan singkat untuk setiap skor.

4 DIMENSI PENILAIAN:

1. FAITHFULNESS (0-100)
   Apakah klaim dalam respons DIDUKUNG oleh konteks yang diberikan?
   - 100: Semua klaim fully grounded di konteks
   - 70: Sebagian besar grounded, detail kecil dari model
   - 40: Setengah grounded, setengah hallucination
   - 0: Respons tidak pakai konteks sama sekali

2. ANSWER RELEVANCY (0-100)
   Apakah respons menjawab/merespon input user secara langsung?
   - 100: Sangat relevan, langsung merespon inti
   - 70: Relevan tapi sedikit melingkar
   - 40: Kurang relevan, banyak basa-basi
   - 0: Tidak nyambung sama sekali

3. EMPATHY QUALITY (0-100)
   Seberapa empatik responsnya? Ukur validasi, pemahaman, dukungan.
   - 100: Validasi tulus + pemahaman dalam + dukungan hangat
   - 70: Validasi ada tapi generik
   - 40: Sedikit empati, cenderung solutif/distan
   - 0: Tidak ada empati, kaku/dingin

4. GROUNDEDNESS (0-100)
   Apakah respons HANYA menggunakan informasi dari konteks (tidak hallucinate)?
   - 100: 100% based on context, no hallucination
   - 70: Mostly grounded, minor embellishment
   - 40: Some hallucination
   - 0: Hallucinates heavily

OUTPUT: HANYA JSON. Tidak ada teks lain.
{
  "faithfulness": <number>,
  "answerRelevancy": <number>,
  "empathyQuality": <number>,
  "groundedness": <number>,
  "reasoning": {
    "faithfulness": "...",
    "answerRelevancy": "...",
    "empathyQuality": "...",
    "groundedness": "..."
  }
}
`;

export async function evaluateWithLLM(
  response: string,
  userInput: string,
  retrievedContext: string,
): Promise<LLMJudgeScore> {
  const userPrompt = `
=== INPUT USER ===
${userInput}

=== RESPON CHATBOT ===
${response}

=== RETRIEVED CONTEXT ===
${retrievedContext || "(Tidak ada konteks)"}

Nilai respons ini berdasarkan 4 dimensi di atas. Output JSON.
`;

  let rawJson = "";

  if (ai) {
    for (const model of JUDGE_GEMINI_MODELS) {
      try {
        const config: Record<string, unknown> = {
          systemInstruction: { role: "user", parts: [{ text: JUDGE_SYSTEM_PROMPT }] },
          temperature: 0.1,
          maxOutputTokens: 600,
          responseMimeType: "application/json",
          seed: 42,
        };
        if (!model.includes("-lite")) {
          config.thinkingConfig = { thinkingBudget: 0 };
        }
        const completion = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config,
        });
        rawJson = completion.text || "{}";
        break;
      } catch (e) {
        console.warn(`[Judge Fallback] Gemini model ${model} failed, trying next candidate...`);
      }
    }
  }

  if (!rawJson && groq) {
    for (const model of JUDGE_GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: JUDGE_SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.1,
          max_tokens: 600,
          response_format: { type: "json_object" },
        });
        rawJson = completion.choices[0]?.message?.content || "{}";
        break;
      } catch (e) {
        console.warn(`[Judge Fallback] Groq model ${model} failed, trying next candidate...`);
      }
    }
  }

  try {
    if (!rawJson) throw new Error("Semua model judge tidak tersedia");
    const parsed = JSON.parse(rawJson);

    const faithfulness = clamp(parsed.faithfulness ?? 50);
    const answerRelevancy = clamp(parsed.answerRelevancy ?? 50);
    const empathyQuality = clamp(parsed.empathyQuality ?? 50);
    const groundedness = clamp(parsed.groundedness ?? 50);
    const overall = Math.round(
      (faithfulness + answerRelevancy + empathyQuality + groundedness) / 4,
    );

    return {
      faithfulness,
      answerRelevancy,
      empathyQuality,
      groundedness,
      overall,
      reasoning: {
        faithfulness: parsed.reasoning?.faithfulness || "",
        answerRelevancy: parsed.reasoning?.answerRelevancy || "",
        empathyQuality: parsed.reasoning?.empathyQuality || "",
        groundedness: parsed.reasoning?.groundedness || "",
      },
    };
  } catch (error) {
    console.error("LLM-as-Judge error:", error);
    return {
      faithfulness: 0,
      answerRelevancy: 0,
      empathyQuality: 0,
      groundedness: 0,
      overall: 0,
      reasoning: {
        faithfulness: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
        answerRelevancy: "",
        empathyQuality: "",
        groundedness: "",
      },
    };
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}
