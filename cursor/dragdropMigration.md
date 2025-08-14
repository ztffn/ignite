# **Itinerary Drag & Drop Migration Guide**

## **Current Implementation Overview**

We have implemented a **rule-based, dynamic reordering system** for a multi-day travel itinerary using `react-native-reorderable-list`. The system handles complex scenarios that most drag-and-drop plugins don't account for by default.

## **Core Functionality Implemented**

### **1. Multi-Day Structure with Day Headers**
- **Data Structure**: Each day has a header (non-draggable) followed by activities (draggable)
- **Flattened List**: Single `ReorderableList` containing mixed item types (day headers + activities)
- **Visual Integrity**: Day headers must never be moved or overwritten
x
### **2. Rule-Based Protection System**
- **Rule 1**: Position 0 protection - never allow drops above the first day header
- **Rule 2**: Dynamic day header handling - context-aware positioning for end-of-day drops
- **Rule 3**: Normal reorder logic for standard activity-to-activity moves

### **3. Cross-Day Reordering**
- Activities can be moved between different days (Amsterdam → Brussels → Paris)
- Smart positioning within target days (beginning, middle, or end)
- Maintains day boundaries and visual structure

### **4. Alternative View Modes**
- **Compact**: Dense, table-like layout with minimal spacing
- **List**: Balanced, readable layout (current default)
- **Cards**: Spacious, visual layout with enhanced elements
- **Layout Changer**: User can switch between view modes with persistence

## **Critical Technical Requirements**

### **State Management**
- **Zustand Store**: Uses `useTripStore` for itinerary data
- **Local State**: `itineraryData` state that can be modified and persists changes
- **No Rollback**: Items must stay where users place them

### **Data Structure Assumptions**
- **Day Object**: `{ id, date, city, activities[], routes[] }`
- **Activity Object**: `{ id, time, title, type, location, tags, emoji, hasDocument, ... }`
- **Mixed Item Types**: List contains both day headers and activities with type discrimination

### **Position Calculation Logic**
- **Dynamic Indexing**: Works with any number of days and activities
- **Context-Aware**: Understands data structure automatically
- **Fallback Handling**: Multiple strategies for edge cases

## **Key Caveats & Migration Challenges**

### **1. Day Header Protection**
- **Most plugins don't handle mixed item types** - they expect homogeneous lists
- **Position 0 protection is critical** - prevents breaking the visual hierarchy
- **Day headers must remain non-draggable** while activities are fully draggable

### **2. Cross-Day Movement Complexity**
- **Standard plugins expect same-list reordering** - we need cross-list functionality
- **Position calculation is complex** - need to map between flattened indices and day-specific positions
- **State updates affect multiple days** - source day loses activity, target day gains activity

### **3. View Mode Integration**
- **Layout density affects spacing and sizing** - new plugin must respect these style variations
- **Transportation chunks** between activities - these are rendered separately and shouldn't interfere with drag logic

### **4. Performance Considerations**
- **Large datasets** - itinerary can have 3+ days with 7+ activities each
- **Real-time updates** - drag feedback must be smooth
- **Memory management** - avoid recreating large objects during reordering

## **Migration Requirements for New Plugin**

### **Essential Features**
- ✅ **Mixed item types** support (day headers + activities)
- ✅ **Custom drag constraints** (prevent day header movement)
- ✅ **Cross-list reordering** (move between different days)
- ✅ **Position validation** (prevent invalid drops)
- ✅ **Custom drop zones** (end-of-day placement on day headers)

### **Integration Points**
- **State Management**: Must work with existing Zustand store
- **View Modes**: Must respect layout density styling
- **Transportation**: Must not interfere with travel chunk rendering
- **Persistence**: Must maintain user's layout preferences

### **Testing Scenarios**
1. **Same-day reordering** within Amsterdam day
2. **Cross-day movement** from Amsterdam to Brussels
3. **End-of-day placement** by dropping on day headers
4. **Position 0 protection** (should redirect, not fail)
5. **View mode switching** (Compact/List/Cards)
6. **Large dataset handling** (multiple days with many activities)

## **Current Implementation Files**

