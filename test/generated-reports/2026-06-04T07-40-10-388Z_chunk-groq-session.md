# Laporan Sesi Evaluasi

**ID Sesi:** eval_1780558810295_eszqfo
**Mode:** REAL
**Tanggal:** 2026-06-04T07:40:10.295Z
**Total Skenario:** 19

---

## Ringkasan

| Metrik | Nilai |
|--------|-------|
| Rata-rata Similarity | 7/100 |
| Rata-rata Empati | 12/100 |
| Rata-rata Relevansi | 6/100 |
| Rata-rata Retrieval | 49/100 |
| Rata-rata Waktu Respons | 1517ms |


## Distribusi Label Kualitas

| Label | Jumlah |
|-------|--------|
| GOOD | 0 (0.0%) |
| ACCEPTABLE | 0 (0.0%) |
| WEAK | 4 (21.1%) |
| FAILED | 15 (78.9%) |


## Detail Evaluasi

### 1. Romantic insecurity

**ID:** chunk_emotion_0001
**Kategori:** relationship
**Waktu:** 3293ms
**Label:** WEAK

**Input User:**
```
aku kayaknya ga pantas buat dia
```

**Respons Chatbot:**
```
loh, kenapa kamu bilang gitu? apa karena dia terlalu baik atau gimana?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 9 |
| Empati | 17 |
| Relevansi | 2 |
| Retrieval | 94 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0001 | 0.707 | romantic insecurity |

---

### 2. Overthinking relationship

**ID:** chunk_emotion_0002
**Kategori:** relationship
**Waktu:** 473ms
**Label:** FAILED

**Input User:**
```
dia kayak berubah belakangan ini
```

**Respons Chatbot:**
```
Apa yang membuat kamu pikir gitu? Apa yang berubah dari dia?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 17 |
| Empati | 10 |
| Relevansi | 10 |
| Retrieval | 0 |

---

### 3. Burnout

**ID:** chunk_emotion_0003
**Kategori:** mental health
**Waktu:** 382ms
**Label:** FAILED

**Input User:**
```
aku capek banget
```

**Respons Chatbot:**
```
anjir, apa yang terjadi sih?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 10 |
| Relevansi | 4 |
| Retrieval | 0 |

---

### 4. Loneliness

**ID:** chunk_emotion_0004
**Kategori:** social
**Waktu:** 547ms
**Label:** WEAK

**Input User:**
```
aku ngerasa sendirian
```

**Respons Chatbot:**
```
itu nyebelin banget sih, rasanya ada tapi nggak ada orang yang ngerti kita
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 7 |
| Empati | 10 |
| Relevansi | 6 |
| Retrieval | 96 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0004 | 0.894 | loneliness |
| 2 | emotion_0012 | 0.707 | identity crisis |

---

### 5. Self comparison

**ID:** chunk_emotion_0005
**Kategori:** self worth
**Waktu:** 602ms
**Label:** FAILED

**Input User:**
```
temen temenku udah pada maju
```

**Respons Chatbot:**
```
Lah, mereka udah maju, kamu belum? Apa yang membuat kamu merasa mereka lebih maju?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 15 |
| Empati | 10 |
| Relevansi | 12 |
| Retrieval | 0 |

---

### 6. Family pressure

**ID:** chunk_emotion_0006
**Kategori:** family
**Waktu:** 382ms
**Label:** WEAK

**Input User:**
```
keluargaku ga pernah ngerti aku
```

**Respons Chatbot:**
```
anjir, kok bisa gitu? apa yang mereka ga ngerti tentang kamu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 11 |
| Empati | 10 |
| Relevansi | 15 |
| Retrieval | 90 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0006 | 0.500 | family pressure |

---

### 7. Fear of losing someone

**ID:** chunk_emotion_0007
**Kategori:** relationship
**Waktu:** 395ms
**Label:** FAILED

**Input User:**
```
aku takut kehilangan dia
```

**Respons Chatbot:**
```
itu kayaknya berat banget sih, apa yang bikin kamu khawatir gitu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 14 |
| Relevansi | 4 |
| Retrieval | 92 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0018 | 0.632 | social anxiety |
| 2 | emotion_0007 | 0.577 | fear of losing someone |
| 3 | emotion_0002 | 0.535 | overthinking relationship |

---

### 8. Emotional numbness

**ID:** chunk_emotion_0008
**Kategori:** mental state
**Waktu:** 545ms
**Label:** FAILED

**Input User:**
```
aku ngerasa kosong
```

**Respons Chatbot:**
```
anjir kok bisa gitu, apa yang terjadi?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 10 |
| Relevansi | 4 |
| Retrieval | 94 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0008 | 0.707 | emotional numbness |

---

### 9. Post-breakup

**ID:** chunk_emotion_0009
**Kategori:** relationship
**Waktu:** 557ms
**Label:** FAILED

**Input User:**
```
aku baru putus
```

**Respons Chatbot:**
```
anjir, kok bisa gitu? apa yang terjadi?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 10 |
| Relevansi | 4 |
| Retrieval | 0 |

---

### 10. Academic pressure

**ID:** chunk_emotion_0010
**Kategori:** academic
**Waktu:** 545ms
**Label:** FAILED

**Input User:**
```
skripsi aku ga jalan jalan
```

**Respons Chatbot:**
```
hah, apa yang terjadi?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 4 |
| Empati | 10 |
| Relevansi | 2 |
| Retrieval | 0 |

