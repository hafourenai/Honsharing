/**
 * ============================================================
 * MOCK LLM RESPONSE — SIMULASI RESPON DARI GROQ LLM
 * ============================================================
 *
 * File ini menyediakan mock untuk respons LLM.
 * Mensimulasikan output dari Groq API (Llama 3.3 70B)
 * tanpa perlu memanggil API asli.
 *
 * Tujuan:
 * - Testing tidak bergantung pada API Groq
 * - Respons konsisten untuk evaluasi
 * - Bisa mensimulasikan berbagai skenario emosional
 *
 * STRATEGI:
 *   Setiap skenario memiliki template respons yang sudah
 *   ditentukan. Template ini mencerminkan gaya bicara chatbot
 *   "Honey" yang hangat dan casual.
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { Chunk } from "@/lib/rag/promptBuilder";
import { TEST_CONFIG } from "@/test/config/test-config";

// TEMPLATE RESPONS PER SKENARIO

/**
 * Template respons untuk setiap kategori emosional.
 * Setiap template memiliki variasi yang bisa dipilih.
 */
const RESPONSE_TEMPLATES: Record<string, string[]> = {
  overthinking: [
    "Kok bisa sih kamu sampe mikir gitu? Cerita dong, aku dengerin. Pikiran yang muter-muter terus emang capek banget ya... Kadang kita suka lupa kalo ga semua pikiran itu fakta. Ada yang bisa kamu kontrol, ada yang ga. Yang penting, kamu udah sadar kalo ini terjadi, itu langkah pertama yang bagus banget.",

    "Wajar kok kalo pikiran kita tiba-tiba lari kemana-mana, apalagi pas lagi sendiri. Tapi inget ya, kamu ga sendirian. Aku disini buat dengerin cerita kamu. Coba ceritain pelan-pelan, apa yang paling bikin kamu khawatir?",

    "Overthinking itu kaya siklus ya, makin dipikirin makin muter. Tapi gapapa, kita hadapin bareng-bareng. Coba kita liat satu-satu, mana yang bener-bener perlu dipikirin dan mana yang cuma asumsi.",
  ],
  anxiety: [
    "Hai, aku denger kamu lagi ga enak badan karena cemas ya. Coba tarik napas dulu pelan-pelan, aku tungguin kok. Kamu aman disini. Coba ceritain, apa yang bikin kamu merasa cemas?",

    "Perasaan cemas itu berat banget dijalanin, aku tau. Tapi kamu hebat loh udah bisa cerita. Kita hadapin pelan-pelan ya. Coba kamu rasakan napas kamu, hirup... lalu hembuskan pelan-pelan.",
  ],
  relationship: [
    "Perasaan kayak gitu emang sering muncul sih, apalagi kalo kita bener-bener sayang sama seseorang. Tapi kamu harus tau, kamu berharga apapun yang terjadi. Kamu ga perlu jadi 'cukup baik' buat dicintai, karena kamu udah berharga dari diri kamu sendiri.",

    "Aku denger kamu lagi sedih soal hubungan. Ceritain ke aku dong, pelan-pelan aja. Kadang dengan cerita, hati kita jadi lebih lega. Dan inget ya, perasaan kamu itu valid.",
  ],
  loneliness: [
    "Kesepian itu emang berat banget ya, apalagi pas lagi sendiri. Tapi kamu tau? Kamu berani cerita disini itu udah langkah yang besar. Aku disini buat nemenin kamu, kamu ga sendiri.",

    "Iya, kadang lingkungan sekitar kita bikin kita merasa sendiri meskipun banyak orang. Tapi kamu selalu punya tempat disini. Cerita aja apa yang kamu rasakan, aku bakal dengerin.",
  ],
  motivation: [
    "Kehilangan semangat itu wajar kok, manusiawi banget. Kita bukan robot yang bisa terus-terusan produktif. Gapapa buat istirahat dulu, ngatur napas, ngumpulin tenaga lagi. Pelan-pelan aja, ga usah buru-buru.",

    "Kadang kita butuh jeda buat ngecas diri sendiri, dan itu ga masalah. Kamu ga perlu bandingin proses kamu sama orang lain. Setiap orang punya waktunya masing-masing.",
  ],
  stress: [
    "Tugas numpuk gitu bikin stress banget ya... Apalagi kalo semuanya harus selesai bersamaan. Tapi inget ya, kamu udah berusaha keras. Coba kita break down satu-satu, biar ga keliatan berat banget.",

    "Stress kuliah itu nyata, dan kamu berhak buat merasa capek. Tapi jangan lupa istirahat ya. Otak dan tubuh kamu butuh recharge. Kamu bukan mesin, kamu manusia.",
  ],
};

