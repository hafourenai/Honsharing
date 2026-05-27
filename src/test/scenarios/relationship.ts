/**
 * ============================================================
 * SKENARIO TESTING: RELATIONSHIP PROBLEM
 * ============================================================
 *
 * Skenario ini menguji kemampuan chatbot dalam menangani
 * curhat tentang masalah hubungan — baik dengan pasangan,
 * teman, maupun keluarga.
 *
 * Karakteristik relationship problem:
 * - Insecure dalam hubungan
 * - Rasa tidak pantas / takut ditinggalkan
 * - Pengkhianatan atau broken trust
 * - Konflik komunikasi
 *
 * @author  Tim Skripsi
 * @version 1.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

/**
 * Skenario 1: Romantic insecurity
 * User merasa tidak pantas untuk pasangan.
 */
export const relationshipInsecurityScenario: TestScenario = {
  id: "relationship_001",
  name: "Rasa Tidak Pantas dalam Hubungan",
  category: "relationship",

  userInput:
    "Aku merasa ga pantas buat pacarku. Dia baik banget, sementara aku... aku merasa biasa aja. Kayak dia bakal ninggalin aku suatu saat karena dia bisa dapet yang lebih baik dari aku.",

  expectedRetrievedContext: [
    {
      chunkId: "test_relationship_001",
      topic: "romantic insecurity",
      situation:
        "User merasa tidak pantas untuk orang yang disukai atau dicintai",
      expectedRelevanceScore: 0.9,
      emotions: ["insecure", "fear_of_rejection", "self_doubt"],
      needs: ["reassurance", "emotional safety", "validation"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan insecure tanpa memperkuatnya",
    "Bantu user melihat nilai dirinya sendiri",
    "Normalisasi rasa takut dalam hubungan",
    "Berikan reassurance yang sehat (tergantung konteks)",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional yang hangat",
    "Tidak memberikan siap untuk 'memperbaiki diri'",
    "Mengangkat self-worth user tanpa terkesan menggurui",
    "Menggunakan nada yang casual dan hangat",
    "Tidak memvalidasi ketakutan user secara berlebihan",
  ],

  requiredKeywords: [
    "berharga",
    "paham",
    "wajar",
    "rasa",
    "sayang",
    "cerita",
  ],

  forbiddenKeywords: [
    "emang iya",
    "mungkin dia",
    "cari yang lain",
    "putusin aja",
    "lebay",
  ],

  severityLevel: 3,
}

/**
 * Skenario 2: Broken trust / pengkhianatan
 * User mengalami pengkhianatan dan sulit percaya lagi.
 */
export const relationshipTrustScenario: TestScenario = {
  id: "relationship_002",
  name: "Pengkhianatan dalam Hubungan",
  category: "relationship",

  userInput:
    "Pacarku selingkuh. Aku tahu dari temenku, dan pas aku tanyain dia ngaku. Aku hancur banget, rasanya pengen tutup hati aja. Kayak aku ga percaya sama siapapun lagi.",

  expectedRetrievedContext: [
    {
      chunkId: "test_relationship_002",
      topic: "broken trust",
      situation:
        "User mengalami pengkhianatan dalam hubungan, kesulitan untuk percaya lagi",
      expectedRelevanceScore: 0.95,
      emotions: ["hurt", "betrayal", "distrust", "sadness"],
      needs: ["healing", "validation", "support"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi rasa sakit dan pengkhianatan",
    "Normalisasi kesulitan untuk percaya lagi",
    "Dukung proses penyembuhan emosional",
    "Tidak mendorong untuk 'move on' secara instan",
  ],

  expectedResponseCriteria: [
    "Mengandung empati yang dalam",
    "Tidak menyalahkan korban",
    "Tidak mendorong balas dendam",
    "Tidak memberikan saran 'move on' yang tergesa-gesa",
    "Mengakui validitas rasa sakit user",
    "Tidak membandingkan dengan pengalaman orang lain",
  ],

  requiredKeywords: [
    "sakit",
    "paham",
    "berat",
    "sulit",
    "percaya",
    "wajar",
    "sembuh",
  ],

  forbiddenKeywords: [
    "maafin aja",
    "lupakan",
    "udah biasa",
    "cari yang baru",
    "dendam",
    "balas",
    "emang salah kamu",
  ],

  severityLevel: 5,
}

/**
 * Skenario 3: Kesalahpahaman dalam hubungan
 * User mengalami konflik komunikasi dengan pasangan.
 */
export const relationshipMiscommunicationScenario: TestScenario = {
  id: "relationship_003",
  name: "Kesalahpahaman dengan Pasangan",
  category: "relationship",

  userInput:
    "Aku lagi berantem sama pacarku karena kesalahpahaman. Dia ngira aku ga peduli, padahal aku sibuk banget. Tiap kali mau jelasin, malah tambah ribut. Capek rasanya, kayak kita ga saling ngerti lagi.",

  expectedRetrievedContext: [
    {
      chunkId: "test_relationship_001",
      topic: "romantic insecurity",
      situation:
        "User mengalami konflik komunikasi dengan pasangan, merasa tidak dipahami",
      expectedRelevanceScore: 0.7,
      emotions: ["frustrated", "hurt", "insecure"],
      needs: ["validation", "understanding", "connection"],
    },
  ],

  expectedEmotionalDirection: [
    "Validasi perasaan capek karena konflik",
    "Normalisasi bahwa konflik dalam hubungan itu wajar",
    "Bantu user mengeksplorasi perasaannya dengan tenang",
    "Tawarkan perspektif tanpa menyalahkan siapapun",
  ],

  expectedResponseCriteria: [
    "Mengandung validasi emosional",
    "Tidak memihak atau menyalahkan siapapun",
    "Tidak memberi saran yang memicu konflik lebih lanjut",
    "Menggunakan nada yang netral dan hangat",
  ],

  requiredKeywords: [
    "paham",
    "berat",
    "capek",
    "rasa",
    "cerita",
    "wajar",
    "pelan",
  ],

  forbiddenKeywords: [
    "putusin aja",
    "salah dia",
    "salah kamu",
    "cuekin",
    "lebay",
  ],

  severityLevel: 3,
}
