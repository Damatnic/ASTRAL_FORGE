# Astral Forge Design Foundation

## Overview
This document defines the foundational design system for Astral Forge, including spacing, layout principles, color usage, typography, and component patterns.

---

## Spacing System

### Base Unit
- **Base**: 4px (0.25rem)
- All spacing should be multiples of the base unit

### Spacing Scale
```
xs:   4px   (0.25rem)  - Tight spacing within components
sm:   8px   (0.5rem)   - Small gaps, icon margins
md:   16px  (1rem)     - Standard component spacing
lg:   24px  (1.5rem)   - Section spacing
xl:   32px  (2rem)     - Large section spacing
2xl:  48px  (3rem)     - Major section breaks
3xl:  64px  (4rem)     - Page section dividers
4xl:  96px  (6rem)     - Hero/banner spacing
```

### Spacing Usage Guidelines
- **Component Internal Spacing**: Use `xs` (4px) to `sm` (8px)
- **Component Padding**: Use `md` (16px) to `lg` (24px)
- **Section Gaps**: Use `lg` (24px) to `xl` (32px)
- **Page Sections**: Use `2xl` (48px) to `3xl` (64px)
- **Major Divisions**: Use `3xl` (64px) to `4xl` (96px)

---

## Layout System

### Container Widths
```
sm:   640px   - Mobile landscape
md:   768px   - Tablet
lg:   1024px  - Desktop
xl:   1280px  - Large desktop
2xl:  1536px  - Extra large desktop

Max Width: 1920px (enforced on largest screens)
```

### Grid System
- **12-column grid** for complex layouts
- **Auto-fit grid** for card layouts
- **Flexbox** for simple linear layouts

### Responsive Breakpoints
```typescript
breakpoints: {
  sm: '640px',   // Mobile landscape & small tablets
  md: '768px',   // Tablets
  lg: '1024px',  // Laptops & desktops
  xl: '1280px',  // Large desktops
  '2xl': '1536px' // Extra large screens
}
```

---

## Color System

### Base Colors
```css
--astral-dark: #0a0a0a;    /* Primary background */
--astral-gray: #1a1a1a;    /* Secondary surfaces */
--astral-light: #2a2a2a;   /* Elevated surfaces */
```

### Primary Gradients
```css
--astral-blue: #3b82f6;
--astral-purple: #8b5cf6;
--astral-cyan: #06b6d4;
```

### Semantic Colors
```css
--success: #10b981;  /* Achievements, positive actions */
--warning: #f59e0b;  /* Caution, attention needed */
--error: #ef4444;    /* Errors, destructive actions */
--info: #3b82f6;     /* Information, neutral alerts */
```

### Gaming Tier Colors
Used for rarity, achievements, and item classifications:
```css
--tier-common: #9ca3af;      /* Gray - Common items */
--tier-uncommon: #10b981;    /* Green - Uncommon items */
--tier-rare: #3b82f6;        /* Blue - Rare items */
--tier-epic: #8b5cf6;        /* Purple - Epic items */
--tier-legendary: #f59e0b;   /* Gold - Legendary items */
--tier-mythic: #ef4444;      /* Red - Mythic items */
```

### Status Indicators
```css
--health: #ef4444;   /* HP, health metrics */
--mana: #3b82f6;     /* Energy, mental resources */
--energy: #f59e0b;   /* Stamina, physical energy */
--xp: #10b981;       /* Experience, progress */
```

