# Quick Reference: Mobile Lab Implementation

## Copy-Paste Template

### 1. Add Imports (Top of file)
```tsx
import { MobileLayout, MobileBadge, MobileControlGroup } from '../../components/lab/MobileLayout';
import { X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
```

### 2. Add State (Inside component)
```tsx
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
```

### 3. Create Sidebar Component (Before return)
```tsx
const SidebarContent = () => (
  <div className="h-full bg-[YOUR_BG_COLOR]">
    <div className="lg:hidden p-4 border-b border-white/10 flex items-center justify-between">
      <h2 className="text-[YOUR_COLOR] font-bold text-sm">Topics</h2>
      <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
        <X size={20} />
      </button>
    </div>
    {/* Your existing sidebar component */}
  </div>
);
```

### 4. Modify Return Statement
```tsx
return (
  <>
    {/* Mobile View */}
    <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 overflow-y-auto">
      <MobileLayout
        title="YOUR_LAB_TITLE"
        description={<>YOUR_DESCRIPTION</>}
        headerStyle="brand-center"
        headerTitle={<>YOUR_HEADER</>}
        badges={[
          <MobileBadge variant="cyan" key="b1">BADGE_TEXT</MobileBadge>,
        ]}
        visualContent={
          <div className="h-full flex flex-col p-2">
            {/* Your simulation component */}
          </div>
        }
        controls={
          <div className="flex flex-col gap-4 w-full">
            <MobileControlGroup
              onPlay={YOUR_PLAY_HANDLER}
              onReset={YOUR_RESET_HANDLER}
              onNext={YOUR_NEXT_HANDLER}
              onPrev={YOUR_PREV_HANDLER}
              isPlaying={YOUR_PLAYING_STATE}
            />
          </div>
        }
        infoContent={<div>YOUR_INFO</div>}
        onMenuToggle={() => setIsSidebarOpen(true)}
        onExit={() => window.history.back()}
      />

      {/* Sidebar Modal */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 z-[70] shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>

    {/* Desktop View */}
    <div className="hidden lg:flex ...">
      {/* YOUR EXISTING DESKTOP LAYOUT */}
    </div>
  </>
);
```

## Badge Variants
```tsx
<MobileBadge variant="purple">TEXT</MobileBadge>
<MobileBadge variant="yellow">TEXT</MobileBadge>
<MobileBadge variant="cyan">TEXT</MobileBadge>
<MobileBadge variant="green">TEXT</MobileBadge>
```

## Common Patterns

### Sidebar with Topic Selection
```tsx
onStepSelect={(step) => {
  setCurrentStep(step);
  if (window.innerWidth < 1024) setIsSidebarOpen(false);
}}
```

### Description with Step Counter
```tsx
description={
  <>
    <p>{currentStepData.description}</p>
    <div className="mt-2 text-[10px] opacity-70 italic font-mono">
      Step {currentStep} of {totalSteps} // {simplified ? 'SIMPLIFIED' : 'FULL'}
    </div>
  </>
}
```

### Header with Logo
```tsx
headerTitle={
  <div className="flex items-center gap-2 text-cyan-400 font-bold">
    <div className="w-6 h-6 bg-cyan-500 rounded flex items-center justify-center text-black text-xs">
      L
    </div>
    <span className="text-sm tracking-tight">LAB NAME</span>
  </div>
}
```

## Checklist

- [ ] Add imports
- [ ] Add `isSidebarOpen` state
- [ ] Create `SidebarContent` component
- [ ] Wrap return in `<>...</>`
- [ ] Add mobile view with `MobileLayout`
- [ ] Add sidebar modal with `AnimatePresence`
- [ ] Wrap desktop layout in `hidden lg:flex`
- [ ] Test mobile view
- [ ] Test desktop view
- [ ] Test back button
- [ ] Test sidebar open/close
- [ ] Test all controls

## Common Issues

**Issue**: Sidebar doesn't close when clicking topic
**Fix**: Add window width check:
```tsx
if (window.innerWidth < 1024) setIsSidebarOpen(false);
```

**Issue**: Horizontal scroll on mobile
**Fix**: Add to mobile container:
```tsx
className="... overflow-x-hidden"
```

**Issue**: Content cut off
**Fix**: Ensure proper height:
```tsx
className="h-full flex flex-col"
```

## Time Estimate
- Reading this guide: 2 minutes
- Implementation: 15-20 minutes per lab
- Testing: 5 minutes per lab
- **Total per lab: ~25 minutes**
