/**
 * Advanced Plate Inventory Management System
 * 
 * Track individual plate quantities and check availability
 * for specific workouts and loading scenarios.
 */

export interface PlateInventoryItem {
  weight: number // in kg
  quantity: number
  location: 'home' | 'gym' | 'default'
  unit: 'kg' | 'lb'
}

export interface PlateSet {
  name: string
  plates: PlateInventoryItem[]
  description: string
  totalWeight: number // total weight of all plates combined
}

export interface LoadingRequirement {
  weight: number
  barWeight: number
  unit: 'kg' | 'lb'
}

export interface LoadingResult {
  canLoad: boolean
  platesPerSide: { weight: number; quantity: number }[]
  totalPlatesUsed: { weight: number; quantity: number }[]
  remainingPlates: PlateInventoryItem[]
  missingPlates?: { weight: number; quantity: number }[]
  warnings?: string[]
}

/**
 * Standard plate set presets
 */
export const plateSetPresets: PlateSet[] = [
  {
    name: 'Home Gym Basic',
    description: 'Basic plate set for home gym - up to 140kg total',
    plates: [
      { weight: 20, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 10, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 5, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 2.5, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 1.25, quantity: 2, location: 'home', unit: 'kg' },
    ],
    totalWeight: 150,
  },
  {
    name: 'Home Gym Complete',
    description: 'Complete home gym set - up to 200kg total',
    plates: [
      { weight: 25, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 20, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 15, quantity: 2, location: 'home', unit: 'kg' },
      { weight: 10, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 5, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 2.5, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 1.25, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 0.5, quantity: 2, location: 'home', unit: 'kg' },
    ],
    totalWeight: 258,
  },
  {
    name: 'Commercial Gym Standard',
    description: 'Typical commercial gym plate availability',
    plates: [
      { weight: 25, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 20, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 15, quantity: 6, location: 'gym', unit: 'kg' },
      { weight: 10, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 5, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 2.5, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 1.25, quantity: 8, location: 'gym', unit: 'kg' },
      { weight: 0.5, quantity: 4, location: 'gym', unit: 'kg' },
    ],
    totalWeight: 544,
  },
  {
    name: 'Minimal Starter',
    description: 'Budget-friendly starter set',
    plates: [
      { weight: 10, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 5, quantity: 4, location: 'home', unit: 'kg' },
      { weight: 2.5, quantity: 4, location: 'home', unit: 'kg' },
    ],
    totalWeight: 70,
  },
]

/**
 * Calculate if plates can be loaded for a given weight
 */
