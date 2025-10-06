# Phase 3: Equipment System Implementation Plan

## Overview
Add comprehensive equipment management to enable users to filter exercises based on available equipment, use enhanced plate calculators, and access equipment-specific workout templates.

## Goals
- Enable equipment-based exercise filtering
- Provide visual plate calculator
- Support multiple equipment types
- Create equipment-specific templates
- Improve workout customization

---

## Tasks Breakdown

### High Priority (Must Have)

#### 1. Equipment Database Schema ✅ NEXT
**Goal**: Define equipment types and exercise-equipment relationships

**Implementation**:
- [ ] Update Prisma schema with Equipment model
- [ ] Create equipment categories (weights, machines, accessories)
- [ ] Add exercise-equipment relationship (many-to-many)
- [ ] Seed database with common equipment
- [ ] Migration scripts

**Files**:
- `prisma/schema.prisma` - Add Equipment model
- `prisma/seed.ts` - Equipment seed data
- `lib/equipment-data.ts` - Equipment constants

**Equipment Categories**:
```typescript
enum EquipmentCategory {
  WEIGHTS       // Barbells, dumbbells, plates
  MACHINES      // Leg press, cable machine, smith machine
  BODYWEIGHT    // Pull-up bar, dip station, parallettes
  CARDIO        // Treadmill, bike, rower
  ACCESSORIES   // Resistance bands, kettlebells, medicine ball
}
```

**Equipment Types** (Initial Set):
- Barbell (20kg Olympic, 15kg, 10kg)
- Dumbbells (pairs, individual)
- Weight Plates (2.5kg - 25kg)
- Pull-up Bar
- Dip Station
- Bench (flat, adjustable, decline)
- Squat Rack / Power Rack
- Cable Machine
- Leg Press
- Resistance Bands
- Kettlebells
- Medicine Ball

---

#### 2. Equipment Selection UI
**Goal**: Let users select their available equipment

**Implementation**:
- [ ] Equipment selector component with checkboxes
- [ ] Group by category with expand/collapse
- [ ] Search/filter equipment
- [ ] Save to user profile
- [ ] Quick presets (Home Gym, Commercial Gym, Minimal)

**Components**:
- `components/equipment/equipment-selector.tsx` - Main selector
- `components/equipment/equipment-category.tsx` - Category group
- `components/equipment/equipment-preset.tsx` - Quick presets

**User Flow**:
1. Settings → Equipment → Select Available Equipment
2. Choose from presets or custom selection
3. Save to profile
4. Exercises auto-filter based on selection

---

#### 3. Enhanced Plate Calculator
**Goal**: Visual, practical plate loading calculator

**Implementation**:
- [ ] Visual plate representation (bar with plates)
- [ ] Multiple bar types (20kg, 15kg, trap bar)
- [ ] Kg/lb unit switching
- [ ] Plate inventory selection
- [ ] One-rep max calculator integration
- [ ] Warm-up set calculator

**Component**:
- `components/equipment/plate-calculator-enhanced.tsx`

**Features**:
```
[Input: Target Weight] [Unit: kg/lb] [Bar Type: 20kg ▼]

Visual Bar Display:
|===| 20kg 15kg 10kg 5kg 2.5kg [||||||||] 2.5kg 5kg 10kg 15kg 20kg |===|
      ←                    Bar (20kg)                     →

Per Side: 2×20kg + 2×15kg + 1×10kg + 1×5kg + 1×2.5kg = 72.5kg
Total Weight: 165kg (145kg + 20kg bar)

[Warm-up Sets ▼]
Set 1: 60kg (2×20kg per side)
Set 2: 100kg (2×20kg + 2×10kg per side)
Set 3: 140kg (2×20kg + 2×15kg + 2×5kg per side)
```

---

### Medium Priority (Should Have)

#### 4. Equipment-Based Workout Templates
**Goal**: Pre-built programs based on equipment availability

**Implementation**:
- [ ] Template categories by equipment
- [ ] Filter templates by user's equipment
- [ ] Equipment requirements badge on templates
- [ ] Alternative exercises for missing equipment

**Templates**:
- Home Gym Programs (barbell, dumbbells, bench)
- Commercial Gym Programs (full equipment)
- Minimal Equipment Programs (bodyweight + bands)
- Dumbbell Only Programs
- Barbell Only Programs

**Component**:
- `components/templates/equipment-filtered-templates.tsx`

---

#### 5. Exercise Library Filters
**Goal**: Smart filtering in exercise database

**Implementation**:
- [ ] Filter by equipment type
- [ ] Filter by muscle group + equipment
- [ ] "Can I do this?" indicator
- [ ] Alternative exercise suggestions
- [ ] Equipment requirement badges