- **Main Component**: `boilerplate/app/screens/Hopla/ItineraryScreen.tsx`
- **Key Logic**: `handleReorder`, `calculateValidPositionForDayHeader`, `handleReorderInternal`
- **State Management**: `itineraryData`, `layoutDensity`, `expandedRoutes`
- **View Modes**: `densityStyles` object with mode-specific styling

## **Success Criteria for Migration**

- ✅ **All existing functionality preserved** (cross-day, end-of-day, position 0 protection)
- ✅ **Performance maintained or improved** (smooth dragging, no lag)
- ✅ **View modes continue working** (Compact/List/Cards with proper styling)
- ✅ **No regression in user experience** (items stay where placed, no bounce-back)
- ✅ **Future-proof architecture** (works with dynamic data, not just mock data)

## **Red Flags to Watch For**

- ❌ **Plugin only supports homogeneous lists** (won't handle day headers + activities)
- ❌ **No custom drag constraints** (day headers might become draggable)
- ❌ **Limited to single-list reordering** (can't move between days)
- ❌ **Hardcoded position assumptions** (won't work with variable day/activity counts)
- ❌ **Performance issues with large datasets** (lag during dragging)

---

**Remember**: This isn't just a simple list reordering - it's a complex, multi-dimensional itinerary management system that happens to use drag-and-drop as its primary interaction method. The new plugin must understand and respect these business logic requirements.

---

# **Itinerary Alternative Views - Design & Implementation Brief**

## **Current State Analysis**
- ✅ Layout changer button implemented (⚙️ icon)
- ✅ Three view modes defined: Compact, List, Cards
- ✅ Current implementation shows "List" view by default
- ✅ TypeScript compilation working
- ✅ Navigation to Ignite components working

## **Screenshot Analysis - List View Features**

### **Visual Design Elements**
1. **Clean, minimalist list format** with white background and dark text
2. **Column headers**: Faint "Time" and "Activity" labels above activities
3. **Day sections**: Each day has a header with date, city, and "+ Add" button
4. **Activity rows**: Vertical list with time, icon, title, and optional document indicators
5. **Selection highlighting**: Active/selected items have light gray background + left border bar

### **Layout Structure**
- **Top Navigation**: Back arrow, trip title "European Adventure", layout/view mode selector, profile icon
- **Main Content**: Scrollable day-by-day itinerary
- **Bottom Tab Bar**: Home, Itinerary (active), Map, Explore, Vault

### **Current List View Implementation**
- ✅ Day headers with date and city
- ✅ Activity cards with time, emoji, title, location, tags
- ✅ Transportation chunks between activities
- ✅ Document indicators for activities with attachments
- ✅ Drag and drop functionality

## **Alternative View Modes - Design Specifications**

### **1. Compact View**
**Purpose**: Show more activities in less space, prioritize information density
**Visual Changes**:
- Reduce card padding from `spacing.md` to `spacing.sm`
- Reduce margins between items from `spacing.sm` to `spacing.xs`
- Smaller emoji size: from 24px to 18px
- Condensed text: smaller font sizes, tighter line heights
- Hide secondary information (tags, location) by default
- Show tags only on hover/expand
- Transportation chunks: minimal height, expandable on tap

**Layout Logic**:
```typescript
const compactStyles = {
  padding: spacing.sm, // vs spacing.md
  marginBottom: spacing.xs, // vs spacing.sm
  emojiSize: 18, // vs 24
  textSize: { title: 14, subtitle: 12 }, // vs 16, 14
  showTags: false, // vs true
  transportHeight: 'minimal' // vs 'expanded'
}
```

### **2. List View (Current)**
**Purpose**: Balanced view with good readability and information display
**Current Implementation**: ✅ Working as shown in screenshot
**Features**:
- Standard spacing and typography
- Full activity information visible
- Transportation chunks expanded by default
- Document indicators prominently displayed

### **3. Cards View**
**Purpose**: Visual, spacious layout emphasizing individual activities
**Visual Changes**:
- Increase card padding to `spacing.lg`
- Add subtle shadows and borders
- Larger emoji size: from 24px to 32px
- More prominent activity titles
- Enhanced visual hierarchy
- Background images for activities (if available)
- Card-based transportation chunks with visual separators

**Layout Logic**:
```typescript
const cardStyles = {
  padding: spacing.lg, // vs spacing.md
  marginBottom: spacing.md, // vs spacing.sm
  emojiSize: 32, // vs 24
  textSize: { title: 18, subtitle: 16 }, // vs 16, 14
  showBackground: true, // vs false
  enhancedBorders: true, // vs false
  transportStyle: 'card' // vs 'minimal'
}
```

## **Implementation Strategy**

### **Phase 1: View Mode State Management**
1. **Extend current `layoutMode` state** to include view-specific styles
2. **Create view mode style objects** for each layout type
3. **Implement style switching logic** in component rendering

### **Phase 2: Component Styling Updates**
1. **Update `DraggableItem` component** to accept and apply view-specific styles
2. **Update `TravelChunk` component** for different view modes
3. **Update day headers** for consistent styling across views

### **Phase 3: Layout-Specific Features**
1. **Compact view**: Implement collapsible tags, minimal transport
2. **Cards view**: Add background image support, enhanced visual elements
3. **Responsive adjustments**: Handle different screen sizes appropriately

## **Technical Considerations**

### **Performance**
- **Style objects**: Pre-compute styles for each view mode to avoid runtime calculations
- **Conditional rendering**: Use view mode to determine which components/elements to render
- **Memoization**: Memoize style objects and component props where appropriate

### **Accessibility**
- **View mode indicators**: Ensure screen readers can identify current view mode
- **Touch targets**: Maintain minimum 44px touch targets across all view modes
- **Contrast ratios**: Ensure text remains readable in all view modes

### **State Persistence**
- **User preference**: Save selected view mode in local storage
- **Per-trip settings**: Allow different view modes for different trips
- **Default fallback**: Always fall back to "List" view if issues occur

## **Questions for Clarification**

1. **View Mode Persistence**: Should the selected view mode persist across app sessions, or reset to default each time?

2. **Transportation Chunks**: In Compact view, should transportation be completely hidden, minimized, or just collapsible?

3. **Background Images**: For Cards view, should we use the `backgroundImage` field from the mock data, or create placeholder backgrounds?

4. **Animation Transitions**: Should there be smooth transitions when switching between view modes, or instant changes?

5. **Responsive Behavior**: How should the views adapt on different screen sizes (tablets, different phone orientations)?

6. **Document Indicators**: Should document indicators be handled differently in each view mode (e.g., more prominent in Cards view)?

## **Implementation Priority**

1. **High Priority**: Basic view mode switching with style changes
2. **Medium Priority**: View-specific features (compact tags, card backgrounds)
3. **Low Priority**: Animations, advanced responsive behavior

## **Success Criteria**

- ✅ User can switch between three distinct view modes
- ✅ Each view mode has clearly different visual appearance
- ✅ All existing functionality (drag & drop, transportation, documents) works in all views
- ✅ Performance remains smooth across view mode switches
- ✅ No TypeScript compilation errors
- ✅ No regression in current List view functionality

---

**Ready to proceed with implementation once questions are clarified.**

## **Detailed Specifications from Documentation**

### **From `itiniaryDescription.md` - Visual Structure Details**

#### **Header Section (Fixed, 120px height)**
- **Back button**: Left-pointing arrow with hover states
- **Trip title**: Centered, medium font weight
- **Date display**: Below title in muted text
- **Day navigation chips**: Horizontal scrollable chips for multi-day trips
- **Selected day**: Primary color background with white text
- **Unselected days**: Secondary background with hover states

#### **Timeline Content Area**
- **Time slot headers**: Sticky positioning with backdrop blur
- **Time slot icons**: Sun (Morning), Sun high (Afternoon), Moon (Evening)
- **Add buttons**: Ghost-style plus buttons for each time slot
- **Activity cards**: Left border color coding by activity type
  - 🍊 Orange: Restaurants, food activities
  - 🟣 Purple: Attractions, entertainment
  - 🟡 Yellow: Museums, cultural sites
  - 🟢 Green: Parks, nature activities
  - 🩷 Pink: Social events, nightlife

#### **Drag & Drop Interactions**
- **Long press start**: 300ms hold to initiate drag
- **Visual feedback**: Card lifts with increased shadow and slight rotation
- **Drop zones**: 120px height when active, dashed borders with primary color
- **Smooth transitions**: 200ms transitions for visual feedback

### **From `reactMockup.md` - Component Structure**

#### **Layout Density System**
```typescript
type LayoutDensity = 'condensed' | 'medium' | 'expanded';

// Density-specific styling
const densityStyles = {
  condensed: {
    padding: 'pb-6 px-4',
    dayHeader: 'text-xl',
    cityText: 'text-sm',
    showTableHeaders: true,
    transportVisibility: 'minimal'
  },
  medium: {
    padding: 'pb-6 px-4', 
    dayHeader: 'text-xl',
    cityText: 'text-base',
    showTableHeaders: false,
    transportVisibility: 'expanded'
  },
  expanded: {
    padding: 'pb-8 px-6',
    dayHeader: 'text-2xl',
    cityText: 'text-base',
    showTableHeaders: false,
    transportVisibility: 'card'
  }
};
```

#### **Activity Card Component Structure**
```typescript
interface ActivityCardProps {
  id: string;
  time: string;
  title: string;
  type: ActivityType;
  location?: string;
  tags?: string[];
  hasDocument?: boolean;
  emoji: string;
  backgroundImage?: string;
  rating?: number;
  price?: string;
  layoutDensity: LayoutDensity;
  isCurrentTime: boolean;
  onTap: () => void;
}
```

#### **Transportation Chunk Component**
```typescript
interface TravelChunkProps {
  fromPlace: string;
  toPlace: string;
  defaultMode: 'walk' | 'metro' | 'bus' | 'car';
  totalTime: string;
  totalDistance: string;
  totalCost?: string;
  steps: RouteStep[];
  expanded: boolean;
  onToggle: () => void;
  offline?: boolean;
}
```

### **Implementation Notes**

1. **Table Headers**: Only shown in condensed view with "Time" and "Activity" columns
2. **Current Time Highlighting**: Selected activity gets light gray background + left border
3. **Background Images**: Available in mock data for cards view enhancement
4. **Document Indicators**: Small document icons (📄) for activities with attachments
5. **Add Stop Buttons**: "+ Add" buttons for each day with context-aware positioning
6. **Auto-collapse**: Transportation routes auto-collapse during scrolling for better UX

## **Auto-Move Implementation for Day Header Protection**

### **Problem Solved**
- **Invalid Drops**: Items could be dragged and dropped before the first day header (index 0)
- **Day Header Overwrites**: Items could land on day headers, breaking the visual structure
- **User Experience**: Users would see failed drag attempts without understanding why
- **Future-Proofing**: Hardcoded logic that wouldn't work with dynamic, real-world data

### **Solution Implemented**
**Rule-Based Reorder Handler** with dynamic position calculation:

1. **Rule 1**: Position 0 protection (first day header always protected)
2. **Rule 2**: Dynamic day header positioning based on context
3. **Rule 3**: Normal reorder logic for all other cases

### **Code Structure**
```typescript
const handleReorder = useCallback(({ from, to }: ReorderableListReorderEvent) => {
  // Rule 1: Position 0 protection
  if (to === 0) {
    const adjustedTo = 1
    handleReorderInternal({ from, to: adjustedTo }, flattenedData)
    return
  }
  
  // Rule 2: Dynamic day header handling
  const toItem = flattenedData[to]
  if (toItem?.type === 'day-header') {
    const targetPosition = calculateValidPositionForDayHeader(to, flattenedData)
    if (targetPosition !== null) {
      handleReorderInternal({ from, to: targetPosition }, flattenedData)
      return
    }
  }
  
  // Rule 3: Normal reorder
  handleReorderInternal({ from, to }, flattenedData)
}, [itineraryData])
```

### **Dynamic Position Calculation**
**Context-Aware Logic** that works with any data structure:

```typescript
const calculateValidPositionForDayHeader = useCallback((dayHeaderIndex: number, flattenedData: any[]) => {
  // Find the previous day's last activity
  let previousDayLastActivity = null
  
  // Walk backwards to find the previous day's structure
  for (let i = dayHeaderIndex - 1; i >= 0; i--) {
    const item = flattenedData[i]
    if (item?.type === 'day-header') {
      break // Found the previous day header
    }
    if (item?.type === 'activity' && previousDayLastActivity === null) {
      previousDayLastActivity = i // Found the last activity of the previous day
    }
  }
  
  if (previousDayLastActivity !== null) {
    return previousDayLastActivity // Place after the last activity
  }
  
  // Fallback: place at the beginning of the current day
  for (let i = dayHeaderIndex + 1; i < flattenedData.length; i++) {
    if (flattenedData[i]?.type === 'activity') {
      return i
    }
  }
  
  return flattenedData.length - 1 // Last resort
}, [])
```

### **Key Benefits**
- **Rule-Based**: Clear, predictable behavior based on simple rules
- **Dynamic**: Works with any number of days and activities
- **Context-Aware**: Understands the structure of the data automatically
- **Future-Proof**: No hardcoded assumptions about data layout
- **Maintainable**: Easy to modify rules without breaking functionality

### **Protection Rules (Final)**
1. **Position 0**: 🛡️ Never allow drops above the first day header
2. **Day Headers**: 🎯 Dynamic positioning based on context (not hardcoded)
3. **Cross-Day Reordering**: ✅ **ALLOWED** - Activities can be moved between different days
4. **Activity-Only**: 🛡️ Only activities can be reordered, not day headers

### **How It Works**
1. **User drops on day header**: System analyzes the context
2. **Dynamic calculation**: Finds the appropriate position based on data structure
3. **Context-aware placement**: Places item in the most logical location
4. **Rule-based decisions**: Uses clear rules instead of hardcoded assumptions
5. **Future-proof**: Works with any data structure, not just current mock data

### **Example Scenarios**
- **Drop above "Monday Dec 9"**: ❌ Protected, redirects to first activity
- **Drop on "Tuesday Dec 10" header**: ✅ Places at end of Monday's activities
- **Drop on "Wednesday Dec 11" header**: ✅ Places at end of Tuesday's activities
- **Drop on any activity**: ✅ Normal reordering behavior

### **Cross-Day Reordering Features**
- **Flexible Movement**: Activities can be dragged from Amsterdam to Brussels to Paris
- **Smart Positioning**: Calculates correct position within target day's activity list
- **State Management**: Properly updates both source and target day data
- **Visual Feedback**: Console logs show the cross-day movement process

### **Example Cross-Day Reorder**
```
🌍 Cross-day reorder allowed: { 
  fromDay: 0, toDay: 1, 
  fromCity: "Amsterdam", toCity: "Brussels" 
}
📤 Removed from source day: Amsterdam - Anne Frank House
📥 Added to target day: Brussels - Anne Frank House at position 2
✅ Cross-day reorder completed successfully
```

### **Debug Logging**
Comprehensive console logging for troubleshooting:
- 🔄 Reorder triggered events
- 🛡️ Protection activations
- 🌍 Reorder type (Same-day vs Cross-day)
- 📋 Same-day reorder details (before/after)
- 📤 Cross-day removal details
- 🎯 Target positioning calculations
- 📥 Cross-day insertion details
- ✅ Success confirmations

### **Simplified Logging Examples**
**Same-day reorder:**
```
🌍 Reorder type: Same-day { fromDay: 1, toDay: 1 }
📋 Same-day - Before: ["Medical Check-in", "Grand Place", "Brussels History Museum"]
📋 Same-day - After: ["Grand Place", "Medical Check-in", "Brussels History Museum"]
✅ Same-day reorder completed
```

**Cross-day reorder:**
```
🌍 Reorder type: Cross-day { fromDay: 1, toDay: 0 }
📤 Removed from day 1 - Medical Check-in
🎯 Target: { day: 0, position: 2, totalActivities: 7 }
📥 Added to day 0 - Medical Check-in at position 2
✅ Cross-day reorder completed
```

### **Migration Strategy**

1. **Replace current `layoutMode`** with `LayoutDensity` type system
2. **Update `DraggableItem`** to match `ActivityCard` interface
3. **Enhance `TravelChunk`** with expandable steps and offline indicators
4. **Implement density-specific styling** for day headers and spacing
5. **Add table headers** for condensed view
6. **Integrate background images** for cards view
7. **Maintain drag & drop** functionality across all view modes
