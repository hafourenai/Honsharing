import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  try {
    const completion = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: userPrompt,
      config: {
        systemInstruction: { role: "user", parts: [{ text: JUDGE_SYSTEM_PROMPT }] },
        temperature: 0.1,
        maxOutputTokens: 600,
        responseMimeType: "application/json",
        seed: 42,
      },
    });

    const raw = completion.text || "{}";
    const parsed = JSON.parse(raw);

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