### Color Usage Guidelines
- **Backgrounds**: Use `astral-dark` for main background, `astral-gray` for cards/surfaces
- **Text**: White (#ffffff) for primary, gray-400 (#9ca3af) for secondary
- **Accents**: Use gradient combinations (blue-purple, cyan-blue)
- **Interactive Elements**: Blue (#3b82f6) for links/buttons
- **State Colors**: Success for confirmations, error for destructive actions

---

## Typography System

### Font Families
```css
--font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 
                sans-serif;
--font-mono: 'Monaco', 'Courier New', monospace;
```

### Type Scale

#### Display Text (Hero sections, landing pages)
- **XL**: 72px / 4.5rem - Line height: 1 - Weight: 800
- **LG**: 60px / 3.75rem - Line height: 1 - Weight: 700
- **MD**: 48px / 3rem - Line height: 1.1 - Weight: 700
- **SM**: 36px / 2.25rem - Line height: 1.2 - Weight: 600

#### Headings (Section titles, card headers)
- **XL**: 30px / 1.875rem - Line height: 1.3 - Weight: 600
- **LG**: 24px / 1.5rem - Line height: 1.3 - Weight: 600
- **MD**: 20px / 1.25rem - Line height: 1.4 - Weight: 500
- **SM**: 18px / 1.125rem - Line height: 1.4 - Weight: 500

#### Body Text (Paragraphs, general content)
- **XL**: 18px / 1.125rem - Line height: 1.5 - Weight: 400
- **LG**: 16px / 1rem - Line height: 1.5 - Weight: 400
- **MD**: 14px / 0.875rem - Line height: 1.5 - Weight: 400
- **SM**: 12px / 0.75rem - Line height: 1.4 - Weight: 400

### Typography Usage
- **Hero Titles**: `text-display-lg` or `text-display-xl`
- **Page Titles**: `text-display-sm` or `text-heading-xl`
- **Section Headers**: `text-heading-lg` or `text-heading-md`
- **Card Titles**: `text-heading-md` or `text-heading-sm`
- **Body Content**: `text-body-lg` (default) or `text-body-md`
- **Captions/Labels**: `text-body-sm`

---

## Shadow System

### Shadow Scale
```css
shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow:     0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Glow Effects
```css
glow-blue:   0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
glow-purple: 0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
glow-gold:   0 0 10px rgba(245, 158, 11, 0.5), 0 0 20px rgba(245, 158, 11, 0.3);
```

---

## Border Radius

```css
rounded-sm:   0.125rem  (2px)  - Subtle rounding
rounded:      0.25rem   (4px)  - Standard
rounded-md:   0.375rem  (6px)  - Medium
rounded-lg:   0.5rem    (8px)  - Large components
rounded-xl:   0.75rem   (12px) - Cards
rounded-2xl:  1rem      (16px) - Modal dialogs
rounded-full: 9999px           - Circles, pills
```

---

## Animation Principles

### Duration
- **Instant**: 100ms - Micro-interactions
- **Fast**: 200ms - Hover states, toggles
- **Normal**: 300ms - Default transitions
- **Slow**: 500ms - Page transitions, complex animations

### Easing
- **ease-in**: Slow start - For exit animations
- **ease-out**: Slow end - For entrance animations
- **ease-in-out**: Slow both - For movement
- **linear**: Constant - For rotations, loading

### Motion Guidelines
1. **Reduce Motion**: Respect `prefers-reduced-motion` setting
2. **Purpose**: Every animation should have a purpose
3. **Performance**: Use `transform` and `opacity` for best performance
4. **Consistency**: Same element types = same animations

---

## Z-Index Scale

```typescript
z-index: {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal-backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  notification: 1080,
}
```

---

## Accessibility Standards

### Color Contrast
- **Normal Text**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

### Focus States
- All interactive elements must have visible focus indicators
- Use `ring-2 ring-blue-500 ring-offset-2 ring-offset-astral-dark` for focus

### Touch Targets
- Minimum 44x44px for touch targets
- 8px minimum spacing between touch targets

### Keyboard Navigation
- All functionality must be keyboard accessible
- Logical tab order
- Escape key closes modals/dropdowns

---

## Component Patterns

### Cards
```tsx
<div className="bg-astral-gray rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
  {/* Card content */}
</div>
```

### Buttons
```tsx
// Primary
<button className="bg-gradient-to-r from-astral-blue to-astral-purple text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
  
// Secondary  
<button className="bg-astral-light text-white px-6 py-3 rounded-lg hover:bg-astral-gray transition-colors">

// Destructive
<button className="bg-error text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors">
```

### Input Fields
```tsx
<input className="bg-astral-light border border-astral-gray text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
```

---

## Best Practices

### Performance
1. Lazy load images and heavy components
2. Use `will-change` sparingly for animations
3. Implement virtual scrolling for long lists
4. Debounce search inputs

### Responsiveness
1. Mobile-first approach
2. Touch-friendly targets (min 44px)
3. Test on real devices
4. Consider thumb zones on mobile

### Consistency
1. Reuse components from the library
2. Follow naming conventions
3. Maintain spacing consistency
4. Use design tokens (CSS variables)

### Code Quality
1. TypeScript for type safety
2. Prop validation
3. Error boundaries
4. Comprehensive testing

---

## File Organization

```
components/
├── ui/           # Base components (buttons, inputs, cards)
├── layout/       # Layout primitives (grid, stack, container)
├── navigation/   # Nav components (sidebar, header, breadcrumbs)
├── forms/        # Form components
├── feedback/     # Modals, toasts, alerts
└── [feature]/    # Feature-specific components
```

---

*This foundation document should be referenced for all design and development decisions within Astral Forge.*
