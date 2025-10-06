/**
 * Equipment Seed Data
 * Comprehensive list of common gym equipment
 */

import { EquipmentCategory } from '@prisma/client'

export interface EquipmentData {
  name: string
  category: EquipmentCategory
  description?: string
  weight?: number // kg
  isWeighted: boolean
}

export const equipmentSeedData: EquipmentData[] = [
  // BARBELLS
  {
    name: 'Olympic Barbell (20kg)',
    category: 'BARBELL',
    description: 'Standard Olympic barbell, 20kg (45lbs)',
    weight: 20,
    isWeighted: true,
  },
  {
    name: 'Olympic Barbell (15kg)',
    category: 'BARBELL',
    description: 'Women\'s Olympic barbell, 15kg (35lbs)',
    weight: 15,
    isWeighted: true,
  },
  {
    name: 'Training Barbell (10kg)',
    category: 'BARBELL',
    description: 'Training/technique barbell, 10kg (22lbs)',
    weight: 10,
    isWeighted: true,
  },
  {
    name: 'EZ Curl Bar',
    category: 'BARBELL',
    description: 'Curved bar for curls and extensions',
    weight: 7,
    isWeighted: true,
  },
  {
    name: 'Trap Bar (Hex Bar)',
    category: 'BARBELL',
    description: 'Hexagonal bar for deadlifts and carries',
    weight: 25,
    isWeighted: true,
  },
  {
    name: 'Safety Squat Bar',
    category: 'BARBELL',
    description: 'Padded bar with handles for squats',
    weight: 32,
    isWeighted: true,
  },

  // DUMBBELLS
  {
    name: 'Dumbbells (Pairs)',
    category: 'DUMBBELL',
    description: 'Standard dumbbell set in pairs',
    isWeighted: true,
  },
  {
    name: 'Adjustable Dumbbells',
    category: 'DUMBBELL',
    description: 'Adjustable weight dumbbells (e.g., PowerBlocks)',
    isWeighted: true,
  },
  {
    name: 'Fixed Dumbbells',
    category: 'DUMBBELL',
    description: 'Fixed weight dumbbells',
    isWeighted: true,
  },

  // RACKS & STANDS
  {
    name: 'Power Rack',
    category: 'RACK',
    description: 'Full power rack with safety bars and J-hooks',
    isWeighted: false,
  },
  {
    name: 'Squat Rack',
    category: 'RACK',
    description: 'Squat stand/rack with J-hooks',
    isWeighted: false,
  },
  {
    name: 'Half Rack',
    category: 'RACK',
    description: 'Wall-mounted or standalone half rack',
    isWeighted: false,
  },
  {
    name: 'Squat Stands (Pair)',
    category: 'RACK',
    description: 'Independent squat stands',
    isWeighted: false,
  },

  // BENCHES
  {
    name: 'Flat Bench',
    category: 'BENCH',
    description: 'Standard flat weight bench',
    isWeighted: false,
  },
  {
    name: 'Adjustable Bench',
    category: 'BENCH',
    description: 'Incline/decline adjustable bench',
    isWeighted: false,
  },
  {
    name: 'Decline Bench',
    category: 'BENCH',
    description: 'Dedicated decline bench',
    isWeighted: false,
  },
  {
    name: 'Preacher Curl Bench',
    category: 'BENCH',
    description: 'Angled bench for preacher curls',
    isWeighted: false,
  },

  // MACHINES
  {
    name: 'Cable Machine (Dual)',
    category: 'MACHINE',
    description: 'Dual cable crossover machine',
    isWeighted: false,
  },
  {
    name: 'Cable Machine (Single)',
    category: 'MACHINE',
    description: 'Single cable machine',
    isWeighted: false,
  },
  {
    name: 'Lat Pulldown Machine',
    category: 'MACHINE',
    description: 'Lat pulldown cable machine',
    isWeighted: false,
  },
  {
    name: 'Seated Row Machine',
    category: 'MACHINE',
    description: 'Cable or plate-loaded seated row',
    isWeighted: false,
  },
  {
    name: 'Leg Press',
    category: 'MACHINE',
    description: '45-degree or vertical leg press',
    isWeighted: false,
  },
  {
    name: 'Hack Squat Machine',
    category: 'MACHINE',
    description: 'Angled squat machine',
    isWeighted: false,
  },
  {
    name: 'Leg Extension',
    category: 'MACHINE',
    description: 'Seated leg extension machine',
    isWeighted: false,
  },
  {
    name: 'Leg Curl',
    category: 'MACHINE',
    description: 'Lying or seated leg curl machine',
    isWeighted: false,
  },
  {
    name: 'Smith Machine',
    category: 'MACHINE',
    description: 'Guided barbell track machine',
    isWeighted: false,
  },
  {
    name: 'Chest Press Machine',
    category: 'MACHINE',
    description: 'Seated or lying chest press',
    isWeighted: false,
  },
  {
    name: 'Shoulder Press Machine',
    category: 'MACHINE',
    description: 'Seated shoulder press',
    isWeighted: false,
  },
  {
    name: 'Pec Deck / Fly Machine',
    category: 'MACHINE',
    description: 'Chest fly machine',
    isWeighted: false,
  },

  // BODYWEIGHT EQUIPMENT
  {
    name: 'Pull-up Bar',
    category: 'BODYWEIGHT',
    description: 'Wall-mounted or standalone pull-up bar',
    isWeighted: false,
  },
  {
    name: 'Dip Station',
    category: 'BODYWEIGHT',
    description: 'Parallel bars for dips',
    isWeighted: false,
  },
  {
    name: 'Gymnastic Rings',
    category: 'BODYWEIGHT',
    description: 'Suspension rings for bodyweight exercises',
    isWeighted: false,
  },
  {
    name: 'Parallettes',
    category: 'BODYWEIGHT',
    description: 'Parallel mini bars for floor exercises',
    isWeighted: false,
  },
  {
    name: 'Ab Wheel',
    category: 'BODYWEIGHT',
    description: 'Roller wheel for ab exercises',
    isWeighted: false,
  },
  {
    name: 'TRX / Suspension Trainer',
    category: 'BODYWEIGHT',
    description: 'Suspension training straps',
    isWeighted: false,
  },

  // CARDIO
  {
    name: 'Treadmill',
    category: 'CARDIO',
    description: 'Motorized or manual treadmill',
    isWeighted: false,
  },
  {
    name: 'Stationary Bike',
    category: 'CARDIO',
    description: 'Upright or recumbent bike',
    isWeighted: false,
  },
  {
    name: 'Rowing Machine',
    category: 'CARDIO',
    description: 'Indoor rowing ergometer',
    isWeighted: false,
  },
  {
    name: 'Assault Bike / Air Bike',
    category: 'CARDIO',
    description: 'Fan-resistance cardio bike',
    isWeighted: false,
  },
  {
    name: 'Elliptical',
    category: 'CARDIO',
    description: 'Elliptical cross-trainer',
    isWeighted: false,
  },
  {
    name: 'StairMaster / Stair Climber',
    category: 'CARDIO',
    description: 'Stair climbing machine',
    isWeighted: false,
  },
  {
    name: 'Ski Erg',
    category: 'CARDIO',
    description: 'Upper body cardio machine',
    isWeighted: false,
  },

  // ACCESSORIES
  {
    name: 'Kettlebells',
    category: 'ACCESSORY',
    description: 'Various weight kettlebells',
    isWeighted: true,
  },
  {
    name: 'Medicine Ball',
    category: 'ACCESSORY',
    description: 'Weighted medicine ball',
    isWeighted: true,
  },
  {
    name: 'Resistance Bands',
    category: 'ACCESSORY',
    description: 'Elastic resistance bands',
    isWeighted: false,
  },
  {
    name: 'Resistance Loops',
    category: 'ACCESSORY',
    description: 'Small loop resistance bands',
    isWeighted: false,
  },
  {
    name: 'Foam Roller',
    category: 'ACCESSORY',
    description: 'Foam roller for mobility',
    isWeighted: false,
  },
  {
    name: 'Yoga Mat',
    category: 'ACCESSORY',
    description: 'Exercise mat for floor work',
    isWeighted: false,
  },
  {
    name: 'Battle Ropes',
    category: 'ACCESSORY',
    description: 'Heavy ropes for conditioning',
    isWeighted: false,
  },
  {
    name: 'Plyo Box',
    category: 'ACCESSORY',
    description: 'Jumping box for plyometrics',
    isWeighted: false,
  },
  {
    name: 'Sled',
    category: 'ACCESSORY',
    description: 'Weight sled for pushing/pulling',
    isWeighted: false,
  },
  {
    name: 'Landmine Attachment',
    category: 'ACCESSORY',
    description: 'Barbell landmine pivot attachment',
    isWeighted: false,
  },
  {
    name: 'Dip Belt',
    category: 'ACCESSORY',
    description: 'Belt for adding weight to bodyweight exercises',
    isWeighted: false,
  },
  {
    name: 'Weight Vest',
    category: 'ACCESSORY',
    description: 'Adjustable weight vest',
    isWeighted: true,
  },

  // PLATFORMS
  {
    name: 'Lifting Platform',
    category: 'PLATFORM',
    description: 'Wooden platform for Olympic lifts',
    isWeighted: false,
  },
  {
    name: 'Deadlift Platform',
    category: 'PLATFORM',
    description: 'Raised platform for deadlifts',
    isWeighted: false,
  },
]