export function calculatePlateLoading(
  requirement: LoadingRequirement,
  inventory: PlateInventoryItem[]
): LoadingResult {
  const targetWeightPerSide = (requirement.weight - requirement.barWeight) / 2

  if (targetWeightPerSide <= 0) {
    return {
      canLoad: true,
      platesPerSide: [],
      totalPlatesUsed: [],
      remainingPlates: [...inventory],
      warnings: ['Bar weight is sufficient, no plates needed'],
    }
  }

  // Sort plates by weight (heaviest first)
  const sortedInventory = [...inventory].sort((a, b) => b.weight - a.weight)

  // Greedy algorithm to load plates
  const platesPerSide: { weight: number; quantity: number }[] = []
  let remainingWeight = targetWeightPerSide
  const usedPlates = new Map<number, number>()

  for (const plate of sortedInventory) {
    if (remainingWeight <= 0) break

    const maxPossible = Math.floor(remainingWeight / plate.weight)
    const available = plate.quantity
    const toUse = Math.min(maxPossible, Math.floor(available / 2)) // Divide by 2 since we need plates for both sides

    if (toUse > 0) {
      platesPerSide.push({ weight: plate.weight, quantity: toUse })
      usedPlates.set(plate.weight, toUse * 2) // Total plates used (both sides)
      remainingWeight -= toUse * plate.weight
    }
  }

  // Check if we could load the exact weight
  const canLoad = remainingWeight === 0

  // Calculate total plates used
  const totalPlatesUsed: { weight: number; quantity: number }[] = []
  usedPlates.forEach((quantity, weight) => {
    totalPlatesUsed.push({ weight, quantity })
  })

  // Calculate remaining plates
  const remainingPlates: PlateInventoryItem[] = inventory.map(plate => {
    const used = usedPlates.get(plate.weight) || 0
    return {
      ...plate,
      quantity: plate.quantity - used,
    }
  })

  // Generate warnings
  const warnings: string[] = []
  if (remainingWeight > 0) {
    warnings.push(`Cannot load exact weight. Missing ${remainingWeight.toFixed(1)}kg per side.`)
  }

  // Check for missing plates
  const missingPlates: { weight: number; quantity: number }[] = []
  if (!canLoad && remainingWeight > 0) {
    // Suggest what plates would help
    const smallestAvailable = sortedInventory[sortedInventory.length - 1]?.weight || 1.25
    if (remainingWeight >= smallestAvailable) {
      missingPlates.push({
        weight: smallestAvailable,
        quantity: Math.ceil(remainingWeight / smallestAvailable) * 2,
      })
    }
  }

  return {
    canLoad,
    platesPerSide,
    totalPlatesUsed,
    remainingPlates,
    missingPlates: missingPlates.length > 0 ? missingPlates : undefined,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Check if inventory can handle a workout
 */
export function checkWorkoutPlateAvailability(
  exercises: LoadingRequirement[],
  inventory: PlateInventoryItem[]
): {
  canComplete: boolean
  exerciseResults: LoadingResult[]
  bottlenecks: string[]
} {
  const exerciseResults: LoadingResult[] = []
  const bottlenecks: string[] = []
  let canComplete = true

  exercises.forEach((exercise, index) => {
    const result = calculatePlateLoading(exercise, inventory)
    exerciseResults.push(result)

    if (!result.canLoad) {
      canComplete = false
      bottlenecks.push(`Exercise ${index + 1}: ${exercise.weight}kg - ${result.warnings?.join(', ')}`)
    }
  })

  return {
    canComplete,
    exerciseResults,
    bottlenecks,
  }
}

/**
 * Calculate concurrent plate usage (multiple exercises at once)
 */
export function checkConcurrentPlateAvailability(
  concurrentRequirements: LoadingRequirement[],
  inventory: PlateInventoryItem[]
): {
  canLoadAll: boolean
  individualResults: LoadingResult[]
  totalPlatesNeeded: { weight: number; quantity: number }[]
  deficit: { weight: number; quantity: number }[]
} {
  const individualResults: LoadingResult[] = []
  const totalPlatesNeeded = new Map<number, number>()

  // Calculate each loading requirement
  concurrentRequirements.forEach(req => {
    const result = calculatePlateLoading(req, inventory)
    individualResults.push(result)

    // Sum up total plates needed
    result.totalPlatesUsed.forEach(({ weight, quantity }) => {
      totalPlatesNeeded.set(weight, (totalPlatesNeeded.get(weight) || 0) + quantity)
    })
  })

  // Check if we have enough plates
  const deficit: { weight: number; quantity: number }[] = []
  let canLoadAll = true

  totalPlatesNeeded.forEach((needed, weight) => {
    const available = inventory.find(p => p.weight === weight)?.quantity || 0
    if (needed > available) {
      canLoadAll = false
      deficit.push({ weight, quantity: needed - available })
    }
  })

  return {
    canLoadAll,
    individualResults,
    totalPlatesNeeded: Array.from(totalPlatesNeeded.entries()).map(([weight, quantity]) => ({
      weight,
      quantity,
    })),
    deficit,
  }
}

/**
 * Suggest plate set upgrades
 */
export function suggestPlateUpgrades(
  currentInventory: PlateInventoryItem[],
  targetWeight: number
): {
  recommendation: string
  suggestedPlates: { weight: number; quantity: number; cost: string }[]
  reasoning: string
} {
  const suggestions: { weight: number; quantity: number; cost: string }[] = []
  let reasoning = ''

  // Check current max loadable weight
  const maxWeight = currentInventory.reduce((sum, plate) => sum + plate.weight * plate.quantity, 0)

  if (maxWeight < targetWeight) {
    const deficit = targetWeight - maxWeight
    reasoning = `Your current inventory can only load ${maxWeight}kg total. You need ${deficit}kg more in plates.`

    // Suggest larger plates for efficiency
    if (deficit >= 100) {
      suggestions.push({ weight: 25, quantity: 4, cost: '$120-200' })
      suggestions.push({ weight: 20, quantity: 2, cost: '$80-120' })
    } else if (deficit >= 50) {
      suggestions.push({ weight: 20, quantity: 4, cost: '$160-240' })
    } else {
      suggestions.push({ weight: 10, quantity: 4, cost: '$80-120' })
      suggestions.push({ weight: 5, quantity: 4, cost: '$40-80' })
    }
  } else {
    // Check for small increment plates
    const hasSmallPlates = currentInventory.some(p => p.weight <= 2.5)
    if (!hasSmallPlates) {
      reasoning = 'You have enough total weight but lack small increment plates for progressive overload.'
      suggestions.push({ weight: 2.5, quantity: 4, cost: '$20-40' })
      suggestions.push({ weight: 1.25, quantity: 4, cost: '$15-30' })
    } else {
      reasoning = 'Your plate inventory is adequate for your target weight.'
    }
  }

  return {
    recommendation: reasoning,
    suggestedPlates: suggestions,
    reasoning,
  }
}

/**
 * Get plate inventory summary statistics
 */
export function getInventoryStats(inventory: PlateInventoryItem[]): {
  totalPlates: number
  totalWeight: number
  maxLoadablePerSide: number
  smallestIncrement: number
  byWeight: Map<number, number>
} {
  const stats = {
    totalPlates: 0,
    totalWeight: 0,
    maxLoadablePerSide: 0,
    smallestIncrement: Infinity,
    byWeight: new Map<number, number>(),
  }

  inventory.forEach(plate => {
    stats.totalPlates += plate.quantity
    stats.totalWeight += plate.weight * plate.quantity
    stats.maxLoadablePerSide += (plate.weight * Math.floor(plate.quantity / 2))
    stats.smallestIncrement = Math.min(stats.smallestIncrement, plate.weight)
    stats.byWeight.set(plate.weight, plate.quantity)
  })

  if (stats.smallestIncrement === Infinity) stats.smallestIncrement = 0

  return stats
}

/**
 * Convert plate weights between kg and lb
 */
export function convertPlateUnit(
  plate: PlateInventoryItem,
  targetUnit: 'kg' | 'lb'
): PlateInventoryItem {
  if (plate.unit === targetUnit) return plate

  const conversionFactor = targetUnit === 'lb' ? 2.20462 : 0.453592
  return {
    ...plate,
    weight: Math.round(plate.weight * conversionFactor * 100) / 100,
    unit: targetUnit,
  }
}

/**
 * Get plate color based on IPF/IWF standards
 */
export function getPlateColor(weight: number, unit: 'kg' | 'lb' = 'kg'): string {
  if (unit === 'lb') {
    // Convert to kg for color mapping
    weight = weight * 0.453592
  }

  const colorMap: Record<number, string> = {
    25: 'Red',
    20: 'Blue',
    15: 'Yellow',
    10: 'Green',
    5: 'White',
    2.5: 'Dark Red',
    1.25: 'Chrome',
    0.5: 'Light',
  }

  return colorMap[weight] || 'Black'
}
