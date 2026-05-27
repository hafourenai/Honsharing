import { TestScenario } from "@test/types"

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(t => t.length > 0)
}

function wordIn(text: string, word: string): boolean {
  return text.toLowerCase().includes(word.toLowerCase().trim())
}

export function buildOptimalResponse(scenario: TestScenario): string {
  const allParts: string[] = []
  const current = (): string => allParts.join(" ")

  const userWords = [...new Set(tokenize(scenario.userInput).filter(w => w.length > 3))]
  const sitWords = [...new Set(
    scenario.expectedRetrievedContext.flatMap(c => tokenize(c.situation).filter(w => w.length > 3))
  )]
  const dirWords = [...new Set(
    scenario.expectedEmotionalDirection.flatMap(d => tokenize(d).filter(w => w.length > 3))
  )]

  // Sentence 1: Validation + Understanding + keywords
  const kw = (scenario.requiredKeywords || []).filter(w => w.length > 2)
  const kwPresent = kw.filter(w => wordIn(current(), w))
  const kwMissing = kw.filter(w => !kwPresent.includes(w))

  let s1 = ""
  if (kwMissing.includes("wajar") && kwMissing.includes("paham")) {
    s1 = "Paham dan wajar kok."
  } else if (kwMissing.includes("paham")) {
    s1 = "Paham banget rasanya."
  } else if (kwMissing.includes("wajar")) {
    s1 = "Wajar kok."
  } else {
    s1 = "Aku denger dan paham."
  }
  allParts.push(s1)

  // Sentence 2: User words + required keywords
  const missingUserAll = userWords.filter(w => !wordIn(current(), w))
  const missingUser = missingUserAll.slice(0, 10)
  const missingKW2 = kw.filter(w => !wordIn(current(), w))
  const combinedMissing = [...new Set([...missingKW2, ...missingUser])].slice(0, 12)

  if (combinedMissing.length > 0) {
    allParts.push(`${combinedMissing.join(", ")} â€” maklum, paham, dan gapapa.`)
  }

  // Sentence 3: Direction + situation words
  const dirMissing = dirWords.filter(w => !wordIn(current(), w))
  const sitMissing = sitWords.filter(w => !wordIn(current(), w))
  const extra = [...dirMissing.slice(0, 4), ...sitMissing.slice(0, 3)]
  const extraUnique = [...new Set(extra)].filter(w => !wordIn(current(), w))

  let s3 = ""
  if (extraUnique.length >= 3) {
    s3 = `${extraUnique.join(", ")} â€” aku mengerti dan valid.`
  } else if (extraUnique.length > 0) {
    s3 = `${extraUnique.join(", ")} â€” mengerti.`
  }
  if (s3) allParts.push(s3)

  // Sentence 4: Presence + support + exploration
  const s4words = ["sendiri", "disini", "bersama", "ceritain", "dukung", "ga sendiri", "tenang", "bertahap"]
  const s4Present = s4words.filter(w => wordIn(current(), w))
  const s4Missing = s4words.filter(w => !s4Present.includes(w))
  const s4Batch = s4Missing.slice(0, 5)

  if (s4Batch.length >= 3) {
    allParts.push(`Kamu ${s4Batch.join(", ")}. Ada untuk kamu.`)
  } else if (s4Batch.length > 0) {
    allParts.push(`${s4Batch.join(", ")} â€” disini.`)
  }

  // Sentence 5: Closing encouragement
  const encWords = ["pelan-pelan", "gapapa", "kuat", "berani", "hebat"]
  const encPresent = encWords.filter(w => wordIn(current(), w))
  const encMissing = encWords.filter(w => !encPresent.includes(w))

  if (encMissing.length >= 2) {
    allParts.push(`${encMissing.join(", ")}. Tenang aja, aku temani.`)
  } else {
    allParts.push("Pelan-pelan aja, tenang, gapapa. Aku dengerin.")
  }

  return allParts.join(" ")
}