// Equipment presets for quick selection
export const equipmentPresets = {
  homeGymMinimal: [
    'Olympic Barbell (20kg)',
    'Dumbbells (Pairs)',
    'Flat Bench',
    'Squat Stands (Pair)',
    'Pull-up Bar',
    'Resistance Bands',
  ],
  homeGymComplete: [
    'Olympic Barbell (20kg)',
    'Dumbbells (Pairs)',
    'Adjustable Bench',
    'Power Rack',
    'Pull-up Bar',
    'Dip Station',
    'Resistance Bands',
    'Kettlebells',
    'Foam Roller',
  ],
  commercialGym: [
    'Olympic Barbell (20kg)',
    'Olympic Barbell (15kg)',
    'Dumbbells (Pairs)',
    'Adjustable Bench',
    'Flat Bench',
    'Power Rack',
    'Cable Machine (Dual)',
    'Lat Pulldown Machine',
    'Seated Row Machine',
    'Leg Press',
    'Leg Extension',
    'Leg Curl',
    'Smith Machine',
    'Pull-up Bar',
    'Dip Station',
    'Kettlebells',
    'Medicine Ball',
    'Resistance Bands',
    'Treadmill',
    'Stationary Bike',
    'Rowing Machine',
  ],
  minimalEquipment: [
    'Dumbbells (Pairs)',
    'Resistance Bands',
    'Pull-up Bar',
    'Yoga Mat',
    'Foam Roller',
  ],
  bodyweightOnly: [
    'Pull-up Bar',
    'Dip Station',
    'Parallettes',
    'Gymnastic Rings',
    'Yoga Mat',
    'Ab Wheel',
  ],
}
