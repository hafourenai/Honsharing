# Honey 
<p align="center">
  <img src="public/preview honeyy.png" width="800" alt="Honey Preview">
</p>


Honey adalah sahabat AI yang selalu siap mendengarkan. Proyek ini didesain khusus untuk memberikan dukungan emosional dan empati yang tulus dalam ruang yang aman, hangat, dan sepenuhnya privat.

---

## Tech Stack

- **Frontend & Core**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript.
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) untuk layout modern dan [Framer Motion](https://www.framer.com/motion/) untuk animasi yang halus.
- **AI & Models**:
  - **LLM (Chat)**: [Llama 3.3 70B](https://www.llama.com/) yang diakses melalui [Groq SDK](https://groq.com/) untuk respons secepat kilat.
  - **Embeddings**: Model lokal yang berjalan langsung di browser/server menggunakan [@xenova/transformers](https://huggingface.co/docs/transformers.js/) (Hugging Face).
- **Storage**: [Dexie.js](https://dexie.org/) (Wrapper IndexedDB) untuk manajemen database sisi klien yang tangguh.

## Fitur Utama

- **Empati yang Tulus**: Honey difokuskan untuk mendengarkan dan memvalidasi perasaan, bukan sekadar memberikan informasi umum.
- **Privasi Mutlak (E2EE)**: Semua riwayat curhatan dienkripsi dan disimpan secara lokal di perangkat Anda. Data sensitif tidak pernah menyentuh server dalam bentuk teks biasa.
- **RAG-Enhanced Empathy**: Menggunakan teknik *Retrieval-Augmented Generation* untuk mencari konteks emosional dari percakapan lama, sehingga Honey bisa memahami perkembangan perasaan Anda dari waktu ke waktu.
- **Mode Bahasa**: Pilih antara gaya bahasa **Santai** (sahabat dekat) atau **Formal** (pendengar dewasa) melalui panel pengaturan.

## Keamanan & Data

Privasi adalah prioritas utama proyek ini:
- **Zero-knowledge Storage**: Kami tidak menyimpan riwayat percakapan Anda di database cloud. Semuanya ada di tangan Anda.
- **Local Integration**: Pemrosesan embedding dilakukan secara lokal untuk meminimalkan transmisi data.
- **Session Managed**: Menggunakan sistem manajemen sesi yang aman untuk memastikan hanya Anda yang bisa mengakses data Anda sendiri.

---

*Dibuat untuk diri gua sendiri haha.*
