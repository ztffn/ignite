# 🎯 **Draggable Itinerary Implementation Design Document**

## 🎯 **Project Overview**

**Goal**: Implement a high-performance, draggable itinerary list using FlashList v2 that allows users to reorder activities within their travel plans.

**Core Functionality**: Drag-and-drop reordering of itinerary activities with smooth animations and real-time updates.

## 🏗️ **Technical Architecture**

### **Core Technologies**
- **FlashList v2** - High-performance list rendering ([Documentation](https://shopify.github.io/flash-list/docs/))
- **React Native Reanimated** - Smooth drag animations
- **Zustand** - State management for itinerary data
- **Ignite Boilerplate** - UI components and theming

### **Performance Targets**
- **60 FPS** during drag operations
- **Instant rendering** of large itineraries (100+ activities)
- **Smooth scrolling** with no blank cells
- **Memory efficient** view recycling

## 📱 **User Experience Design**

### **Drag & Drop Interaction**
1. **Long press** on activity card initiates drag
2. **Visual feedback** shows card is being dragged
3. **Drop zones** highlight where card can be placed
4. **Smooth animation** when card settles into new position
5. **Immediate visual update** of new order

### **Visual States**
- **Idle**: Normal activity card appearance
- **Dragging**: Elevated card with shadow, reduced opacity
- **Drop Zone**: Highlighted area showing valid drop location
- **Animating**: Smooth transition to new position

## 🔧 **Implementation Plan**

### **Phase 1: Core FlashList Integration** ✅ *COMPLETED*
- [x] Replace FlatList with FlashList
- [x] Implement basic activity rendering
- [x] Add proper TypeScript interfaces
- [x] Integrate with Ignite theme system

### **Phase 2: Drag & Drop Foundation**
- [ ] Install `react-native-reanimated` (if not already present)
- [ ] Create `DraggableActivityCard` component
- [ ] Implement drag gesture handlers
- [ ] Add visual feedback during drag

### **Phase 3: Reordering Logic**
- [ ] Implement `onDragEnd` handler
- [ ] Update activity order in Zustand store
- [ ] Recalculate travel routes between activities
- [ ] Persist changes to storage

### **Phase 4: Animation & Polish**
- [ ] Smooth animations for position changes
- [ ] Haptic feedback on successful reorder
- [ ] Undo/redo functionality
- [ ] Performance optimizations

## 📊 **Data Structure**

### **Current State** (from React mockup)
```typescript
interface Activity {
  id: string
  time: string
  title: string
  type: ActivityType
  location?: string
  tags?: string[]
  emoji: string
  description?: string
  rating?: number
  price?: string
  // ... other properties
}

interface Day {
  id: string
  date: string
  city: string
  activities: Activity[]  // ← This array will be reorderable
  routes: TravelRoute[]
}
```

### **Required Changes**
```typescript
interface Day {
  id: string
  date: string
  city: string
  activities: Activity[]
  routes: TravelRoute[]
  // New properties for drag & drop
  activityOrder: string[]  // Array of activity IDs in display order
}
```

## 🎨 **Component Architecture**

### **Component Hierarchy**
```
ItineraryScreen
├── Header (Fixed)
│   ├── Back Button
│   ├── Trip Title & Date
│   ├── Day Navigation Chips
│   └── Settings Button
├── FlashList (Scrollable)
│   ├── DraggableActivityCard[]
│   └── TravelRouteChunk[]
└── Add Activity Button (Floating)
```

### **Key Components**
1. **`DraggableActivityCard`** - Wraps activity data with drag handlers
2. **`TravelRouteChunk`** - Shows transport between activities
3. **`DropZoneIndicator`** - Visual feedback during drag operations
4. **`ReorderableFlashList`** - Enhanced FlashList with drag support

## ⚡ **Performance Considerations**

### **FlashList v2 Benefits** ([Documentation](https://shopify.github.io/flash-list/docs/))
- **No size estimates required** - Automatically handles item sizing
- **View recycling** - Efficient memory usage
- **JS-only solution** - No native dependencies
- **Built for new architecture** - Optimized for React Native's latest features

### **Optimization Strategies**
- **`estimatedItemSize`** - Set to average activity card height (120px)
- **`getItemType`** - Different types for activities vs. routes
- **`maintainVisibleContentPosition`** - Preserves scroll position during reorder
- **`removeClippedSubviews`** - Reduces memory usage

## 🗃️ **State Management**

### **Zustand Store Updates**
```typescript
interface ItineraryStore {
  // Current state
  days: Day[]
  selectedDay: string
  
  // Actions
  reorderActivities: (dayId: string, fromIndex: number, toIndex: number) => void
  updateActivityTime: (activityId: string, newTime: string) => void
  addActivity: (dayId: string, activity: Activity) => void
  removeActivity: (activityId: string) => void
}
```

### **Reordering Logic**
```typescript
const reorderActivities = (dayId: string, fromIndex: number, toIndex: number) => {
  set(state => {
    const day = state.days.find(d => d.id === dayId)
    if (!day) return
    
    const newActivities = [...day.activities]
    const [movedActivity] = newActivities.splice(fromIndex, 1)
    newActivities.splice(toIndex, 0, movedActivity)
    
    // Update routes to match new order
    const newRoutes = recalculateRoutes(newActivities)
    
    day.activities = newActivities
    day.routes = newRoutes
  })
}
```

## 🧪 **Testing Strategy**

### **Unit Tests**
- Drag gesture recognition
- Reordering logic
- State updates
- Route recalculation

### **Integration Tests**
- End-to-end drag and drop
- Performance with large datasets
- Memory usage during operations

### **User Testing**
- Drag sensitivity and responsiveness
- Visual feedback clarity
- Error handling for edge cases

## 📱 **Platform Considerations**

### **iOS**
- **Haptic feedback** on successful reorder
- **Smooth animations** using Core Animation
- **Accessibility** support for VoiceOver

### **Android**
- **Ripple effects** during drag operations
- **Material Design** animations
- **Accessibility** support for TalkBack

## 🚀 **Implementation Timeline**

### **Week 1: Foundation**
- [ ] Set up drag gesture handlers
- [ ] Create basic draggable card component
- [ ] Implement visual feedback states

### **Week 2: Core Functionality**
- [ ] Add reordering logic
- [ ] Integrate with Zustand store
- [ ] Handle route updates

### **Week 3: Polish & Testing**
- [ ] Smooth animations
- [ ] Performance optimization
- [ ] Cross-platform testing

## 🔍 **Success Metrics**

- **Performance**: 60 FPS during drag operations
- **Usability**: Intuitive drag and drop interaction
- **Reliability**: No data loss during reordering
- **Accessibility**: Full screen reader support

## 📚 **References**

- [FlashList v2 Documentation](https://shopify.github.io/flash-list/docs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Ignite Boilerplate](https://github.com/infinitered/ignite)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**Created**: $(date)
**Status**: Planning Phase
**Next Action**: Begin Phase 2 - Drag & Drop Foundation
