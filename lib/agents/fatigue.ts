/**
 * Fatigue Management System
 * 
 * Monitors training load, prevents overtraining, and optimizes recovery
 */

export interface WorkoutSession {
  volume: number
  date: Date
  intensity?: number // average RPE
  duration?: number // minutes
}

export interface RecoveryReadiness {
  ready: boolean
  score: number // 0-100
  recommendation: string
  suggestedIntensity?: 'light' | 'moderate' | 'heavy'
}

export interface DeloadProtocol {
  volumeReduction: number // percentage
  intensityReduction: number // percentage
  duration: number // days
  exercises: string[]
}

export class FatigueManagementSystem {
  /**
   * Calculate Acute:Chronic Workload Ratio (ACWR)
   * Acute = last 7 days, Chronic = last 28 days
   */
  calculateACWR(recentSessions: WorkoutSession[]): number {
    if (recentSessions.length === 0) {
      return 0
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)

    // Calculate acute load (last 7 days)
    const acuteSessions = recentSessions.filter(s => s.date >= sevenDaysAgo)
    const acuteLoad = acuteSessions.reduce((sum, s) => sum + s.volume, 0)
    const acuteAverage = acuteLoad / 7

    // Calculate chronic load (last 28 days)
    const chronicSessions = recentSessions.filter(s => s.date >= twentyEightDaysAgo)
    const chronicLoad = chronicSessions.reduce((sum, s) => sum + s.volume, 0)
    const chronicAverage = chronicLoad / 28

    // Prevent division by zero
    if (chronicAverage === 0) {
      return acuteAverage > 0 ? 2.0 : 0
    }

    return Math.round((acuteAverage / chronicAverage) * 100) / 100
  }

  /**
   * Determine if deload is needed based on ACWR
   */
  recommendDeload(acwr: number): boolean {
    // Danger zones: < 0.8 (detraining) or > 1.5 (injury risk)
    return acwr < 0.8 || acwr > 1.5
  }

  /**
   * Assess recovery readiness based on multiple factors
   */
  assessRecoveryReadiness(
    acwr: number,
    averageRPE: number,
    daysSinceLastWorkout: number,
    sleepQuality?: number, // 1-10
    soreness?: number // 1-10
  ): RecoveryReadiness {
    let score = 100
    let factors: string[] = []

    // ACWR contribution (40% weight)
    if (acwr > 1.5) {
      score -= 30
      factors.push('High training load (risk of overtraining)')
    } else if (acwr > 1.3) {
      score -= 15
      factors.push('Elevated training load')
    } else if (acwr < 0.8) {
      score -= 10
      factors.push('Low recent training (detraining risk)')
    }

    // RPE contribution (20% weight)
    if (averageRPE > 9) {
      score -= 20
      factors.push('Very high intensity recently')
    } else if (averageRPE > 8) {
      score -= 10
      factors.push('High intensity training')
    }

    // Recovery time (20% weight)
    if (daysSinceLastWorkout === 0) {
      score -= 20
      factors.push('No rest day')
    } else if (daysSinceLastWorkout === 1) {
      score -= 5
      factors.push('Minimal rest')
    } else if (daysSinceLastWorkout > 5) {
      score -= 10
      factors.push('Extended rest (may feel rusty)')
    }

    // Sleep quality (10% weight if provided)
    if (sleepQuality !== undefined) {
      if (sleepQuality < 5) {
        score -= 10
        factors.push('Poor sleep quality')
      } else if (sleepQuality < 7) {
        score -= 5
        factors.push('Suboptimal sleep')
      }
    }

    // Soreness (10% weight if provided)
    if (soreness !== undefined) {
      if (soreness > 7) {
        score -= 10
        factors.push('High muscle soreness')
      } else if (soreness > 5) {
        score -= 5
        factors.push('Moderate soreness')
      }
    }

    score = Math.max(0, Math.min(100, score))

    // Generate recommendation
    let recommendation: string
    let suggestedIntensity: 'light' | 'moderate' | 'heavy'
    let ready = true

    if (score >= 80) {
      recommendation = "Excellent recovery! You're ready for a heavy session."
      suggestedIntensity = 'heavy'
    } else if (score >= 60) {
      recommendation = 'Good recovery. Moderate intensity recommended.'
      suggestedIntensity = 'moderate'
    } else if (score >= 40) {
      recommendation = 'Fair recovery. Consider light training or active recovery.'
      suggestedIntensity = 'light'
    } else {
      recommendation = 'Poor recovery. Rest day recommended.'
      suggestedIntensity = 'light'
      ready = false
    }

    if (factors.length > 0) {
      recommendation += ' Factors: ' + factors.join(', ') + '.'
    }

    // Special cases
    if (acwr > 1.8) {
      recommendation = 'Critical: High injury risk! Take a rest day or very light session only.'
      ready = false
      suggestedIntensity = 'light'
    } else if (acwr < 0.7) {
      recommendation = 'Training load too low. Gradually increase volume to avoid detraining.'
      suggestedIntensity = 'moderate'
    }

    return {
      ready,
      score,
      recommendation,
      suggestedIntensity,
    }
  }