// DEFAULT RESPONS (FALLBACK)

/**
 * Respons default jika tidak ada template yang cocok.
 */
const DEFAULT_RESPONSE =
  "Aku denger kamu. Ceritain aja semuanya, aku disini buat kamu. Kadang dengan berbagi, beban kita jadi terasa lebih ringan.";

// GENERATE RESPONS BERDASARKAN CHUNKS

/**
 * Memilih template respons yang paling sesuai berdasarkan chunks.
 *
 * Strategi:
 * 1. Cek metadata.topic dari chunks yang diretrieve
 * 2. Pilih template yang sesuai dengan topik teratas
 * 3. Pilih variasi secara acak
 *
 * @param relevantChunks - Chunks yang diretrieve dari RAG
 * @returns Respons teks
 */
export function generateMockResponse(relevantChunks: Chunk[]): string {
  // Jika tidak ada chunk, gunakan default
  if (relevantChunks.length === 0) {
    return DEFAULT_RESPONSE;
  }

  // Ambil topik dari chunk dengan score tertinggi
  const primaryTopic = relevantChunks[0]?.metadata?.topic || "unknown";

  // Cari template yang sesuai
  const templates = RESPONSE_TEMPLATES[primaryTopic];

  if (!templates || templates.length === 0) {
    // Fallback: cari berdasarkan emosi
    const primaryEmotion = relevantChunks[0]?.metadata?.emotion?.[0];
    for (const [topic, responses] of Object.entries(RESPONSE_TEMPLATES)) {
      if (topic === primaryEmotion) {
        return responses[0];
      }
    }
    return DEFAULT_RESPONSE;
  }

  // Pilih variasi template secara acak
  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

// STREAMING MOCK

/**
 * Mensimulasikan streaming respons token-by-token.
 *
 * @param text - Teks respons lengkap
 * @param onToken - Callback untuk setiap token
 * @param delay - Delay antar token (ms)
 */
export async function mockStreamResponse(
  text: string,
  onToken: (token: string) => void,
  delay: number = TEST_CONFIG.mockLLM.streamingDelay,
): Promise<void> {
  // Split menjadi kata-kata
  const words = text.split(" ");

  for (let i = 0; i < words.length; i++) {
    const token = words[i] + (i < words.length - 1 ? " " : "");
    onToken(token);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// MOCK FUNGSI UTAMA

/**
 * Mock untuk fungsi ragQueryStream.
 *
 * Menggantikan seluruh pipeline:
 * 1. Retrieval (mock)
 * 2. Build konteks
 * 3. Generate respons (mock)
 * 4. Stream respons
 *
 * @param userQuery - Query user
 * @param relevantChunks - Chunks hasil retrieval
 * @param onToken - Callback streaming
 * @returns Promise dengan respons lengkap
 */
export async function mockRagQueryStream(
  userQuery: string,
  relevantChunks: Chunk[],
  onToken?: (token: string) => void,
): Promise<{ answer: string }> {
  // Generate respons berdasarkan chunks
  const fullResponse = generateMockResponse(relevantChunks);

  // Jika ada callback streaming, kirim token
  if (onToken) {
    await mockStreamResponse(fullResponse, onToken);
  }

  return { answer: fullResponse };
}

/**
 * Mendapatkan respons yang sudah ditentukan untuk pengujian
 * deterministik. Berguna untuk evaluasi yang membutuhkan
 * respons yang persis sama setiap kali.
 *
 * @param scenarioId - ID skenario
 * @returns Respons teks yang sudah ditentukan
 */
export function getDeterministicResponse(scenarioId: string): string {
  const deterministicResponses: Record<string, string> = {
    // Overthinking
    overthinking_001:
      "Wajar kok kalo pikiran kita tiba-tiba lari kemana-mana, apalagi pas lagi sendiri. Tapi inget ya, kamu ga sendirian. Aku disini buat dengerin cerita kamu.",

    overthinking_002:
      "Pikiran yang muter-muter terus emang capek banget ya... Kadang kita suka lupa kalo ga semua pikiran itu fakta. Ada yang bisa kamu kontrol, ada yang ga.",

    // Anxiety
    anxiety_001:
      "Coba tarik napas dulu pelan-pelan, aku tungguin kok. Kamu aman disini. Perasaan cemas itu berat banget dijalanin, tapi kamu hebat loh udah bisa cerita.",

    anxiety_002:
      "Ngadepin situasi kayak gitu emang ga gampang. Tapi kamu berani cerita itu udah langkah besar. Kita hadapin pelan-pelan ya.",

    // Relationship
    relationship_001:
      "Perasaan kayak gitu emang sering muncul sih. Tapi kamu harus tau, kamu berharga apapun yang terjadi. Kamu ga perlu jadi 'cukup baik' buat dicintai.",

    relationship_002:
      "Sakit banget pasti ngalamin hal kayak gitu. Ga heran kalo kamu jadi susah percaya lagi. Tapi pelan-pelan, kamu bisa pulih kok.",

    // Loneliness
    loneliness_001:
      "Kesepian itu emang berat banget ya, apalagi di keramaian. Tapi kamu tau? Kamu berani cerita disini itu udah langkah yang besar. Aku disini buat kamu.",

    loneliness_002:
      "Mencari koneksi yang beneran tuh emang ga gampang. Tapi kamu ga sendiri, dan pasti ada orang yang bisa ngerti kamu.",

    // Motivation
    motivation_001:
      "Kehilangan semangat itu wajar kok, manusiawi banget. Gapapa buat istirahat dulu, ngatur napas, ngumpulin tenaga lagi.",

    // Stress
    stress_001:
      "Tugas numpuk gitu bikin stress banget ya. Tapi inget, kamu udah berusaha keras. Coba kita break down satu-satu, biar ga keliatan berat banget.",

    stress_002:
      "Capek banget ya kalo kuliah terus tanpa jeda. Istirahat itu penting, kamu bukan mesin. Jangan lupa jaga diri kamu ya.",

    stress_003:
      "Tugas numpuk dan susah mulai itu emang berat banget ya. Apalagi makin ditunda makin panik. Tapi gapapa kok, kamu ga sendiri. Coba kita mulai dari yang paling kecil dulu, pelan-pelan aja.",

    // Insecure / Self Doubt
    self_doubt_001:
      "Rasa kayak gitu pasti berat banget ya. Padahal kamu udah berusaha keras, tapi rasanya tetep ga cukup. Tapi inget ya, nilai bukan ukuran satu-satunya. Proses setiap orang beda-beda, dan kamu berharga apapun nilai kamu.",

    self_doubt_002:
      "Wah, selamat dapet beasiswa! Tapi kok malah takut ya? Impostor syndrome emang nyata dan banyak orang ngalamin. Kamu pantas dapet itu, percaya deh. Usaha kamu yang dapetin itu, bukan keberuntungan.",

    insecure_001:
      "Perasaan insecure soal penampilan itu berat banget ya, apalagi kalo setiap liat cermin rasanya ga pede. Tapi kamu tau? Nilai diri kamu ga cuma dari penampilan fisik. Kamu berharga lebih dari itu.",

    insecure_002:
      "Rasa takut kalo orang lain ga suka sama kita tuh emang sering muncul. Tapi inget ya, perasaan itu valid. Ga semua orang harus suka sama kita, dan itu ga ngaruh sama nilai diri kamu.",

    // Keluarga
    keluarga_001:
      "Konflik sama orang tua emang berat banget ya. Apalagi kalo kita merasa ga didenger. Tapi wajar kok kalo kamu punya keinginan buat hidup sesuai cara kamu sendiri. Ceritain lebih lanjut dong, gimana perasaan kamu?",

    keluarga_002:
      "Perasaan kamu valid banget. Perceraian orang tua itu berat buat siapapun, dan pasti ada rasa sedih, bingung, bahkan mungkin salah. Tapi inget ya, ini bukan salah kamu. Kamu berhak bahagia.",

    keluarga_003:
      "Ekspektasi keluarga yang tinggi bikin capek ya. Rasanya kayak hidup buat orang lain terus. Tapi kamu berhak punya mimpi dan jalan sendiri. Wajar kok kalo kamu merasa lelah dan tertekan.",

    keluarga_004:
      "Keluarga yang ga bisa diajak ngobrol dari hati ke hati emang bikin sesek ya. Tapi kamu selalu punya tempat disini. Cerita aja apa yang kamu rasakan, aku bakal dengerin tanpa menghakimi.",

    // Burnout
    burnout_001:
      "Capek yang dalem banget itu nyata dan berat. Rutinitas yang gitu-gitu aja emang bikin jenuh. Tapi istirahat itu bukan kelemahan. Kamu berhak berhenti sejenak, ngatur napas, dan ngumpulin tenaga lagi.",

    burnout_002:
      "Wah, itu pasti berat banget. 3 organisasi plus SKS banyak, wajar kalo kamu sampe nangis kelelahan. Kamu bukan mesin. Kalo memang perlu mundur, itu bukan kegagalan. Itu bentuk sayang sama diri sendiri.",

    burnout_003:
      "Konflik antara 'harus produktif' dan 'butuh istirahat' itu capek banget ya. Tapi dengerin tubuh kamu, dia tau kapan waktunya berhenti. Istirahat bukan kelemahan, itu kebutuhan manusiawi.",

    // Additional overthinking & anxiety
    overthinking_003:
      "Mikirin masa depan emang bikin cemas ya, apalagi kalo malam hari. Tapi inget, ga semua hal harus kamu pikirin sekarang. Ada hal yang bisa kamu kontrol, ada yang ga. Fokus aja ke langkah kecil hari ini.",

    overthinking_004:
      "Membandingkan diri sama orang lain emang bikin ga enak ya. Tapi setiap orang punya jalan dan waktunya masing-masing. Perbandingan itu ga adil karena kita cuma liat hasil akhir orang, bukan prosesnya.",

    anxiety_003:
      "Cemas soal kesehatan itu berat banget ya, apalagi kalo pikiran terus berkata 'gimana kalo...'. Tapi kamu udah berusaha dengan periksa ke dokter, itu langkah yang baik. Coba tarik napas pelan-pelan ya.",

    anxiety_004:
      "Deg-degan sama ujian itu wajar kok, apalagi kalo udah deket hari-H. Tapi inget, kamu udah belajar dan persiapan. Percaya sama diri kamu sendiri. Coba tarik napas, hembuskan pelan-pelan.",

    // Additional relationship
    relationship_003:
      "Berantem sama pasangan karena kesalahpahaman itu bikin capek ya. Apalagi kalo udah saling ga ngerti. Tapi konflik itu wajar dalam hubungan. Coba ceritain pelan-pelan, apa yang sebenernya kamu rasakan?",

    // Additional motivation
    motivation_002:
      "Bingung sama arah hidup itu wajar banget, apalagi di usia 20-an. Ga semua orang punya jalan yang jelas, dan itu ga masalah. Hidup adalah proses eksplorasi, nikmati aja perjalanannya pelan-pelan.",

    motivation_003:
      "Perasaan ga berguna itu berat banget ya. Tapi percaya deh, kamu lebih berarti dari yang kamu kira. Nilai diri kamu bukan dari seberapa banyak yang kamu lakuin atau capai. Kamu berharga hanya dengan menjadi diri sendiri.",

    // Additional loneliness
    loneliness_003:
      "Pindah ke kota baru dan jauh dari keluarga emang berat. Wajar kalo kamu nangis kangen rumah. Butuh waktu untuk beradaptasi. Tapi kamu berani cerita disini itu udah langkah besar loh. Pelan-pelan ya.",

    loneliness_004:
      "Kehilangan kontak sama sahabat lama itu sedih banget ya. Apalagi kalo dulu deket banget. Tapi kenangan indah kalian ga akan hilang. Dan mungkin nanti akan ada koneksi baru yang sama berartinya.",
  };

  return deterministicResponses[scenarioId] || DEFAULT_RESPONSE;
}
