/**
 * Custom hooks for data fetching
 * Provides reusable hooks for fetching data from API endpoints
 */

import { useState, useEffect } from 'react'

export function useAnalytics(timeRange: 'week' | 'month' | 'year' = 'month') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`)
        if (!response.ok) throw new Error('Failed to fetch analytics')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  return { data, loading, error }
}

export function usePrograms(filters?: {
  search?: string
  category?: string
  difficulty?: string
  daysPerWeek?: number
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters?.search) params.append('search', filters.search)
        if (filters?.category) params.append('category', filters.category)
        if (filters?.difficulty) params.append('difficulty', filters.difficulty)
        if (filters?.daysPerWeek) params.append('daysPerWeek', filters.daysPerWeek.toString())

        const response = await fetch(`/api/programs/list?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch programs')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters?.search, filters?.category, filters?.difficulty, filters?.daysPerWeek])

  return { data, loading, error }
}

export function useProgress() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/progress');
        if (!response.ok) throw new Error('Failed to fetch progress data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

// Progress Photos
export function usePhotos(filters?: {
  photoType?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters?.photoType) params.append('photoType', filters.photoType);
        if (filters?.startDate)
          params.append('startDate', filters.startDate.toISOString());
        if (filters?.endDate)
          params.append('endDate', filters.endDate.toISOString());
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.offset) params.append('offset', filters.offset.toString());

        const response = await fetch(`/api/photos?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch photos');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [
    filters?.photoType,
    filters?.startDate,
    filters?.endDate,
    filters?.limit,
    filters?.offset,
  ]);

  return { data, loading, error };
}

export function usePhotoStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/photos?stats=true');
        if (!response.ok) throw new Error('Failed to fetch photo stats');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function usePhotoComparison(beforeId?: string, afterId?: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!beforeId || !afterId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/photos/compare?beforeId=${beforeId}&afterId=${afterId}`
        );
        if (!response.ok) throw new Error('Failed to fetch comparison');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [beforeId, afterId]);

  return { data, loading, error };
}

export function useSuggestedComparisons() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/photos/compare?suggestions=true');
        if (!response.ok) throw new Error('Failed to fetch suggestions');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function usePhotoTimeline() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/photos/timeline');
        if (!response.ok) throw new Error('Failed to fetch timeline');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}

export function useProgramDetail(programId: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/programs/${programId}`)
        if (!response.ok) throw new Error('Failed to fetch program detail')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (programId) {
      fetchData()
    }
  }, [programId])

  return { data, loading, error }
}

export function useExercises(filters?: {
  search?: string
  muscleGroup?: string
  equipment?: string
  difficulty?: string
  favoritesOnly?: boolean
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters?.search) params.append('search', filters.search)
        if (filters?.muscleGroup) params.append('muscleGroup', filters.muscleGroup)
        if (filters?.equipment) params.append('equipment', filters.equipment)
        if (filters?.difficulty) params.append('difficulty', filters.difficulty)
        if (filters?.favoritesOnly) params.append('favoritesOnly', 'true')

        const response = await fetch(`/api/exercises?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch exercises')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters?.search, filters?.muscleGroup, filters?.equipment, filters?.difficulty, filters?.favoritesOnly])

  return { data, loading, error }
}

export function useExerciseDetail(exerciseId: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/exercises/${exerciseId}`)
        if (!response.ok) throw new Error('Failed to fetch exercise detail')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (exerciseId) {
      fetchData()
    }
  }, [exerciseId])

  return { data, loading, error }
}

export function useWorkoutHistory(options?: {
  limit?: number
  offset?: number
  programId?: string
  startDate?: Date
  endDate?: Date
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (options?.limit) params.append('limit', options.limit.toString())
        if (options?.offset) params.append('offset', options.offset.toString())
        if (options?.programId) params.append('programId', options.programId)
        if (options?.startDate) params.append('startDate', options.startDate.toISOString())
        if (options?.endDate) params.append('endDate', options.endDate.toISOString())

        const response = await fetch(`/api/sessions/history?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch workout history')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [options?.limit, options?.offset, options?.programId, options?.startDate, options?.endDate])

  return { data, loading, error }
}

