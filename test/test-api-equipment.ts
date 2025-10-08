/**
 * Test API endpoint for equipment filtering
 * Run with: npx tsx test/test-api-equipment.ts
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

async function testAPI() {
  console.log('🧪 Testing Equipment Filtering API\n')

  const baseUrl = 'http://localhost:4001'

  // Test 1: Get all exercises
  console.log('Test 1: GET /api/exercises (all)')
  const res1 = await fetch(`${baseUrl}/api/exercises`)
  const data1 = await res1.json()
  console.log(`✅ Status: ${res1.status}`)
  console.log(`✅ Found ${data1.length} exercises`)
  console.log()

  // Test 2: Filter by category
  console.log('Test 2: GET /api/exercises?category=compound')
  const res2 = await fetch(`${baseUrl}/api/exercises?category=compound`)
  const data2 = await res2.json()
  console.log(`✅ Status: ${res2.status}`)
  console.log(`✅ Found ${data2.length} compound exercises`)
  data2.forEach((ex: any) => {
    console.log(`  - ${ex.name} (${ex.category})`)
  })
  console.log()

  // Test 3: Filter by muscle group
  console.log('Test 3: GET /api/exercises?muscleGroup=push')
  const res3 = await fetch(`${baseUrl}/api/exercises?muscleGroup=push`)
  const data3 = await res3.json()
  console.log(`✅ Status: ${res3.status}`)
  console.log(`✅ Found ${data3.length} push exercises`)
  data3.forEach((ex: any) => {
    console.log(`  - ${ex.name} (${ex.muscleGroup})`)
  })
  console.log()

  // Test 4: Check equipment relationships
  console.log('Test 4: Check equipment relationships in response')
  const exerciseWithEquipment = data1.find((ex: any) => ex.name === 'Bench Press')
  if (exerciseWithEquipment) {
    console.log(`✅ Bench Press equipment:`)
    if (exerciseWithEquipment.equipmentLinks) {
      exerciseWithEquipment.equipmentLinks.forEach((link: any) => {
        console.log(`  - ${link.equipment.name} (required: ${link.required})`)
      })
    } else {
      console.log('  ❌ No equipment links found')
    }
  }
  console.log()

  console.log('✅ API tests complete!')
}

testAPI()
  .catch((e) => {
    console.error('❌ API test failed:', e)
    process.exit(1)
  })
