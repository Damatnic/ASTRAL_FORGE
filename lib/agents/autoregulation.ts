/**
 * Autoregulation Agent
 * 
 * Implements RIR-based RPE scale for accurate effort tracking:
 * - RPE 10: Maximum effort, 0 RIR
 * - RPE 9: Could do 1 more rep (1 RIR)
 * - RPE 8: Could do 2 more reps (2 RIR)
 * - RPE 7: Could do 3 more reps (3 RIR)
 * 
 * Adjusts workout in real-time based on performance
 */

import type { RPEInterpretation, AdjustedSet, PlannedSet } from '../types'

export class AutoregulationSystem {
  // RIR-based RPE scale for smarter strength training
  private readonly rpeToRIR: Record<number, number> = {
    10: 0,   // Maximum effort, no reps left
    9.5: 0.5,
    9: 1,    // 1 rep in reserve
    8.5: 1.5,
    8: 2,    // 2 reps in reserve
    7.5: 2.5,
    7: 3,    // 3 reps in reserve
    6.5: 3.5,
    6: 4,    // 4 reps in reserve
  }

  // Estimated % of 1RM based on reps and RIR
  private readonly rpeToPercent: Record<number, number> = {
    10: 100,
    9.5: 98,
    9: 95,
    8.5: 93,
    8: 90,
    7.5: 87,
    7: 85,
    6.5: 82,
    6: 80,
  }

  // Velocity loss thresholds for different training goals
  private readonly velocityLossThresholds = {
    strength: 15,    // 15% velocity loss
    hypertrophy: 25, // 25% velocity loss
    power: 10,       // 10% velocity loss
    endurance: 30,   // 30% velocity loss
  }

  /**
   * Interpret RPE rating and provide actionable feedback
   */
  interpretRPE(rpe: number, reps: number): RPEInterpretation {
    const rir = this.rpeToRIR[rpe] ?? 2
    const percentMax = this.rpeToPercent[rpe] ?? 85

    let fatigueLevel: 'low' | 'moderate' | 'high'
    let description: string

    if (rpe <= 7) {
      fatigueLevel = 'low'
      description = `${rir} reps left in the tank. Good speed and technique.`
    } else if (rpe <= 8.5) {
      fatigueLevel = 'moderate'
      description = `${rir} reps left. Form maintained, moderate effort.`
    } else {
      fatigueLevel = 'high'
      description = `${rir} reps left. Near maximal effort, watch form breakdown.`
    }

    return {
      rir,
      percentMax,
      fatigueLevel,
      description,
    }
  }

  /**
   * Adjust workout in real-time based on set performance
   */
  async adjustWorkoutInRealtime(
    plannedSets: PlannedSet[],
    currentSetIndex: number,
    lastSetRPE: number,
    lastSetReps: number
  ): Promise<AdjustedSet> {
    const currentSet = plannedSets[currentSetIndex]
    const targetRPE = currentSet.targetRPE || 8

    // No more sets to adjust
    if (currentSetIndex >= plannedSets.length) {
      return { ...currentSet, adjusted: false }
    }

    // RPE too high - reduce load for remaining sets
    if (lastSetRPE > targetRPE + 1) {
      const reduction = this.calculateLoadReduction(lastSetRPE, targetRPE)
      return {
        ...currentSet,
        weight: Math.round(currentSet.weight * reduction * 2) / 2,
        note: `Load reduced ${((1 - reduction) * 100).toFixed(0)}% due to high RPE (${lastSetRPE})`,
        adjusted: true,
      }
    }

    // RPE too low - increase load if first set
    if (lastSetRPE < targetRPE - 1.5 && currentSetIndex === 1) {
      const increase = this.calculateLoadIncrease(lastSetRPE, targetRPE)
      return {
        ...currentSet,
        weight: Math.round(currentSet.weight * increase * 2) / 2,
        note: `Load increased ${((increase - 1) * 100).toFixed(0)}% due to low RPE (${lastSetRPE})`,
        adjusted: true,
      }
    }

    // Rep adjustment - if user got more reps than planned at good RPE
    if (lastSetReps > currentSet.reps + 2 && lastSetRPE < 8) {
      return {
        ...currentSet,
        reps: lastSetReps,
        note: 'Rep target increased based on performance',
        adjusted: true,
      }
    }

    return {
      ...currentSet,
      adjusted: false,
    }
  }

