

import { TestScenario } from "@test/types"
import type { MultiTurnScenario } from "@test/types"

// Import semua skenario â€” existing
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

// Import multi-turn scenarios
export { ALL_MULTI_TURN_SCENARIOS } from "./multi-turn"
import { ALL_MULTI_TURN_SCENARIOS } from "./multi-turn"

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
 * Export ALL_SCENARIOS sebagai `scenarios` untuk kompatibilitas
 * dengan real-evaluation yang menggunakan nama `scenarios`.
 */
export const scenarios = ALL_SCENARIOS

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
 * @returns Record<string, number> â€” jumlah skenario per kategori
 */
export function getScenarioDistribution(): Record<string, number> {
  const distribution: Record<string, number> = {}
  for (const s of ALL_SCENARIOS) {
    distribution[s.category] = (distribution[s.category] || 0) + 1
  }
  return distribution
}

// Re-export untuk kemudahan akses â€” overthinking
export {
  overthinkingScenario,
  overthinkingSocialScenario,
  overthinkingFutureScenario,
  overthinkingComparisonScenario,
} from "./overthinking"

// Re-export â€” anxiety
export {
  anxietyGeneralScenario,
  anxietySocialScenario,
  anxietyHealthScenario,
  anxietyFailureScenario,
} from "./anxiety"

// Re-export â€” relationship
export {
  relationshipInsecurityScenario,
  relationshipTrustScenario,
  relationshipMiscommunicationScenario,
} from "./relationship"

// Re-export â€” insecure
export {
  selfDoubtAcademicScenario,
  impostorSyndromeScenario,
  insecurePhysicalScenario,
  insecureSocialScenario,
} from "./insecure"

// Re-export â€” keluarga
export {
  familyConflictScenario,
  brokenHomeScenario,
  familyPressureScenario,
  familyCommunicationScenario,
} from "./keluarga"

// Re-export â€” motivasi
export {
  motivationLossScenario,
  motivationDirectionScenario,
  motivationWorthlessScenario,
} from "./kehilangan-motivasi"

// Re-export â€” stress
export {
  stressAcademicScenario,
  stressBurnoutScenario,
  stressProcrastinationScenario,
} from "./stress-kuliah"

// Re-export â€” kesepian
export {
  lonelinessExistentialScenario,
  lonelinessIsolationScenario,
  lonelinessNewCityScenario,
  lonelinessLostFriendScenario,
} from "./kesepian"

// Re-export â€” burnout
export {
  burnoutGeneralScenario,
  burnoutOrganizationScenario,
  burnoutOverworkScenario,
} from "./burnout"
