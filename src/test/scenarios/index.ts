/**
 * ============================================================
 * BARREL FILE — SKENARIO TESTING
 * ============================================================
 *
 * Registry semua skenario pengujian chatbot curhat.
 * Total: 33 skenario dari 10 kategori emosional.
 *
 * @author  Tim Skripsi
 * @version 2.0
 * ============================================================
 */

import { TestScenario } from "@/test/types"

// Import semua skenario — existing
import {
  overthinkingScenario,
  overthinkingSocialScenario,
  overthinkingFutureScenario,
  overthinkingComparisonScenario,
} from "./overthinking"

import {
  anxietyGeneralScenario,
  anxietySocialScenario,
  anxietyHealthScenario,
  anxietyFailureScenario,
} from "./anxiety"

import {
  relationshipInsecurityScenario,
  relationshipTrustScenario,
  relationshipMiscommunicationScenario,
} from "./relationship"

import {
  motivationLossScenario,
  motivationDirectionScenario,
  motivationWorthlessScenario,
} from "./kehilangan-motivasi"

import {
  lonelinessExistentialScenario,
  lonelinessIsolationScenario,
  lonelinessNewCityScenario,
  lonelinessLostFriendScenario,
} from "./kesepian"

import {
  stressAcademicScenario,
  stressBurnoutScenario,
  stressProcrastinationScenario,
} from "./stress-kuliah"

// Import skenario baru
import {
  selfDoubtAcademicScenario,
  impostorSyndromeScenario,
  insecurePhysicalScenario,
  insecureSocialScenario,
} from "./insecure"

import {
  familyConflictScenario,
  brokenHomeScenario,
  familyPressureScenario,
  familyCommunicationScenario,
} from "./keluarga"

import {
  burnoutGeneralScenario,
  burnoutOrganizationScenario,
  burnoutOverworkScenario,
} from "./burnout"

/**
 * ============================================================
 * DAFTAR SEMUA SKENARIO
 * ============================================================
 *
 * Total: 33 skenario dari 10 kategori emosional.
 *
 * Kategori:
 * 1. Overthinking   — 4 skenario
 * 2. Anxiety        — 4 skenario
 * 3. Relationship   — 3 skenario
 * 4. Insecure       — 4 skenario
 * 5. Keluarga       — 4 skenario
 * 6. Motivasi       — 3 skenario
 * 7. Stress         — 3 skenario
 * 8. Kesepian       — 4 skenario
 * 9. Burnout        — 3 skenario
 * 10. Self Doubt    — 1 skenario (bagian dari insecure)
 */
export const ALL_SCENARIOS: TestScenario[] = [
  // Overthinking (4)
  overthinkingScenario,
  overthinkingSocialScenario,
  overthinkingFutureScenario,
  overthinkingComparisonScenario,

  // Anxiety (4)
  anxietyGeneralScenario,
  anxietySocialScenario,
  anxietyHealthScenario,
  anxietyFailureScenario,

  // Relationship (3)
  relationshipInsecurityScenario,
  relationshipTrustScenario,
  relationshipMiscommunicationScenario,

  // Insecure / Self Doubt (4)
  selfDoubtAcademicScenario,
  impostorSyndromeScenario,
  insecurePhysicalScenario,
  insecureSocialScenario,

  // Keluarga / Family (4)
  familyConflictScenario,
  brokenHomeScenario,
  familyPressureScenario,
  familyCommunicationScenario,

  // Motivasi (3)
  motivationLossScenario,
  motivationDirectionScenario,
  motivationWorthlessScenario,

  // Stress Kuliah (3)
  stressAcademicScenario,
  stressBurnoutScenario,
  stressProcrastinationScenario,

  // Kesepian / Loneliness (4)
  lonelinessExistentialScenario,
  lonelinessIsolationScenario,
  lonelinessNewCityScenario,
  lonelinessLostFriendScenario,

  // Burnout (3)
  burnoutGeneralScenario,
  burnoutOrganizationScenario,
  burnoutOverworkScenario,
]

/**
 * Mendapatkan skenario berdasarkan ID.
 *
 * @param id - ID skenario yang dicari
 * @returns TestScenario atau undefined jika tidak ditemukan
 */
export function getScenarioById(id: string): TestScenario | undefined {
  return ALL_SCENARIOS.find((scenario) => scenario.id === id)
}

/**
 * Mendapatkan skenario berdasarkan kategori.
 *
 * @param category - Kategori skenario
 * @returns Array TestScenario
 */
export function getScenariosByCategory(
  category: string
): TestScenario[] {
  return ALL_SCENARIOS.filter(
    (scenario) => scenario.category === category
  )
}

/**
 * Mendapatkan distribusi skenario per kategori.
 *
 * @returns Record<string, number> — jumlah skenario per kategori
 */
export function getScenarioDistribution(): Record<string, number> {
  const distribution: Record<string, number> = {}
  for (const s of ALL_SCENARIOS) {
    distribution[s.category] = (distribution[s.category] || 0) + 1
  }
  return distribution
}

// Re-export untuk kemudahan akses — overthinking
export {
  overthinkingScenario,
  overthinkingSocialScenario,
  overthinkingFutureScenario,
  overthinkingComparisonScenario,
} from "./overthinking"

// Re-export — anxiety
export {
  anxietyGeneralScenario,
  anxietySocialScenario,
  anxietyHealthScenario,
  anxietyFailureScenario,
} from "./anxiety"

// Re-export — relationship
export {
  relationshipInsecurityScenario,
  relationshipTrustScenario,
  relationshipMiscommunicationScenario,
} from "./relationship"

// Re-export — insecure
export {
  selfDoubtAcademicScenario,
  impostorSyndromeScenario,
  insecurePhysicalScenario,
  insecureSocialScenario,
} from "./insecure"

// Re-export — keluarga
export {
  familyConflictScenario,
  brokenHomeScenario,
  familyPressureScenario,
  familyCommunicationScenario,
} from "./keluarga"

// Re-export — motivasi
export {
  motivationLossScenario,
  motivationDirectionScenario,
  motivationWorthlessScenario,
} from "./kehilangan-motivasi"

// Re-export — stress
export {
  stressAcademicScenario,
  stressBurnoutScenario,
  stressProcrastinationScenario,
} from "./stress-kuliah"

// Re-export — kesepian
export {
  lonelinessExistentialScenario,
  lonelinessIsolationScenario,
  lonelinessNewCityScenario,
  lonelinessLostFriendScenario,
} from "./kesepian"

// Re-export — burnout
export {
  burnoutGeneralScenario,
  burnoutOrganizationScenario,
  burnoutOverworkScenario,
} from "./burnout"