export function useWorkoutDetail(workoutId: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/sessions/${workoutId}`)
        if (!response.ok) throw new Error('Failed to fetch workout detail')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (workoutId) {
      fetchData()
    }
  }, [workoutId])

  return { data, loading, error }
}

// ============================================================================
// MEASUREMENTS HOOKS
// ============================================================================

export function useMeasurements(filters?: {
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters?.startDate) params.append('startDate', filters.startDate.toISOString())
        if (filters?.endDate) params.append('endDate', filters.endDate.toISOString())
        if (filters?.limit) params.append('limit', filters.limit.toString())
        if (filters?.offset) params.append('offset', filters.offset.toString())

        const response = await fetch(`/api/measurements?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch measurements')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters?.startDate, filters?.endDate, filters?.limit, filters?.offset])

  return { data, loading, error }
}

export function useMeasurementStats() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/measurements?stats=true')
        if (!response.ok) throw new Error('Failed to fetch measurement stats')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMeasurementTrend(bodyPart?: string, startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!bodyPart) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ bodyPart })
        if (startDate) params.append('startDate', startDate.toISOString())
        if (endDate) params.append('endDate', endDate.toISOString())

        const response = await fetch(`/api/measurements/trend?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch measurement trend')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bodyPart, startDate, endDate])

  return { data, loading, error }
}

export function useActiveBodyParts() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/measurements/trend?active=true')
        if (!response.ok) throw new Error('Failed to fetch active body parts')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMeasurementComparison(
  bodyPart?: string,
  beforeDate?: Date,
  afterDate?: Date
) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (!bodyPart || !beforeDate || !afterDate) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          bodyPart,
          beforeDate: beforeDate.toISOString(),
          afterDate: afterDate.toISOString(),
        })

        const response = await fetch(`/api/measurements/compare?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch measurement comparison')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bodyPart, beforeDate, afterDate])

  return { data, loading, error }
}

export function useSuggestedMeasurementComparisons() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/measurements/compare?suggestions=true')
        if (!response.ok) throw new Error('Failed to fetch suggested comparisons')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMeasurementTimeline() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/measurements?timeline=true')
        if (!response.ok) throw new Error('Failed to fetch measurement timeline')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useLatestMeasurement() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/measurements?latest=true')
        if (!response.ok) throw new Error('Failed to fetch latest measurement')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// ============================================================================
// Goals Hooks
// ============================================================================

export function useGoals(filters?: {
  status?: 'active' | 'completed' | 'abandoned'
  goalType?: string
  limit?: number
  offset?: number
}) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (filters?.status) params.append('status', filters.status)
        if (filters?.goalType) params.append('goalType', filters.goalType)
        if (filters?.limit) params.append('limit', filters.limit.toString())
        if (filters?.offset) params.append('offset', filters.offset.toString())

        const response = await fetch(`/api/goals?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch goals')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters?.status, filters?.goalType, filters?.limit, filters?.offset])

  return { data, loading, error }
}

export function useGoalStats() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/goals?stats=true')
        if (!response.ok) throw new Error('Failed to fetch goal stats')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useActiveGoals() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/goals?active=true')
        if (!response.ok) throw new Error('Failed to fetch active goals')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useCompletedGoals(limit?: number) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('completed', 'true')
        if (limit) params.append('limit', limit.toString())

        const response = await fetch(`/api/goals?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch completed goals')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, loading, error }
}

