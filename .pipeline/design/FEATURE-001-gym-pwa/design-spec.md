# Design Specification: Strength Trainer PWA

## 1. Design Vision & Objective
- **Target Audience**: Personal trainers managing student rosters and fitness enthusiasts/students performing high-intensity workouts in gym environments.
- **Brand Personality**: **Professional, Energetic, and Performance-driven.** The aesthetic should feel like a high-end piece of gym equipment: precise, durable, and focused.
- **Design Goals**:
    - **High Visibility**: Optimized for gym lighting (often harsh or dim) using a high-contrast dark mode.
    - **Frictionless Interaction**: Large touch targets for sweaty hands and post-set fatigue.
    - **Real-time Feedback**: Immediate visual confirmation of logged sets and progress.
    - **Accessibility**: WCAG AA compliance for contrast and interactivity.

## 2. Design System & Tokens

### Color Palette
- **Primary (Volt)**: `#CEFF05` - Used for primary actions, completion states, and highlighting active elements.
- **Secondary (Deep Slate)**: `#1A1C1E` - Primary background color to reduce glare.
- **Surface (Charcoal)**: `#2C2F33` - Used for cards, modals, and elevated surfaces.
- **Accent (Electric Blue)**: `#00E0FF` - Used for secondary data visualizations or focus states.
- **Semantic**:
    - **Success**: `#4ADE80` (Green-400)
    - **Error**: `#F87171` (Red-400)
    - **Warning**: `#FBBF24` (Amber-400)
- **Neutrals**:
    - **White**: `#FFFFFF`
    - **Gray-400**: `#9CA3AF` (Subtle text)
    - **Gray-800**: `#1F2937` (Borders/Dividers)

### Typography
- **Primary Font**: **Inter** (Sans-serif) - Clean, highly legible at small sizes, and supports multiple weights.
- **Scale**:
    - **H1 (Display)**: 32px / 700 Bold / Leading 1.2
    - **H2 (Section)**: 24px / 600 Semi-bold / Leading 1.3
    - **Body (Large)**: 18px / 400 Regular / Leading 1.5 (For workout instructions)
    - **Body (Default)**: 16px / 400 Regular / Leading 1.5
    - **Caption/Label**: 12px / 500 Medium / Uppercase (For metadata like "SET 1", "REPS")

### Tokens (JSON Format)
```json
{
  "colors": {
    "brand": {
      "primary": "#CEFF05",
      "secondary": "#1A1C1E",
      "surface": "#2C2F33",
      "accent": "#00E0FF"
    },
    "text": {
      "on-primary": "#000000",
      "on-secondary": "#FFFFFF",
      "subtle": "#9CA3AF"
    },
    "status": {
      "success": "#4ADE80",
      "error": "#F87171",
      "warning": "#FBBF24"
    }
  },
  "spacing": {
    "base": 4,
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "xxl": 48
  },
  "typography": {
    "family": "Inter, sans-serif",
    "weights": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },
  "shadows": {
    "subtle": "0 2px 4px rgba(0,0,0,0.5)",
    "elevated": "0 8px 16px rgba(0,0,0,0.8)"
  },
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px",
    "full": "9999px"
  }
}
```

## 3. UI Components & Interaction

### Buttons
- **Primary (Action)**: Solid `Volt` background, Black text. Height: 56px (Large touch target). Radius: `md`.
- **Secondary (Modifier)**: Bordered `Volt` or Solid `Surface`. Height: 48px.
- **Set Completion**: A large, circular toggle button or full-width row that turns `Volt` upon completion.
- **Ghost/Icon**: Used for "Edit" or "Remove" actions to keep the UI clean.

### Inputs
- **Data Input (Load/Reps)**: Large, center-aligned text within a `Surface` container. Tapping triggers a numeric keypad. Use "+" and "-" steppers for quick adjustments.
- **RPE Picker**: A horizontal slider or discrete 1-10 segment control with color-coding (Green for low RPE, Red for high RPE).

### Progress Indicators
- **Set Counter**: Circular "pip" indicators (e.g., 3 circles, filling as sets are completed).
- **Workout Progress**: A thin linear progress bar at the top of the "Active Session" view.

## 4. Layout Guides

### Student Workout Execution (Active Session)
- **Current Exercise Card**: Occupies the top 60% of the viewport. Features a high-visibility title, any media (thumbnail), and current set instructions.
- **Interactive Set Row**: Each set is a row with `REPS`, `LOAD`, and a `CHECK` button. 
- **Sticky Footer**: Contains the "Finish Workout" button and a "Rest Timer" display that triggers automatically between sets.

### Trainer Dashboard
- **Student Roster**: A list of cards showing student name, last activity, and a "Compliance Score" (percentage of assigned workouts completed).
- **Status Indicators**:
    - `Green Dot`: Completed (Today).
    - `Pulsing Volt`: In Progress (Real-time sync).
    - `Yellow/Red`: Overdue or missed sessions.

## 5. Visual Assets & Assets Management
- **Icons**: Use **Lucide React** or **Phosphor Icons**. Stroke weight: 2px (Regular) or 2.5px (Bold).
- **Illustrations**: Minimalist SVG line art for exercise categories.
- **Media**: Thumbnails for exercises should have a 16:9 aspect ratio with a subtle rounded corner (`md`).

## 6. Accessibility & Compliance
- **Contrast**: Maintain a minimum contrast ratio of 4.5:1 for all text (Volt on Slate exceeds this).
- **Touch Targets**: All interactive elements (buttons, inputs) must be at least 44x44px.
- **Haptics**: Use subtle haptic feedback for set completion and timer expiration (if supported by device).
- **Offline States**: Clear "Offline" banner and visual cues for "Pending Sync" data.