  /**
   * Suggest deload protocol based on accumulated fatigue
   */
  suggestDeloadProtocol(acwr: number, averageRPE: number): DeloadProtocol {
    let volumeReduction: number
    let intensityReduction: number
    let duration: number

    if (acwr > 1.8 || averageRPE > 9) {
      // High fatigue - aggressive deload
      volumeReduction = 0.5 // 50% volume reduction
      intensityReduction = 0.3 // 30% intensity reduction
      duration = 7 // Full week
    } else if (acwr > 1.5 || averageRPE > 8.5) {
      // Moderate-high fatigue
      volumeReduction = 0.4 // 40% volume reduction
      intensityReduction = 0.2 // 20% intensity reduction
      duration = 5 // 5 days
    } else {
      // Moderate fatigue - standard deload
      volumeReduction = 0.3 // 30% volume reduction
      intensityReduction = 0.15 // 15% intensity reduction
      duration = 4 // 4 days
    }

    const exercises = [
      'Focus on compound movements only',
      'Reduce number of sets per exercise',
      'Maintain movement quality',
      'Avoid training to failure',
      'Include mobility work',
      'Prioritize sleep and nutrition',
    ]

    return {
      volumeReduction,
      intensityReduction,
      duration,
      exercises,
    }
  }

  /**
   * Calculate training monotony (variation in training)
   */
  calculateMonotony(sessions: WorkoutSession[]): {
    monotony: number
    risk: 'low' | 'moderate' | 'high'
    recommendation: string
  } {
    if (sessions.length < 7) {
      return {
        monotony: 0,
        risk: 'low',
        recommendation: 'Not enough data to calculate training monotony',
      }
    }

    // Calculate daily loads for the last 7 sessions
    const loads = sessions.slice(-7).map(s => s.volume)
    
    // Calculate mean and standard deviation
    const mean = loads.reduce((sum, load) => sum + load, 0) / loads.length
    const variance = loads.reduce((sum, load) => sum + Math.pow(load - mean, 2), 0) / loads.length
    const stdDev = Math.sqrt(variance)

    // Monotony = mean / standard deviation
    // Higher values indicate less variation (more monotonous)
    const monotony = stdDev === 0 ? 10 : mean / stdDev

    let risk: 'low' | 'moderate' | 'high'
    let recommendation: string

    if (monotony < 1.5) {
      risk = 'low'
      recommendation = 'Good training variation. Low injury risk.'
    } else if (monotony < 2.0) {
      risk = 'moderate'
      recommendation = 'Moderate monotony. Consider varying training load more.'
    } else {
      risk = 'high'
      recommendation = 'High monotony increases injury risk. Vary your training intensity.'
    }

    return {
      monotony: Math.round(monotony * 100) / 100,
      risk,
      recommendation,
    }
  }

  /**
   * Calculate training strain (monotony × weekly load)
   */
  calculateStrain(monotony: number, weeklyLoad: number): {
    strain: number
    risk: 'low' | 'moderate' | 'high' | 'critical'
    recommendation: string
  } {
    const strain = monotony * weeklyLoad

    let risk: 'low' | 'moderate' | 'high' | 'critical'
    let recommendation: string

    if (strain < 5000) {
      risk = 'low'
      recommendation = 'Training strain is well managed.'
    } else if (strain < 10000) {
      risk = 'moderate'
      recommendation = 'Moderate strain. Monitor recovery closely.'
    } else if (strain < 15000) {
      risk = 'high'
      recommendation = 'High strain! Consider reducing load or taking a rest day.'
    } else {
      risk = 'critical'
      recommendation = 'Critical strain level! High injury/illness risk. Immediate deload needed.'
    }

    return {
      strain: Math.round(strain),
      risk,
      recommendation,
    }
  }

  /**
   * Estimate time to peak performance (taper planning)
   */
  estimateTimeToPeak(
    currentLoad: number,
    targetDate: Date,
    currentDate: Date = new Date()
  ): {
    weeksToTarget: number
    currentPhase: 'building' | 'peaking' | 'tapering' | 'maintaining'
    recommendation: string
  } {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    const weeksToTarget = Math.floor(
      (targetDate.getTime() - currentDate.getTime()) / msPerWeek
    )

    let currentPhase: 'building' | 'peaking' | 'tapering' | 'maintaining'
    let recommendation: string

    if (weeksToTarget > 8) {
      currentPhase = 'building'
      recommendation = 'Focus on progressive overload and volume accumulation.'
    } else if (weeksToTarget > 4) {
      currentPhase = 'peaking'
      recommendation = 'Increase intensity while maintaining or slightly reducing volume.'
    } else if (weeksToTarget > 1) {
      currentPhase = 'tapering'
      recommendation = 'Reduce volume by 40-60% while maintaining intensity.'
    } else {
      currentPhase = 'maintaining'
      recommendation = 'Maintain movement patterns with light loads. Focus on recovery.'
    }

    return {
      weeksToTarget,
      currentPhase,
      recommendation,
    }
  }

