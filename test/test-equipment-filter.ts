/**
 * Test script for equipment filtering
 * Run with: npx tsx test/test-equipment-filter.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testEquipmentFilter() {
  console.log('🧪 Testing Equipment Filtering System\n')

  // Get demo user
  const user = await prisma.user.findUnique({
    where: { email: 'demo@astralforge.app' },
  })

  if (!user) {
    console.error('❌ Demo user not found')
    return
  }

  console.log(`✅ Found user: ${user.email}\n`)

  // Get user's equipment
  const userEquipment = await prisma.userEquipment.findMany({
    where: { userId: user.id },
    include: { equipment: true },
  })

  console.log(`📦 User Equipment (${userEquipment.length} items):`)
  userEquipment.forEach((ue) => {
    console.log(`  - ${ue.equipment.name} (${ue.location})`)
  })
  console.log()

  const userEquipmentIds = userEquipment.map((ue) => ue.equipmentId)

  // Get all exercises with equipment
  const allExercises = await prisma.exercise.findMany({
    include: {
      equipmentLinks: {
        include: {
          equipment: true,
        },
      },
    },
  })

  console.log(`🏋️ All Exercises (${allExercises.length}):`)
  allExercises.forEach((ex) => {
    const equipmentNames = ex.equipmentLinks.map((el) => el.equipment.name).join(', ')
    console.log(`  - ${ex.name}: ${equipmentNames || 'No equipment'}`)
  })
  console.log()

  // Filter: Available only (exercises user can do)
  const availableExercises = allExercises.filter((exercise) => {
    const requiredEquipmentIds = exercise.equipmentLinks.map((el) => el.equipmentId)
    
    // If no equipment needed (bodyweight), include it
    if (requiredEquipmentIds.length === 0) {
      return true
    }
    
    // Check if user has ALL required equipment
    return requiredEquipmentIds.every((reqId) => userEquipmentIds.includes(reqId))
  })

  console.log(`✅ Available Exercises (${availableExercises.length}/${allExercises.length}):`)
  availableExercises.forEach((ex) => {
    const equipmentNames = ex.equipmentLinks.map((el) => el.equipment.name).join(', ')
    console.log(`  ✓ ${ex.name}: ${equipmentNames || 'Bodyweight'}`)
  })
  console.log()

  // Exercises user CANNOT do
  const unavailableExercises = allExercises.filter((exercise) => {
    const requiredEquipmentIds = exercise.equipmentLinks.map((el) => el.equipmentId)
    
    if (requiredEquipmentIds.length === 0) {
      return false
    }
    
    return !requiredEquipmentIds.every((reqId) => userEquipmentIds.includes(reqId))
  })

  console.log(`❌ Unavailable Exercises (${unavailableExercises.length}):`)
  unavailableExercises.forEach((ex) => {
    const missingEquipment = ex.equipmentLinks
      .filter((el) => !userEquipmentIds.includes(el.equipmentId))
      .map((el) => el.equipment.name)
    console.log(`  ✗ ${ex.name}: Missing ${missingEquipment.join(', ')}`)
  })
  console.log()

  // Test specific equipment filter (e.g., only dumbbells)
  const dumbbellEquipment = userEquipment.find((ue) => ue.equipment.name === 'Dumbbells')
  if (dumbbellEquipment) {
    const dumbbellExercises = allExercises.filter((ex) =>
      ex.equipmentLinks.some((el) => el.equipmentId === dumbbellEquipment.equipmentId)
    )
    console.log(`🏋️ Dumbbell Exercises (${dumbbellExercises.length}):`)
    dumbbellExercises.forEach((ex) => {
      console.log(`  - ${ex.name}`)
    })
  }

  console.log('\n✅ Test complete!')
}

testEquipmentFilter()
  .catch((e) => {
    console.error('❌ Test failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
