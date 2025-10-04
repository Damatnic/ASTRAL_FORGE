import { NextResponse } from 'next/server'

// POST /api/nutrition/calculator - Calculate nutrition needs
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { weight, height, age, gender, activityLevel, goal } = body

    if (!weight || !height || !age || !gender || !activityLevel || !goal) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr: number
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    }

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55)

    // Goal adjustments
    let targetCalories = tdee
    let proteinMultiplier = 1.6 // g per kg bodyweight

    if (goal === 'cut') {
      targetCalories = tdee * 0.8 // 20% deficit
      proteinMultiplier = 2.0 // Higher protein during cut
    } else if (goal === 'bulk') {
      targetCalories = tdee * 1.1 // 10% surplus
      proteinMultiplier = 1.8
    } else if (goal === 'recomp') {
      targetCalories = tdee
      proteinMultiplier = 2.0
    }

    const protein = weight * proteinMultiplier
    const proteinCals = protein * 4
    const fats = weight * 0.8 // 0.8g per kg
    const fatCals = fats * 9
    const carbs = (targetCalories - proteinCals - fatCals) / 4

    return NextResponse.json({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      waterMl: Math.round(weight * 35), // 35ml per kg
      breakdown: {
        proteinPercent: Math.round((proteinCals / targetCalories) * 100),
        carbsPercent: Math.round(((carbs * 4) / targetCalories) * 100),
        fatsPercent: Math.round((fatCals / targetCalories) * 100),
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Calculation failed' },
      { status: 500 }
    )
  }
}
