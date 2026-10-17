# Mobile Lab Optimization Guide

## Core Responsive Strategy
To ensure all 14 interactive labs are fully functional and visually premium on mobile devices, we implemented a **Hybrid Mobile Architecture**.

### 1. Standardized "App-Like" Layout (Premier Labs)
For complex simulations (AI Security, Microsoft Office, Blockchain), we deployed a dedicated `MobileLayout` component that mimics a native mobile app experience:
- **Header**: Flexible header supporting "Standard" (Exit/Menu) and "Brand-Center" (Menu/Logo/Close) styles.
- **Title Zone**: Prominent title, badges, and scenario description separate from the visual area.
- **Visual Stage**: A focused, aspect-ratio preserved container for the simulation content, free of clutter.
- **Control Deck**: Unified bottom controls (Play, Reset, Next/Prev) for ergonomic access.
- **Info Cards**: Contextual instruction cards that don't obscure the simulation.

**Implemented In:**
- ✅ **AI Security Lab**: Refactored to use `MobileLayout` (Standard Header) with a "Minimal" mode for the simulation engine.
- ✅ **Microsoft Office Lab**: Refactored to use `MobileLayout` (Standard Header) with mapped controls for all Office apps.
- ✅ **TrustLink Blockchain Lab**: Refactored to use `MobileLayout` (Brand-Center Header) matching specific branding requirements.

### 2. Vertical Stack Architecture (Standard Labs)
For standard labs, we optimized the existing layout to be mobile-friendly:
- **Vertical Flow**: Sidebar -> Content -> Info Panel (User scrolls down).
- **Full-Width Adaptation**: All specialized components (Sidebars, Info Panels) now use `w-full` on mobile.
- **Touch Profiling**: Enlarged touch targets and ensured scrolling works natively.

**Implemented In:**
- All other 11 Labs (Banking, Stock Market, etc.).

## Component Library
- **`components/lab/MobileLayout.tsx`**: The core layout wrapper. Supports `headerStyle="standard" | "brand-center"`.
- **`MobileBadge`**: Standardized status pills (e.g., "MODULE: PHISHING").
- **`MobileControlGroup`**: Standardized playback controls.

## Key Technical Decisions
- **Conditional Rendering**: Labs use `md:hidden` / `lg:hidden` to switch between the tailored Mobile Layout and the robust Desktop Layout without state duplication.
- **Portal Menus**: Sidebars on mobile are rendered in a full-screen portal/overlay for maximum usability.
- **History Integration**: "Exit" button triggers `history.back()`, which cleanly closes the lab modal.

## Future Rollout
To apply the "App-Like" layout to remaining labs, wrap their `App.tsx` return statement with the `MobileLayout` component, mapping their internal state (step, isPlaying, activeModule) to the layout props.