  /**
   * Calculate load reduction based on RPE overshoot
   */
  private calculateLoadReduction(actualRPE: number, targetRPE: number): number {
    const overshoot = actualRPE - targetRPE
    
    if (overshoot >= 2) return 0.90  // -10%
    if (overshoot >= 1.5) return 0.93 // -7%
    if (overshoot >= 1) return 0.95   // -5%
    
    return 1.0 // No change
  }

  /**
   * Calculate load increase based on RPE undershoot
   */
  private calculateLoadIncrease(actualRPE: number, targetRPE: number): number {
    const undershoot = targetRPE - actualRPE
    
    if (undershoot >= 2) return 1.10  // +10%
    if (undershoot >= 1.5) return 1.07 // +7%
    
    return 1.05 // +5%
  }

  /**
   * Calculate velocity loss between first and last rep
   * Used for fatigue management and set termination
   */
  calculateVelocityLoss(firstRepVelocity: number, lastRepVelocity: number): number {
    if (firstRepVelocity === 0) return 0
    return ((firstRepVelocity - lastRepVelocity) / firstRepVelocity) * 100
  }

  /**
   * Determine if set should be stopped based on velocity loss
   */
  shouldStopSet(
    trainingGoal: 'strength' | 'hypertrophy' | 'power' | 'endurance',
    velocityLoss: number
  ): boolean {
    const threshold = this.velocityLossThresholds[trainingGoal]
    return velocityLoss >= threshold
  }

  /**
   * Adjust daily load based on readiness indicators
   * Day-to-day strength fluctuations can range ±18%
   */
  adjustDailyLoad(
    plannedLoad: number,
    readinessScore: number // 0-1 scale
  ): number {
    // If readiness is below 0.7, reduce load proportionally
    if (readinessScore < 0.7) {
      const reduction = 0.85 + (readinessScore * 0.15)
      return plannedLoad * reduction
    }
    
    // If readiness is high (>0.9), can push slightly harder
    if (readinessScore > 0.9) {
      return plannedLoad * 1.05
    }
    
    return plannedLoad
  }

  /**
   * Predict 1RM based on weight, reps, and RPE
   * Uses Epley formula adjusted for RIR
   */
  estimate1RM(weight: number, reps: number, rpe: number): number {
    const rir = this.rpeToRIR[rpe] ?? 2
    const totalReps = reps + rir
    
    // Epley formula: 1RM = weight * (1 + reps/30)
    const estimated1RM = weight * (1 + totalReps / 30)
    
    return Math.round(estimated1RM * 2) / 2
  }

  /**
   * Suggest load for target rep range and RPE
   */
  suggestLoad(estimated1RM: number, targetReps: number, targetRPE: number = 8): number {
    const percentMax = this.rpeToPercent[targetRPE] ?? 90
    const rir = this.rpeToRIR[targetRPE] ?? 2
    
    // Account for reps in reserve
    const effectiveReps = targetReps + rir
    
    // Reverse Epley: weight = 1RM / (1 + reps/30)
    const suggestedWeight = (estimated1RM * (percentMax / 100)) / (1 + effectiveReps / 30)
    
    return Math.round(suggestedWeight * 2) / 2
  }

  /**
   * Analyze set performance and provide coaching feedback
   */
  analyzeSetPerformance(
    plannedWeight: number,
    actualWeight: number,
    plannedReps: number,
    actualReps: number,
    rpe: number
  ): string {
    const repDiff = actualReps - plannedReps
    const weightDiff = actualWeight - plannedWeight

    if (rpe >= 9.5) {
      return '⚠️ Near-maximal effort. Consider reducing weight next set to maintain quality.'
    }

    if (rpe <= 6 && repDiff >= 0) {
      return '💪 Great! You had plenty left. Consider increasing weight next session.'
    }

    if (repDiff < -2) {
      return '⚠️ Fell short on reps. Reduce weight or check recovery status.'
    }

    if (rpe >= 7 && rpe <= 8.5 && Math.abs(repDiff) <= 1) {
      return '✅ Perfect execution! Right in the target zone.'
    }

    return '✅ Good set. Keep it up!'
  }
}


