import { Chunk } from "@/lib/rag/promptBuilder";
import { TEST_CONFIG } from "@test/config/test-config";

const RESPONSE_TEMPLATES: Record<string, string[]> = {
  "mental health": [
    "capek ya rasanya kalau semuanya numpuk bareng. kamu ga harus kuat terus terusan.",
    "kayaknya kamu udah terlalu lama nahan sendiri. capek banget ya.",
  ],
  "mental state": [
    "ngerasa kosong atau ga semangat itu berat ya. kadang itu tanda kamu butuh istirahat yang beneran.",
    "ga semangat bukan berarti kamu males. phase kayak gini emang berat, apalagi kalau ga tau kenapa.",
  ],
  relationship: [
    "perasaan kayak gitu emang sering muncul sih kalau lagi suka sama orang. jangan langsung ngerasa kamu kurang dulu dong.",
    "kalau dia berubah dikit aja emang langsung bikin kepikiran ya. coba jangan nyalahin diri sendiri dulu.",
    "takut kehilangan orang yang penting emang bikin hati ga tenang. makin sayang makin takut kehilangan.",
    "habis putus itu emang berat, apalagi kalau hubungannya udah lama. move on ga pernah semudah yang orang bilang.",
  ],
  social: [
    "kadang emang bisa ngerasa sepi walaupun rame ya. kayaknya yang kamu rasain lebih ke ga bener bener dimengerti.",
    "kesepian di keramaian itu berat banget ya. tapi kamu berani cerita disini itu udah langkah yang besar.",
  ],
  "self worth": [
    "bandingin diri sama orang lain emang capek sih. kadang kita terlalu keras sama diri sendiri.",
    "ngerasa tertinggal itu berat, tapi setiap orang punya jalurnya masing-masing.",
  ],
  family: [
    "kalau terus terusan ga dimengerti pasti capek banget sih. kadang yang paling nyakitin justru pas rumah sendiri ga terasa nyaman.",
    "capek sama ekspektasi keluarga itu wajar. kamu berhak punya jalan hidup sendiri.",
  ],
  academic: [
    "skripsi emang bisa jadi beban yang terasa ga ada habisnya. tekanan akademik itu nyata, bukan lebay.",
    "tugas numpuk gitu bikin stress banget ya. kamu udah berusaha keras kok.",
  ],
  friendship: [
    "dikhianatin sama orang yang kamu percaya itu beda sakitnya. berantem sama sahabat itu berat karena tarikannya juga lebih besar.",
    "hubungan pertemanan yang renggang emang berat, apalagi kalau dulu deket banget.",
  ],
  "self identity": [
    "ga tau mau jadi apa itu bukan kelemahan, banyak orang ada di titik yang sama. ngerasa hilang arah itu berat, tapi itu juga bagian dari proses ngenal diri sendiri.",
    "ngerasa kayak semua orang tau jalurnya kecuali kamu itu exhausting banget.",
  ],
  "work or academic": [
    "ngerasa kayak ga layak di antara orang orang yang kompeten itu capek banget. banyak orang yang sebenernya sangat capable justru paling sering ngerasa kayak penipu.",
    "perasaan kayak penipu itu punya nama, imposter syndrome. dan ironinya, yang paling sering ngerasain itu justru orang orang yang sebenernya capable.",
  ],
  loss: [
    "kehilangan seseorang yang penting itu berat banget, ga ada timeline yang bener buat berduka. ga harus langsung oke, ini memang sakit.",
    "turut berduka ya. masih ga percaya itu wajar banget, kehilangan kayak gini emang perlu waktu.",
  ],
  "emotional regulation": [
    "marah itu valid, kamu ga harus terus terusan nahan. nahan marah lama lama juga bikin lelah.",
    "marahnya valid. kamu ga harus nangan sendiri. marahmu boleh ada.",
  ],
};

const DEFAULT_RESPONSE =
  "Aku denger kamu. Ceritain aja semuanya, aku disini buat kamu. Kadang dengan berbagi, beban kita jadi terasa lebih ringan.";