**Features**:
```
Filters:
☑ My Equipment Only
□ Barbell Exercises
□ Dumbbell Exercises
□ Machine Exercises
□ Bodyweight Only

Bench Press
Equipment: Barbell, Bench, Squat Rack
✅ You can do this!

Leg Press
Equipment: Leg Press Machine
⚠️ Equipment not available
→ Alternative: Barbell Squat, Goblet Squat
```

**Files**:
- `app/exercises/page.tsx` - Add equipment filters
- `components/exercises/exercise-card.tsx` - Equipment badges
- `lib/exercise-alternatives.ts` - Alternative exercise logic

---

#### 6. Equipment Tracking
**Goal**: Track equipment access across locations

**Implementation**:
- [ ] Multiple equipment profiles (Home, Gym A, Gym B)
- [ ] Quick switch between profiles
- [ ] Location-based auto-switching
- [ ] Equipment availability calendar

**Use Cases**:
- Home gym vs commercial gym workouts
- Travel workouts (hotel gym)
- Outdoor workouts (park equipment)

---

### Low Priority (Nice to Have)

#### 7. Equipment Recommendations
**Goal**: Suggest exercises based on available equipment

**Implementation**:
- [ ] "Try this with your equipment" suggestions
- [ ] Underutilized equipment alerts
- [ ] New exercises for recently added equipment

---

#### 8. Plate Inventory Management
**Goal**: Track exact plate inventory for accurate calculations

**Implementation**:
- [ ] Plate inventory editor
- [ ] Auto-calculate loadable weight limits
- [ ] Plate pairing optimizer
- [ ] Missing plate warnings

---

#### 9. Equipment-Specific Metrics
**Goal**: Track equipment usage statistics

**Implementation**:
- [ ] Most used equipment
- [ ] Equipment diversity score
- [ ] Unused equipment alerts

---

## Database Schema Changes

### Equipment Model
```prisma
model Equipment {
  id          String   @id @default(cuid())
  name        String   @unique
  category    EquipmentCategory
  description String?
  imageUrl    String?
  
  // For weight equipment
  weight      Float?   // Default weight (kg)
  
  // Relationships
  exercises   ExerciseEquipment[]
  users       UserEquipment[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model ExerciseEquipment {
  exercise    Exercise   @relation(fields: [exerciseId], references: [id])
  exerciseId  String
  equipment   Equipment  @relation(fields: [equipmentId], references: [id])
  equipmentId String
  required    Boolean    @default(true) // vs optional
  
  @@id([exerciseId, equipmentId])
}

model UserEquipment {
  user        User       @relation(fields: [userId], references: [id])
  userId      String
  equipment   Equipment  @relation(fields: [equipmentId], references: [id])
  equipmentId String
  location    String?    // "Home", "Gym A", etc.
  quantity    Int        @default(1)
  
  @@id([userId, equipmentId, location])
}

enum EquipmentCategory {
  WEIGHTS
  MACHINES
  BODYWEIGHT
  CARDIO
  ACCESSORIES
}
```

---

## API Endpoints

### Equipment Management
- `GET /api/equipment` - List all equipment
- `GET /api/equipment/categories` - Get equipment by category
- `GET /api/user/equipment` - Get user's equipment
- `POST /api/user/equipment` - Add equipment to user
- `DELETE /api/user/equipment/:id` - Remove equipment

### Exercise Filtering
- `GET /api/exercises?equipment=barbell,dumbbells` - Filter by equipment
- `GET /api/exercises/:id/alternatives` - Get alternative exercises
- `GET /api/exercises/available` - Exercises user can do

### Templates
- `GET /api/templates?equipment=minimal` - Filter templates by equipment
- `GET /api/templates/:id/equipment-check` - Check if user can do template

---

## Implementation Order

### Week 1: Foundation
1. ✅ Database schema updates
2. ✅ Equipment seed data
3. ✅ Basic API endpoints
4. ✅ Equipment selector component

### Week 2: Core Features
5. ✅ Enhanced plate calculator
6. ✅ Exercise library filters
7. ✅ Equipment badges on exercises

### Week 3: Templates & Polish
8. ✅ Equipment-filtered templates
9. ✅ User equipment profiles
10. ✅ Testing and refinement

---

## Success Metrics

### Functionality
- [ ] Users can select equipment
- [ ] Exercises filter by equipment
- [ ] Plate calculator shows visual representation
- [ ] Templates filter by equipment

### UX
- [ ] Equipment selection < 2 minutes
- [ ] Plate calculator accurate for all bar types
- [ ] Alternative exercises always suggested
- [ ] Mobile-friendly equipment selector

### Data
- [ ] 50+ equipment types in database
- [ ] All exercises tagged with equipment
- [ ] 10+ equipment-specific templates

---

## Next Steps

**Immediate**: Start with Equipment Database Schema
- Update `prisma/schema.prisma`
- Create equipment seed data
- Run migrations
- Test relationships

**Then**: Build Equipment Selector UI
**Finally**: Enhance Plate Calculator

Let's begin! 🚀