---

### 11. Friendship conflict

**ID:** chunk_emotion_0011
**Kategori:** friendship
**Waktu:** 546ms
**Label:** FAILED

**Input User:**
```
aku berantem sama sahabatku
```

**Respons Chatbot:**
```
Apa yang terjadi?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 10 |
| Relevansi | 2 |
| Retrieval | 100 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0011 | 1.000 | friendship conflict |

---

### 12. Identity crisis

**ID:** chunk_emotion_0012
**Kategori:** self identity
**Waktu:** 697ms
**Label:** FAILED

**Input User:**
```
aku ga tau aku mau jadi apa
```

**Respons Chatbot:**
```
hmm, itu lumayan bikin pusing ya? ga tau mau jadi apa, tapi kayaknya harusnya udah tau deh. apa yang kamu suka sih sekarang?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 22 |
| Empati | 18 |
| Relevansi | 21 |
| Retrieval | 0 |

---

### 13. Imposter syndrome

**ID:** chunk_emotion_0013
**Kategori:** work or academic
**Waktu:** 373ms
**Label:** FAILED

**Input User:**
```
aku ngerasa ga layak ada di sini
```

**Respons Chatbot:**
```
loh, kok bisa gitu? apa yang bikin kamu ngerasa begitu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 11 |
| Empati | 10 |
| Relevansi | 10 |
| Retrieval | 0 |

---

### 14. Grief and loss

**ID:** chunk_emotion_0014
**Kategori:** loss
**Waktu:** 447ms
**Label:** FAILED

**Input User:**
```
aku baru kehilangan seseorang
```

**Respons Chatbot:**
```
Wah, aku turut sedih dengar kabar itu. Gimana kamu sekarang?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 6 |
| Empati | 14 |
| Relevansi | 3 |
| Retrieval | 93 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0014 | 1.000 | grief and loss |
| 2 | emotion_0001 | 0.707 | romantic insecurity |
| 3 | emotion_0005 | 0.577 | self comparison |
| 4 | emotion_0004 | 0.447 | loneliness |
| 5 | emotion_0018 | 0.447 | social anxiety |

---

### 15. Anger and suppressed emotions

**ID:** chunk_emotion_0015
**Kategori:** emotional regulation
**Waktu:** 2588ms
**Label:** FAILED

**Input User:**
```
aku marah banget tapi ga bisa ngungkapin
```

**Respons Chatbot:**
```
loh, ada apa nih?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 0 |
| Empati | 10 |
| Relevansi | 0 |
| Retrieval | 0 |

---

### 16. Low motivation and lack of direction

**ID:** chunk_emotion_0016
**Kategori:** mental state
**Waktu:** 3429ms
**Label:** FAILED

**Input User:**
```
aku ga semangat ngapa ngapain
```

**Respons Chatbot:**
```
wah, kok jadi gitu? apa yang bikin kamu merasa begitu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 2 |
| Empati | 10 |
| Relevansi | 4 |
| Retrieval | 94 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0008 | 0.707 | emotional numbness |
| 2 | emotion_0016 | 0.707 | low motivation and lack of direction |

---

### 17. General anxiety

**ID:** chunk_emotion_0017
**Kategori:** mental health
**Waktu:** 4850ms
**Label:** WEAK

**Input User:**
```
cemas tanpa sebab yang jelas
```

**Respons Chatbot:**
```
anjir, kayaknya sering banget ya merasa cemas gitu tanpa tahu penyebabnya. Apa biasanya kamu lakukan pas merasa kayak gitu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 21 |
| Empati | 14 |
| Relevansi | 10 |
| Retrieval | 94 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0017 | 1.000 | general anxiety |
| 2 | emotion_0018 | 0.447 | social anxiety |

---

### 18. Social anxiety

**ID:** chunk_emotion_0018
**Kategori:** social
**Waktu:** 4557ms
**Label:** FAILED

**Input User:**
```
takut dinilai orang lain
```

**Respons Chatbot:**
```
anjir, itu memang nggak enak banget. Apa yang bikin kamu merasa gitu?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 6 |
| Empati | 10 |
| Relevansi | 2 |
| Retrieval | 91 |

**Retrieved Context:**

| # | Chunk ID | Skor | Topik |
|---|----------|------|-------|
| 1 | emotion_0018 | 0.894 | social anxiety |
| 2 | emotion_0007 | 0.612 | fear of losing someone |
| 3 | emotion_0014 | 0.500 | grief and loss |
| 4 | emotion_0002 | 0.378 | overthinking relationship |
| 5 | emotion_0001 | 0.354 | romantic insecurity |

---

### 19. Overthinking

**ID:** chunk_emotion_0019
**Kategori:** mental state
**Waktu:** 3624ms
**Label:** FAILED

**Input User:**
```
pikiran muter muter terus
```

**Respons Chatbot:**
```
anjir, kayaknya otak kamu lagi overdrive nih. Apa yang bikin kamu banyak pikiran seharian ini?
```

**Skor:**
| Dimensi | Skor |
|---------|------|
| Similarity | 8 |
| Empati | 14 |
| Relevansi | 6 |
| Retrieval | 0 |

---
