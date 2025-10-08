# Path A - Phase 4: Equipment System

**Timeline:** 4-5 hours total  
**Started:** October 7, 2025  
**Status:** 🚧 IN PROGRESS

---

## 🎯 Objective

Build a comprehensive equipment tracking system that enables:
- Users to manage their gym equipment inventory
- Filter exercises by available equipment
- Personalize workout programs based on equipment
- Support home gym vs commercial gym scenarios

---

## 📋 Session Breakdown

### Session 1: Database Schema & API Foundation (1 hour)
**Status:** 🔄 CURRENT

**Tasks:**
1. ✅ Create plan document
2. ⏳ Design Equipment model in Prisma schema
3. ⏳ Create user_equipment junction table
4. ⏳ Add equipment field to Exercise model
5. ⏳ Run database migrations
6. ⏳ Create /api/equipment endpoints (GET, POST, PUT, DELETE)
7. ⏳ Test API with sample data

**Database Schema:**
```prisma
model Equipment {
  id          String   @id @default(cuid())
  name        String   @unique
  category    String   // Barbell, Dumbbell, Machine, Bodyweight, etc.
  icon        String?  // Icon name for UI
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  userEquipment UserEquipment[]
  exercises     Exercise[]      @relation("ExerciseEquipment")
}

model UserEquipment {
  id          String   @id @default(cuid())
  userId      String
  equipmentId String
  location    String   // "home" | "gym" | "travel"
  quantity    Int      @default(1)
  notes       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  equipment Equipment @relation(fields: [equipmentId], references: [id], onDelete: Cascade)
  
  @@unique([userId, equipmentId, location])
  @@index([userId])
}

// Update Exercise model to add equipment relation
model Exercise {
  // ... existing fields ...
  requiredEquipment Equipment[] @relation("ExerciseEquipment")
}
```

**API Endpoints:**
- `GET /api/equipment` - List all equipment types
- `GET /api/equipment/user` - Get user's equipment
- `POST /api/equipment/user` - Add equipment to user inventory
- `PUT /api/equipment/user/:id` - Update user equipment
- `DELETE /api/equipment/user/:id` - Remove equipment from inventory

**Deliverables:**
- Updated Prisma schema
- Database migration files
- 5 API endpoints tested and working
- Seed data for common equipment types

---

### Session 2: Equipment Inventory UI (1.5 hours)
**Status:** ⏳ PENDING

**Tasks:**
1. ⏳ Create `/app/equipment/page.tsx` - Equipment inventory dashboard
2. ⏳ Build Equipment card component
3. ⏳ Create "Add Equipment" modal
4. ⏳ Build equipment category filters
5. ⏳ Add location tabs (Home / Gym / Travel)
6. ⏳ Implement equipment CRUD UI flows
7. ⏳ Add empty states and loading states

**UI Components:**
- EquipmentCard - Display equipment with quantity/location
- AddEquipmentModal - Search and add equipment
- EquipmentFilters - Category and location filters
- EquipmentInventory - Main inventory dashboard

**Features:**
- Visual equipment browser with icons
- Quick add from predefined equipment list
- Custom equipment creation
- Location-based organization
- Quantity tracking

**Deliverables:**
- Functional equipment inventory page
- Add/edit/delete equipment flows
- Responsive mobile design
- Gaming-themed UI matching dashboard

---

### Session 3: Exercise Filtering & Integration (1.5 hours)
**Status:** ⏳ PENDING

**Tasks:**
1. ⏳ Update Exercise model with equipment relationships
2. ⏳ Seed exercises with required equipment data
3. ⏳ Build equipment filter in exercise browser
4. ⏳ Update program browser to show equipment requirements
5. ⏳ Create "Available with my equipment" filter
6. ⏳ Add equipment warnings for exercises
7. ⏳ Update workout player to show equipment needs

**Integration Points:**
- `/app/exercises/page.tsx` - Add equipment filter
- `/app/programs/page.tsx` - Show equipment requirements
- Session player - Display required equipment
- Exercise detail pages - List equipment needs

**Smart Features:**
- Auto-filter exercises by available equipment
- Suggest equipment purchases based on programs
- Alternative exercise suggestions when equipment missing
- Equipment-based difficulty adjustments

**Deliverables:**
- Exercises tagged with required equipment
- Working equipment filters in exercise browser
- Equipment badges in UI
- Smart recommendations

---

### Session 4: Testing, Polish & Documentation (1 hour)
**Status:** ⏳ PENDING

**Tasks:**
1. ⏳ Write integration tests for equipment API
2. ⏳ Test equipment CRUD workflows end-to-end
3. ⏳ Test exercise filtering by equipment
4. ⏳ Fix bugs discovered during testing
5. ⏳ Add JSDoc comments to API endpoints
6. ⏳ Update README with equipment system docs
7. ⏳ Create migration guide for existing users

**Testing Checklist:**
- [ ] User can add equipment to inventory
- [ ] User can remove equipment
- [ ] Location filtering works correctly
- [ ] Exercise filter by equipment works
- [ ] Programs show equipment requirements
- [ ] Missing equipment warnings appear
- [ ] API handles errors gracefully
- [ ] Mobile UI is responsive

**Documentation:**
- API endpoint documentation
- Database schema documentation
- Equipment system user guide
- Developer notes for future enhancements

**Deliverables:**
- All tests passing
- Zero critical bugs
- Complete documentation
- Phase 4 complete summary document

---

## 🎮 Equipment Categories

Pre-seeded equipment types:

**Free Weights:**
- Barbell
- Dumbbells
- Kettlebells
- Weight Plates

**Machines:**
- Cable Machine
- Leg Press
- Lat Pulldown
- Chest Press
- Leg Curl/Extension
- Smith Machine

**Bodyweight:**
- Pull-up Bar
- Dip Station
- Parallettes
- Rings

**Cardio:**
- Treadmill
- Rowing Machine
- Assault Bike
- Jump Rope

**Accessories:**
- Bench (Flat/Incline/Decline)
- Squat Rack
- Resistance Bands
- Foam Roller
- Medicine Ball
- Plyo Box

---

## 📊 Success Metrics

**Phase 4 Complete When:**
1. ✅ Database schema deployed
2. ✅ Equipment API endpoints working
3. ✅ Equipment inventory UI functional
4. ✅ Exercise filtering by equipment works
5. ✅ Program browser shows equipment requirements
6. ✅ All tests passing
7. ✅ Documentation complete

**Path A Progress:**
- Before Phase 4: ~6.6 hours (42%)
- After Phase 4: ~11-12 hours (65-75%)
- Remaining: Phase 5 Testing (2 hours)
- Total: 15-19 hours to production-ready

---

## 🚀 Next Steps After Phase 4

1. **Phase 5: Testing & Polish** (2 hours)
   - E2E testing of all Path A features
   - Bug fixes and refinements
   - Production deployment prep
   - Final documentation

2. **Post-Path A Enhancements**
   - Social features
   - Advanced analytics
   - Character system refinement
   - Progressive web app features

---

**Ready to begin Session 1: Database Schema & API Foundation!** 💪