  /**
   * Monitor for overtraining syndrome indicators
   */
  checkOvertrainingIndicators(
    recentSessions: WorkoutSession[],
    restingHeartRate?: number,
    baselineHeartRate?: number,
    moodScore?: number, // 1-10
    motivationScore?: number // 1-10
  ): {
    risk: 'low' | 'moderate' | 'high'
    indicators: string[]
    recommendation: string
  } {
    const indicators: string[] = []
    let riskScore = 0

    // Check performance decline (compare recent to older sessions)
    if (recentSessions.length >= 10) {
      const recentAvg = recentSessions.slice(0, 5).reduce((sum, s) => sum + s.volume, 0) / 5
      const olderAvg = recentSessions.slice(5, 10).reduce((sum, s) => sum + s.volume, 0) / 5
      
      if (recentAvg < olderAvg * 0.85) {
        indicators.push('Performance decline detected')
        riskScore += 2
      }
    }

    // Check elevated resting heart rate
    if (restingHeartRate && baselineHeartRate) {
      const increase = restingHeartRate - baselineHeartRate
      if (increase > 10) {
        indicators.push('Significantly elevated resting heart rate')
        riskScore += 3
      } else if (increase > 5) {
        indicators.push('Elevated resting heart rate')
        riskScore += 1
      }
    }

    // Check mood and motivation
    if (moodScore !== undefined && moodScore < 5) {
      indicators.push('Low mood score')
      riskScore += 1
    }

    if (motivationScore !== undefined && motivationScore < 5) {
      indicators.push('Low motivation')
      riskScore += 1
    }

    // Check training frequency
    const lastWeekSessions = recentSessions.filter(
      s => s.date >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    )
    if (lastWeekSessions.length > 6) {
      indicators.push('Very high training frequency')
      riskScore += 2
    }

    // Determine risk level
    let risk: 'low' | 'moderate' | 'high'
    let recommendation: string

    if (riskScore >= 5) {
      risk = 'high'
      recommendation = 'Multiple overtraining indicators present. Take 3-5 days complete rest.'
    } else if (riskScore >= 3) {
      risk = 'moderate'
      recommendation = 'Some overtraining signs. Reduce training load and prioritize recovery.'
    } else {
      risk = 'low'
      recommendation = 'No significant overtraining indicators. Continue monitoring.'
    }

    return {
      risk,
      indicators: indicators.length > 0 ? indicators : ['None detected'],
      recommendation,
    }
  }

  /**
   * Generate periodization recommendation
   */
  recommendPeriodization(
    trainingWeeks: number,
    currentPhase?: 'hypertrophy' | 'strength' | 'power' | 'deload'
  ): {
    phase: 'hypertrophy' | 'strength' | 'power' | 'deload'
    duration: number // weeks
    focus: string
    repRange: string
    intensityRange: string
  } {
    // Standard periodization cycle
    const cyclePosition = trainingWeeks % 12 // 12-week mesocycle

    let phase: 'hypertrophy' | 'strength' | 'power' | 'deload'
    let duration: number
    let focus: string
    let repRange: string
    let intensityRange: string

    if (cyclePosition < 4) {
      // Weeks 1-4: Hypertrophy
      phase = 'hypertrophy'
      duration = 4
      focus = 'Volume accumulation and muscle building'
      repRange = '8-15 reps'
      intensityRange = '65-80% 1RM'
    } else if (cyclePosition < 8) {
      // Weeks 5-8: Strength
      phase = 'strength'
      duration = 4
      focus = 'Neuromuscular adaptations and force production'
      repRange = '3-6 reps'
      intensityRange = '80-90% 1RM'
    } else if (cyclePosition < 11) {
      // Weeks 9-11: Power/Peaking
      phase = 'power'
      duration = 3
      focus = 'Speed and explosive strength'
      repRange = '1-3 reps'
      intensityRange = '85-95% 1RM'
    } else {
      // Week 12: Deload
      phase = 'deload'
      duration = 1
      focus = 'Recovery and supercompensation'
      repRange = '8-12 reps'
      intensityRange = '50-70% 1RM'
    }

    return {
      phase,
      duration,
      focus,
      repRange,
      intensityRange,
    }
  }
}