export function generateMockResponse(relevantChunks: Chunk[]): string {
  if (relevantChunks.length === 0) {
    return DEFAULT_RESPONSE;
  }

  const primaryTopic = relevantChunks[0]?.metadata?.topic || "unknown";

  const templates = RESPONSE_TEMPLATES[primaryTopic];

  if (!templates || templates.length === 0) {
    const primaryEmotion = relevantChunks[0]?.metadata?.emotion?.[0];
    for (const [topic, responses] of Object.entries(RESPONSE_TEMPLATES)) {
      if (topic === primaryEmotion) {
        return responses[0];
      }
    }
    return DEFAULT_RESPONSE;
  }

  const randomIndex = Math.floor(Math.random() * templates.length);
  return templates[randomIndex];
}

export async function mockStreamResponse(
  text: string,
  onToken: (token: string) => void,
  delay: number = TEST_CONFIG.mockLLM.streamingDelay,
): Promise<void> {
  const words = text.split(" ");

  for (let i = 0; i < words.length; i++) {
    const token = words[i] + (i < words.length - 1 ? " " : "");
    onToken(token);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

export async function mockRagQueryStream(
  userQuery: string,
  relevantChunks: Chunk[],
  onToken?: (token: string) => void,
): Promise<{ answer: string }> {
  const fullResponse = generateMockResponse(relevantChunks);

  if (onToken) {
    await mockStreamResponse(fullResponse, onToken);
  }

  return { answer: fullResponse };
}

const RESPONSE_VARIANTS: Record<string, string[]> = {
  overthinking_001: [
    "pikiran yang muter-muter gitu emang capek banget ya. apalagi pas malem sendiri. gapapa, kamu udah berani cerita, itu langkah besar.",
    "mikirin semuanya bareng-bareng emang bikin pusing dan capek. wajar kok. kadang kita lupa kalo ga semua pikiran itu fakta.",
    "capek banget ya kalo pikiran ga bisa berhenti. aku paham rasanya. coba ceritain pelan-pelan, apa yang paling berat dipikirin?",
  ],
  overthinking_002: [
    "nge-analisis perkataan orang lain tuh emang bikin capek ya. apalagi kalo sampe overthinking. tapi inget, persepsi kita belum tentu realita.",
    "pikiran yang muter-muter tentang omongan orang lain itu melelahkan. paham banget. ga semua yang kita pikirkan itu benar-benar terjadi.",
    "kadang pikiran kita suka bikin cerita sendiri ya. wajar kok, tapi jangan sampe itu bikin kamu lupa kalo kamu berharga.",
  ],
  overthinking_003: [
    "mikirin masa depan emang bikin cemas ya, apalagi kalo malam hari. ga semua hal harus kamu pikirin sekarang. fokus aja ke langkah kecil hari ini.",
    "ngerasa ga tau arah dan takut gagal itu wajar. tapi kamu ga harus tau semuanya sekarang. jalanin pelan-pelan aja.",
    "masa depan emang penuh ketidakpastian, dan itu wajar bikin cemas. tapi kamu ga sendiri, aku disini buat dengerin.",
  ],
  overthinking_004: [
    "bandingin hidup sendiri sama orang lain emang melelahkan ya. setiap orang punya jalan dan waktunya masing-masing.",
    "ngerasa tertinggal dibanding temen-temen tuh berat banget. tapi perbandingan itu ga adil karena kita cuma liat hasil akhir orang, bukan prosesnya.",
    "iri sama pencapaian orang lain itu wajar. tapi jangan sampe itu bikin kamu lupa kalo kamu juga punya kelebihan.",
  ],
  anxiety_001: [
    "cemas kayak gitu pasti berat banget. napas dulu pelan-pelan ya. kamu aman kok disini. ceritain apa yang kamu rasain sekarang.",
    "perasaan cemas itu berat banget dijalanin, aku tau. coba tarik napas dulu, hirup... lalu hembuskan pelan-pelan.",
    "aku denger kamu lagi ga enak badan karena cemas. coba tarik napas dulu pelan-pelan, aku tungguin kok. kamu aman disini.",
  ],
  anxiety_002: [
    "ngadepin situasi kayak gitu emang ga gampang. wajar kalo kamu ngerasa takut. pelan-pelan aja, ga usah dipaksain.",
    "ketemu orang baru atau ngomong di depan umum emang bisa bikin deg-degan ya. wajar kok. kamu berani cerita disini itu udah bukti kalo kamu kuat.",
    "rasa takut kayak gitu wajar banget. banyak orang juga ngerasain hal yang sama. ga usah buru-buru, pelan-pelan aja.",
  ],
  anxiety_003: [
    "cemas soal kesehatan itu berat banget ya. tapi kamu udah berusaha dengan periksa ke dokter, itu langkah yang baik. coba percaya sama hasil medisnya.",
    "health anxiety tuh nyata dan berat. wajar kalo kamu khawatir. tapi kamu udah lakuin hal yang bener, itu yang penting.",
    "pikiran cemas soal kesehatan emang bikin capek. tapi kamu ga sendiri. coba tarik napas pelan-pelan dan inget kalo kamu udah berusaha.",
  ],
  anxiety_004: [
    "deg-degan sama ujian itu wajar kok, apalagi kalo udah deket hari-H. tapi inget, kamu udah belajar dan persiapan. percaya sama diri kamu sendiri.",
    "ujian emang bikin stress dan deg-degan. tapi kamu udah berusaha. tarik napas dulu, pelan-pelan aja.",
    "cemas jelang ujian itu wajar banget. tapi inget, kamu udah belajar. percaya sama kemampuan kamu sendiri.",
  ],
  relationship_001: [
    "perasaan kayak gitu emang sering muncul sih kalau lagi suka sama orang. tapi emangnya 'pantas' itu standarnya siapa? dia yang nentuin, bukan pikiran kamu yang lagi overthinking ini.",
    "ngerasa ga pantas buat orang yang kamu suka itu berat banget. tapi percaya deh, kamu berharga apapun yang terjadi.",
    "perasaan ga cukup baik itu wajar, tapi jangan sampe itu mendefinisikan diri kamu. kamu berharga hanya dengan menjadi diri sendiri.",
  ],
  relationship_002: [
    "habis putus itu emang berat, apalagi di awal masih kayak belum bisa percaya. mau cerita gimana kejadiannya?",
    "denger kata-kata kayak gitu pasti nyesek banget. ngerasa ditinggalin pas masih sayang itu sakitnya beda.",
    "move on ga pernah semudah yang orang bilang. wajar kalo kamu masih ngerasain ini. ga usah buru-buru.",
  ],
  relationship_003: [
    "berantem sama pasangan karena kesalahpahaman itu bikin capek ya. konflik emang wajar dalam hubungan, tapi ga bikin jadi ga enak.",
    "konflik komunikasi sama pasangan tuh frustrasi banget ya. apalagi kalo makin dijelasin makin runyam. gapapa, coba ngobrol pelan-pelan dari hati ke hati.",
    "capek banget ya kalo lagi ga saling ngerti sama pasangan. itu wajar kok, dan ga berarti hubungan kalian hancur.",
  ],
  self_doubt_001: [
    "ngerasa ga sepintar temen-temen tuh sakit banget ya. padahal kamu udah belajar keras. proses setiap orang beda, dan itu ga masalah.",
    "nilai bukan ukuran satu-satunya. kamu udah berusaha, dan itu yang penting. jangan bandingin proses kamu sama orang lain.",
    "aku denger perjuangan kamu. capek banget pasti ngerasa kurang terus. tapi inget, kamu berharga apapun nilai kamu.",
  ],
  self_doubt_002: [
    "perasaan kayak penipu itu punya nama, imposter syndrome. dan ironinya, yang paling sering ngerasain itu justru orang yang sebenernya capable.",
    "ngerasa ga pantas sama pencapaian sendiri itu wajar. tapi inget, kamu dapet beasiswa itu karena usaha kamu, bukan keberuntungan.",
    "impostor syndrome emang nyata dan banyak orang ngalamin. kamu pantas dapet itu, percaya deh.",
  ],
  insecure_001: [
    "perasaan insecure soal penampilan itu berat banget ya. tapi nilai diri kamu ga cuma dari penampilan fisik. kamu berharga lebih dari itu.",
    "ngerasa ga pede sama penampilan itu wajar, apalagi di dunia yang sering bandingin. tapi kamu lebih dari sekedar penampilan.",
    "aku denger kamu berjuang sama perasaan insecure. itu berat banget. kamu udah cantik apa adanya.",
  ],
  insecure_002: [
    "takut kalo orang lain ga suka sama kita tuh emang sering muncul. tapi perasaan itu valid. ga semua orang harus suka sama kita.",
    "ngerasa ga diterima sama orang lain tuh sakit. tapi jangan sampe itu ngehentiin kamu buat jadi diri sendiri. kamu berharga.",
    "khawatir kalo orang lain ga suka itu capek banget. tapi nilai kamu ga ditentuin orang lain. kamu berharga apa adanya.",
  ],
  keluarga_001: [
    "orang tua yang ngatur terus emang bikin sesek ya. wajar kalo kamu capek. kamu berhak punya mimpi dan jalan sendiri.",
    "dikontrol sama orang tua terus tuh bikin stress. aku paham. coba ceritain pelan-pelan, bagian mana yang paling berat?",
    "konflik sama orang tua soal masa depan emang ga gampang. tapi wajar kalo kamu mau nentuin jalan sendiri.",
  ],
  keluarga_002: [
    "perceraian orang tua itu berat buat siapapun. pasti ada rasa sedih, bingung, bahkan mungkin salah. tapi inget, ini bukan salah kamu.",
    "broken home emang berat banget. apalagi kalo harus liat orang tua sedih. tapi kamu kuat, dan kamu berhak bahagia.",
    "aku turut sedih denger cerita kamu. kondisi keluarga kayak gini emang berat. tapi kamu ga salah, dan kamu berhak ngerasain bahagia.",
  ],
  keluarga_003: [
    "ekspektasi keluarga yang tinggi bikin capek ya. rasanya kayak hidup buat orang lain terus. tapi kamu berhak punya mimpi sendiri.",
    "tekanan dari keluarga buat jadi yang terbaik tuh berat banget. inget ya, kamu berhak bahagia dengan cara kamu sendiri.",
    "ekspektasi tinggi dari keluarga emang bikin stress. rasanya kalo gagal, ngecewain semua orang. tapi kamu berhak nentuin jalan sendiri.",
  ],
  keluarga_004: [
    "keluarga yang ga bisa diajak ngobrol dari hati ke hati emang bikin sesek ya. tapi kamu selalu punya tempat disini.",
    "ga bisa terbuka sama keluarga tuh berat. apalagi kalo harus pendem semuanya sendiri. cerita aja disini, gapapa.",
    "komunikasi keluarga yang tertutup tuh berat. kamu berhak didenger. aku siap dengerin kapan aja.",
  ],
  motivation_001: [
    "kehilangan semangat itu wajar kok, manusiawi banget. gapapa buat istirahat dulu, ngumpulin tenaga lagi.",
    "capek yang dalem banget sampe kehilangan semangat itu nyata. kamu bukan robot. istirahat itu perlu.",
    "aku denger kamu lagi kehilangan semangat. wajar kok. kadang kita emang butuh jeda buat ngisi ulang energi.",
  ],
  motivation_002: [
    "bingung sama arah hidup itu wajar banget. ga semua orang punya jalan yang jelas, dan itu ga masalah.",
    "ngerasa ga tau arah hidup itu wajar. banyak orang juga ngerasain hal yang sama. nikmatin aja prosesnya.",
    "quarter life crisis emang nyata dan berat. tapi kamu ga sendiri. jalanin aja pelan-pelan.",
  ],
  motivation_003: [
    "perasaan ga berguna itu berat banget ya. tapi percaya deh, kamu lebih berarti dari yang kamu kira. kamu berharga hanya dengan menjadi diri sendiri.",
    "ngerasa ga berguna tuh sakit banget. tapi keberadaan kamu udah berharga. ga perlu buktiin apapun.",
    "perasaan ga berarti itu berat. tapi kamu ada dan itu udah cukup. kamu berharga.",
  ],
  stress_001: [
    "tugas numpuk gitu bikin stress banget ya. kamu udah berusaha keras. coba kerjain pelan-pelan, satu demi satu.",
    "stress kuliah itu nyata banget. apalagi kalo semuanya harus beres bersamaan. kamu hebat udah bisa cerita.",
    "tugas numpuk emang bikin pusing. wajar kalo kamu stress. istirahat dulu kalo perlu, baru lanjut lagi.",
  ],
  stress_002: [
    "capek banget ya kalo kuliah terus tanpa jeda. istirahat itu penting, kamu bukan mesin. jangan lupa jaga diri.",
    "burnout akademik itu nyata dan berat. wajar kalo kamu merasa lelah. coba ambil jeda, kasih waktu buat diri sendiri.",
    "kuliah terus tanpa henti emang bikin capek fisik dan mental. kamu berhak istirahat. gapapa kalo mau slow down.",
  ],
  stress_003: [
    "tugas numpuk dan susah mulai itu emang berat banget. apalagi makin ditunda makin panik. coba mulai dari yang paling kecil dulu.",
    "lingkaran setan antara panik dan prokrastinasi itu nyata dan capek banget. coba mulai dari 5 menit aja dulu.",
    "susah mulai ngerjain tugas itu wajar, apalagi kalo udah panik duluan. kita hadapin pelan-pelan. yang penting mulai.",
  ],
  loneliness_001: [
    "kadang emang bisa ngerasa sepi walaupun rame ya. kayaknya yang kamu rasain lebih ke ga bener bener dimengerti.",
    "kesepian di keramaian itu berat banget. tapi kamu berani cerita disini itu udah langkah yang besar.",
    "rame tapi tetep sepi itu rasanya hampa ya. tapi kamu ga sendiri, aku disini kok.",
  ],
  loneliness_002: [
    "susah cari temen yang ngerti kita tuh emang bikin capek. tapi percaya deh, kamu ga sendiri. pelan-pelan aja.",
    "mencari koneksi yang beneran tuh emang ga gampang. tapi kamu berharga dan berhak buat didenger.",
    "rasa sendiri di dunia ini berat banget ya. gapapa, kamu disini punya tempat. ceritain aja.",
  ],
  loneliness_003: [
    "pindah ke kota baru dan jauh dari keluarga emang berat. butuh waktu untuk beradaptasi. pelan-pelan ya.",
    "merantau dan jauh dari keluarga tuh berat banget. tapi kamu hebat udah berani cerita.",
    "pindah ke kota baru emang bikin kesepian ya. wajar kangen rumah. adaptasi butuh waktu.",
  ],
  loneliness_004: [
    "kehilangan kontak sama sahabat lama itu sedih banget ya. kenangan indah kalian ga akan hilang.",
    "lost contact sama sahabat tuh sakit. tapi kenangan kalian ga akan hilang. dan pasti ada koneksi baru.",
    "kehilangan sahabat, walau cuma lost contact, tuh berat. tapi kamu bakal nemuin koneksi baru.",
  ],
  burnout_001: [
    "capek yang dalem banget itu nyata dan berat. rutinitas yang gitu-gitu aja emang bikin jenuh. istirahat itu bukan kelemahan.",
    "rutinitas yang monoton bikin capek banget ya. gapapa, istirahat itu perlu. kamu bukan mesin.",
    "burnout tuh nyata dan berat. wajar kalo kamu capek sama rutinitas. coba ambil waktu buat diri sendiri.",
  ],
  burnout_002: [
    "itu pasti berat banget. banyak kegiatan sampe kelelahan itu wajar. kalo perlu mundur, itu bukan kegagalan. itu bentuk sayang sama diri sendiri.",
    "aktif di organisasi sambil kuliah berat itu emang capek banget. kamu berhak prioritasin diri sendiri.",
    "kelelahan karena terlalu banyak kegiatan itu wajar. kamu bukan superman. gapapa kalo mau mundur dari beberapa kegiatan.",
  ],
  burnout_003: [
    "konflik antara 'harus produktif' dan 'butuh istirahat' itu capek banget ya. dengerin tubuh kamu, dia tau kapan waktunya berhenti.",
    "kebiasaan ga bisa diem dan ngerasa bersalah kalo istirahat tuh berat banget. tapi istirahat itu kebutuhan manusiawi.",
    "perasaan bersalah kalo istirahat tuh sering banget. kamu manusia, bukan mesin. istirahat itu penting.",
  ],
};

export function getDeterministicResponse(scenarioId: string): string {
  const variants = RESPONSE_VARIANTS[scenarioId];
  if (variants && variants.length > 0) {
    return variants[0];
  }
  return DEFAULT_RESPONSE;
}

export function getVariedResponse(scenarioId: string): string {
  const variationLevel = TEST_CONFIG.mockLLM.responseVariation as string;
  const variants = RESPONSE_VARIANTS[scenarioId];

  if (!variants || variants.length === 0) {
    return DEFAULT_RESPONSE;
  }

  if (variationLevel === "low") {
    return variants[0];
  }

  if (variationLevel === "high") {
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  }

  const seed = hashString(scenarioId + new Date().toDateString());
  const index = seed % variants.length;
  return variants[index];
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