export function useUpcomingDeadlines(days?: number) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('upcoming', 'true')
        if (days) params.append('days', days.toString())

        const response = await fetch(`/api/goals?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch upcoming deadlines')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [days])

  return { data, loading, error }
}

export function useOverdueGoals() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/goals?overdue=true')
        if (!response.ok) throw new Error('Failed to fetch overdue goals')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useGoalSuggestions() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/goals?suggestions=true')
        if (!response.ok) throw new Error('Failed to fetch goal suggestions')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useGoalDetail(goalId: string, includeProgress = false) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!goalId) {
      setLoading(false)
      return
    }

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = includeProgress ? '?progress=true' : ''
        const response = await fetch(`/api/goals/${goalId}${params}`)
        if (!response.ok) throw new Error('Failed to fetch goal detail')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [goalId, includeProgress])

  return { data, loading, error }
}

// ============================================================================
// Character & Gamification Hooks
// ============================================================================

export function useCharacter() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/character')
      if (!response.ok) throw new Error('Failed to fetch character')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useSkillTree(treeName: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!treeName) {
      setLoading(false)
      return
    }

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/character?mode=skill-tree&tree=${treeName}`)
        if (!response.ok) throw new Error('Failed to fetch skill tree')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [treeName])

  return { data, loading, error }
}

export function useAchievements() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/character?mode=achievements')
        if (!response.ok) throw new Error('Failed to fetch achievements')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// ============================================================================
// Social Features Hooks
// ============================================================================

export function useFriends() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/social?mode=friends')
      if (!response.ok) throw new Error('Failed to fetch friends')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useLeaderboard(type: string = 'level', limit?: number) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('mode', 'leaderboard')
        params.append('type', type)
        if (limit) params.append('limit', limit.toString())

        const response = await fetch(`/api/social?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch leaderboard')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, limit])

  return { data, loading, error }
}

export function useUserRank(type: string = 'level') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/social?mode=rank&type=${type}`)
        if (!response.ok) throw new Error('Failed to fetch user rank')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type])

  return { data, loading, error }
}

export function useGuilds() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/social?mode=guilds')
        if (!response.ok) throw new Error('Failed to fetch guilds')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMyGuild() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/social?mode=my-guild')
      if (!response.ok) throw new Error('Failed to fetch guild')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useChallenges() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/social?mode=challenges')
        if (!response.ok) throw new Error('Failed to fetch challenges')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// ============================================================================
// Advanced Features Hooks
// ============================================================================

export function useQuests(type?: 'daily' | 'weekly' | 'all') {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const mode = type === 'daily' ? 'daily-quests' : type === 'weekly' ? 'weekly-quests' : 'all-quests'
      const response = await fetch(`/api/advanced?mode=${mode}`)
      if (!response.ok) throw new Error('Failed to fetch quests')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [type])

  return { data, loading, error, refetch: fetchData }
}

export function usePet() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/advanced?mode=active-pet')
      if (!response.ok) throw new Error('Failed to fetch pet')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function usePetCollection() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/advanced?mode=pet-collection')
        if (!response.ok) throw new Error('Failed to fetch pet collection')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useMarketplace() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/advanced?mode=marketplace')
        if (!response.ok) throw new Error('Failed to fetch marketplace')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function useInventory() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/advanced?mode=inventory')
      if (!response.ok) throw new Error('Failed to fetch inventory')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function usePvPChallenges() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/advanced?mode=pvp-challenges')
      if (!response.ok) throw new Error('Failed to fetch PvP challenges')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useSeasonalEvents() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/advanced?mode=seasonal-events')
        if (!response.ok) throw new Error('Failed to fetch events')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export function usePrestige() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/advanced?mode=prestige')
      if (!response.ok) throw new Error('Failed to fetch prestige data')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

// ============================================================================
// ENGAGEMENT & POLISH HOOKS
// ============================================================================

/**
 * Get user notifications
 */
export function useNotifications(unreadOnly: boolean = false) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/engagement?mode=notifications&unreadOnly=${unreadOnly}`)
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [unreadOnly])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Get user engagement analytics (comprehensive stats)
 */
export function useEngagementAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/engagement?mode=analytics')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

/**
 * Get achievement showcase
 */
export function useAchievementShowcase() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/engagement?mode=achievement-showcase')
      if (!response.ok) throw new Error('Failed to fetch achievement showcase')
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

