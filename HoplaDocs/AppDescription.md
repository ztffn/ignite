# Hopla Travel App - Complete Visual & Interaction Documentation

## Application Overview

Hopla is a mobile-first travel companion app designed for modern travelers planning multi-city trips. The app uses a 393px max-width container centered on screen with a card-based interface, bottom tab navigation, and a comprehensive 9-color semantic system for travel contexts.

## Core Application Structure

### Main Container
```tsx
<div className="h-screen bg-background flex flex-col max-w-md mx-auto relative overflow-x-hidden">
```
- **Full viewport height** (100vh) with clean white background
- **393px maximum width** centered horizontally with `mx-auto`
- **Flex column layout** with main content expanding and bottom nav fixed
- **Overflow protection** prevents horizontal scrolling issues
- **Relative positioning** enables modal overlays with proper z-indexing

---

# 🏠 LANDING PAGE (`HoplaLanding`)

**State**: `showLanding = true` (app entry point)
**Layout**: Full-screen without bottom navigation

## Visual Structure

### Container
```tsx
<div className="h-screen bg-background max-w-md mx-auto relative overflow-y-auto">
```
- **Full viewport coverage** with scrollable overflow
- **Clean background** using CSS variable `--background` (white in light mode)
- **Centered 393px width** for optimal mobile experience

### Hero Section (Top 40% of screen)
- **Large Hopla wordmark** in `text-4xl` (36px) with `font-medium` weight
- **Gradient background** or travel-themed hero image from Unsplash
- **Tagline text** in `text-lg` (18px) describing "Your AI travel companion"
- **Color scheme** uses primary brand colors with high contrast for outdoor readability

### Quick Trip Access (Middle 40% of screen)
- **"Recent Trips" heading** in `text-xl` (20px) with medium weight
- **Horizontal scrolling trip cards** with `gap-4` spacing
- **Each trip card structure**:
  ```tsx
  <Card className="min-w-[280px] overflow-hidden">
    <div className="relative h-32">
      <ImageWithFallback src={trip.image} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-3 left-3 text-white">
        <h3 className="font-medium text-lg">{trip.title}</h3>
        <p className="text-sm opacity-90">{trip.dates}</p>
      </div>
    </div>
  </Card>
  ```
- **Card dimensions**: 280px width × 128px height with rounded corners
- **Background images**: Vibrant destination photos from Unsplash
- **Text overlay**: White text with dark gradient overlay for readability
- **Shadow effects**: Cards have subtle drop shadows for depth

### Primary Action (Bottom 20% of screen)
- **"Enter App" button**: Full-width primary button with `h-12` (48px) height
- **Button styling**: Primary color background with white text and medium font weight
- **Margin spacing**: `mx-4 mb-8` for proper touch targets and visual breathing room

## User Interactions
1. **Trip card tap**: `onSelectTrip(trip)` → Sets selected trip and navigates to Dashboard
2. **Enter App tap**: `onEnterApp()` → Hides landing, shows main app with bottom nav
3. **Scroll behavior**: Vertical scrolling for content overflow

---

# 🏠 TRIPS PAGE - Two Visual States

## State 1: Trips List (`TripsList`)
**Condition**: When `selectedTrip = null`
**Purpose**: Overview of all user trips with creation and management options

### Visual Layout

#### Header Section (Fixed, 80px height)
```tsx
<div className="p-4 border-b border-border/50">
  <div className="flex items-center justify-between mb-4">
    <h1 className="text-2xl font-medium">My Trips</h1>
    <Button variant="ghost" size="sm">
      <Plus className="w-5 h-5" />
    </Button>
  </div>
</div>
```
- **Page title**: "My Trips" in large heading (24px) with medium weight
- **Add trip button**: Ghost style button with plus icon in top-right
- **Border separator**: Subtle bottom border using CSS variable `--border`

#### Search Bar (Optional, 56px height when present)
```tsx
<div className="relative px-4 pb-4">
  <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <Input placeholder="Search trips..." className="pl-10" />
</div>
```
- **Search input**: Full-width with left-aligned search icon
- **Placeholder text**: "Search trips..." in muted color
- **Icon positioning**: Absolute positioned search icon with proper vertical centering

#### Trip Cards Grid (Scrollable content area)
```tsx
<div className="p-4 space-y-4">
  {trips.map(trip => (
    <Card key={trip.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <ImageWithFallback 
          src={trip.heroImage} 
          alt={trip.destination}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Trip Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {trip.status} {/* "Upcoming", "Active", "Past" */}
          </Badge>
        </div>
        
        {/* Trip Title & Location */}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-medium mb-1">{trip.title}</h2>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <MapPin className="w-4 h-4" />
            <span>{trip.cities.join(', ')}</span>
          </div>
        </div>
      </div>
      
      {/* Trip Details Footer */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{trip.dateRange}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{trip.days} days</span>
            <Badge variant="outline" className="text-xs">
              {trip.activitiesCount} activities
            </Badge>
          </div>
        </div>
        
        {/* Progress Bar (for active trips) */}
        {trip.status === 'Active' && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Day {trip.currentDay} of {trip.totalDays}</span>
              <span>{Math.round((trip.currentDay / trip.totalDays) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(trip.currentDay / trip.totalDays) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  ))}
</div>
```

### Card Visual Details
- **Card dimensions**: Full width × 240px height (192px image + 48px footer)
- **Hero images**: High-quality destination photos from Unsplash with proper aspect ratios
- **Gradient overlay**: Dark-to-transparent gradient for text readability
- **Typography hierarchy**: 
  - Trip title: 20px medium weight in white
  - Location: 14px regular weight with 90% opacity
  - Footer details: 14px muted foreground color
- **Status badges**: White semi-transparent background with colored text
- **Progress indicators**: For active trips, showing current day progress
- **Hover effects**: Subtle shadow increase on hover with smooth transition

### Interactive States
- **Hover**: Card elevation increases with `hover:shadow-lg`
- **Tap feedback**: Brief opacity change on touch
- **Selection**: Triggers `onSelectTrip(trip)` → Shows Dashboard for that trip

---

## State 2: Dashboard View (`DashboardView`)
**Condition**: When `selectedTrip !== null`
**Purpose**: Active trip overview with quick actions and today's agenda

### Visual Layout Structure

#### Header Section (Fixed, 100px height)
```tsx
<div className="p-4 border-b border-border/50 bg-white/95 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-3">
    <button onClick={onBack} className="p-2 hover:bg-accent rounded-full">
      <ArrowLeft className="w-5 h-5" />
    </button>
    <div className="flex-1 text-center">
      <h1 className="text-lg font-medium">{trip.title}</h1>
      <p className="text-sm text-muted-foreground">{trip.dateRange}</p>
    </div>
    <button onClick={onShowProfile} className="p-2 hover:bg-accent rounded-full">
      <User className="w-5 h-5" />
    </button>
  </div>
  
  {/* City Context Chips */}
  <div className="flex gap-2 overflow-x-auto pb-1">
    {trip.cities.map((city, index) => (
      <SegmentChip 
        key={city.id}
        city={city.name}
        isActive={city.id === trip.currentCityId}
        color={city.semanticColor}
        dayRange={`Day ${city.startDay}-${city.endDay}`}
      />
    ))}
  </div>
</div>
```

#### Context Chips Visual Details
```tsx
<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-blue-light)] text-[var(--color-blue-dark)] border border-[var(--color-blue-dark)]/20">
  <div className="w-2 h-2 rounded-full bg-[var(--color-blue-dark)]" />
  <span className="text-sm font-medium">Tokyo</span>
  <span className="text-xs opacity-75">Day 1-4</span>
</div>
```
- **Active city**: Full semantic color (light background, dark text, colored indicator dot)
- **Inactive cities**: Muted styling with `bg-secondary text-secondary-foreground`
- **Horizontal scroll**: Smooth scrolling with `overflow-x-auto`
- **Color coding**: Each city uses semantic colors (Blue for transport hubs, Green for nature destinations, etc.)

#### Main Content Area (Scrollable)

##### Weather Card (First element, 120px height)
```tsx
<Card className="mx-4 mt-4 overflow-hidden">
  <div className="flex items-center p-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <Sun className="w-5 h-5 text-yellow-500" />
        <span className="font-medium">Sunny, 24°C</span>
      </div>
      <p className="text-sm text-muted-foreground">Perfect weather for sightseeing</p>
      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
        <span>High: 28°C</span>
        <span>Low: 18°C</span>
        <span>Rain: 10%</span>
      </div>
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center">
      <Sun className="w-8 h-8 text-white" />
    </div>
  </div>
</Card>
```
- **Weather icon**: Large colored icon matching weather condition
- **Temperature display**: Primary temperature in medium weight
- **Weather description**: Contextual message for travel activities
- **Detailed stats**: High/low temperatures and precipitation chance
- **Visual element**: Gradient background circle for weather icon

##### Trip Challenges Card (180px height)
```tsx
<TripChallengesCard className="mx-4 mt-4">
  <div className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Trip Challenges</h3>
      <Badge variant="outline" className="text-xs">3 Active</Badge>
    </div>
    
    <div className="space-y-3">
      {challenges.map(challenge => (
        <div key={challenge.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-orange-light)] border border-[var(--color-orange-dark)]/20">
          <div className="w-8 h-8 rounded-full bg-[var(--color-orange-dark)] flex items-center justify-center">
            <Utensils className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-[var(--color-orange-dark)]">Culinary Explorer</h4>
            <p className="text-xs text-muted-foreground">Try 3 local specialties</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-[var(--color-orange-dark)] font-medium">2/3</div>
            <div className="w-12 h-1 bg-gray-200 rounded-full mt-1">
              <div className="w-8 h-1 bg-[var(--color-orange-dark)] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</TripChallengesCard>
```
- **Challenge rows**: Each challenge uses semantic color theming
- **Progress indicators**: Mini progress bars showing completion status
- **Icon system**: Meaningful icons for each challenge type (Utensils for culinary, Camera for photography, etc.)
- **Interactive states**: Tappable rows for detailed challenge view

##### Travel Toolkit Card (200px height)
```tsx
<TravelToolkit className="mx-4 mt-4">
  <div className="p-4">
    <h3 className="text-lg font-medium mb-4">Travel Toolkit</h3>
    
    <div className="grid grid-cols-4 gap-3">
      {quickTools.map(tool => (
        <button key={tool.id} className="flex flex-col items-center p-3 rounded-lg hover:bg-accent transition-colors">
          <div className="w-10 h-10 rounded-full bg-[var(--color-red-light)] flex items-center justify-center mb-2">
            <AlertTriangle className="w-5 h-5 text-[var(--color-red-dark)]" />
          </div>
          <span className="text-xs font-medium text-center">Emergency</span>
        </button>
      ))}
    </div>
  </div>
</TravelToolkit>
```
- **4-column grid**: Optimized for thumb navigation on mobile
- **Tool icons**: Circular backgrounds with semantic colors
- **Typography**: Tool names in 12px font for compact display
- **Touch targets**: Each tool button is minimum 44px for accessibility

##### Today's Activities Card (Variable height)
```tsx
<Card className="mx-4 mt-4 mb-6">
  <div className="p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium">Today's Plan</h3>
      <span className="text-sm text-muted-foreground">Day {trip.currentDay}</span>
    </div>
    
    <div className="space-y-3">
      {todayActivities.map(activity => (
        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
          <div className="w-3 h-3 rounded-full bg-[var(--color-purple-dark)]" />
          <div className="flex-1">
            <h4 className="text-sm font-medium">{activity.title}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
              <MapPin className="w-3 h-3" />
              <span>{activity.location}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      ))}
    </div>
    
    <Button variant="outline" className="w-full mt-4">
      <Calendar className="w-4 h-4 mr-2" />
      View Full Itinerary
    </Button>
  </div>
</Card>
```
- **Activity rows**: Clean list design with semantic color indicators
- **Time and location**: Secondary information in smaller, muted text
- **Navigation affordance**: Right chevron indicates tappable rows
- **CTA button**: Full-width button to access complete itinerary

### Dashboard Interactions
1. **Back button**: Returns to TripsList (`onBack()`)
2. **Profile button**: Opens full-screen profile overlay (`onShowProfile()`)
3. **City chips**: Navigate between city segments (updates current context)
4. **Challenge rows**: Open detailed challenge view with progress tracking
5. **Tool buttons**: Launch specific travel tools (emergency, translate, etc.)
6. **Activity rows**: Navigate to activity detail view
7. **View Itinerary**: Switches to itinerary tab with current trip context

---

# 📅 ITINERARY PAGE (`ItineraryView`)

**Purpose**: Detailed day-by-day trip planning with drag-and-drop activity management
**Layout**: Timeline-based interface with time slot organization

### Visual Structure

#### Header Section (Fixed, 120px height)
```tsx
<div className="p-4 border-b border-border/50 bg-white/95 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-3">
    <button onClick={onBack} className="p-2 hover:bg-accent rounded-full">
      <ArrowLeft className="w-5 h-5" />
    </button>
    <div className="flex-1 text-center">
      <h1 className="text-lg font-medium">{trip.title}</h1>
      <p className="text-sm text-muted-foreground">{selectedDate}</p>
    </div>
    <button onClick={onShowProfile} className="p-2 hover:bg-accent rounded-full">
      <User className="w-5 h-5" />
    </button>
  </div>
  
  {/* Day Navigation Chips */}
  <div className="flex gap-2 overflow-x-auto pb-1">
    {trip.days.map((day, index) => (
      <button
        key={day.id}
        onClick={() => setSelectedDay(day.id)}
        className={`flex flex-col items-center px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
          selectedDay === day.id
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <span className="text-xs font-medium">Day {index + 1}</span>
        <span className="text-xs opacity-75">{day.shortDate}</span>
      </button>
    ))}
  </div>
</div>
```

#### Day Navigation Visual Details
- **Selected day**: Primary color background with white text
- **Unselected days**: Secondary background with hover states
- **Day numbers**: Prominent display with medium font weight
- **Date format**: Short format like "Mar 15" for space efficiency
- **Horizontal scroll**: Smooth scrolling for multi-day trips

#### Timeline Content Area (Scrollable)

##### Time Slot Headers (60px height each)
```tsx
<div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <Sun className="w-5 h-5 text-yellow-500" />
      <h3 className="text-lg font-medium">Morning</h3>
      <span className="text-sm text-muted-foreground">9:00 - 12:00</span>
    </div>
    <Button variant="ghost" size="sm">
      <Plus className="w-4 h-4" />
    </Button>
  </div>
</div>
```
- **Time slot icons**: Sun (Morning), Sun high (Afternoon), Moon (Evening)
- **Sticky positioning**: Headers stick to top during scroll
- **Add button**: Ghost-style plus button for adding activities
- **Time ranges**: Clear time boundaries for each slot

##### Activity Cards (Draggable, Variable height)
```tsx
<DraggableActivityCard 
  activity={activity}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <Card className="mx-4 mb-3 border-l-4 border-l-[var(--color-purple-dark)] bg-[var(--color-purple-light)] cursor-grab active:cursor-grabbing">
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-medium text-[var(--color-purple-dark)]">{activity.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{activity.duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{activity.location}</span>
        </div>
        {activity.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{activity.rating}</span>
          </div>
        )}
      </div>
      
      {activity.notes && (
        <div className="mt-2 p-2 bg-white/50 rounded text-xs">
          <p>{activity.notes}</p>
        </div>
      )}
    </div>
  </Card>
</DraggableActivityCard>
```

##### Activity Card Visual Details
- **Semantic color coding**: Left border and background use activity type colors
  - 🍊 Orange: Restaurants, food activities
  - 🟣 Purple: Attractions, entertainment
  - 🟡 Yellow: Museums, cultural sites
  - 🟢 Green: Parks, nature activities
  - 🩷 Pink: Social events, nightlife
- **Drag affordances**: 
  - `cursor-grab` on hover
  - `cursor-grabbing` when dragging
  - Subtle shadow increase during drag
- **Activity metadata**: Duration, location, rating in small muted text
- **Notes section**: Optional expandable notes with semi-transparent background

##### Drop Zones (120px height when active)
```tsx
<TimeSlotDropZone 
  timeSlot="morning"
  isActive={draggedActivity !== null}
  onDrop={handleActivityDrop}
>
  <div className="mx-4 mb-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 flex items-center justify-center h-24 transition-all duration-200">
    <div className="text-center">
      <Plus className="w-6 h-6 text-primary mx-auto mb-1" />
      <p className="text-sm text-primary">Drop activity here</p>
    </div>
  </div>
</TimeSlotDropZone>
```
- **Visual feedback**: Dashed border with primary color
- **Drop affordance**: Clear "drop here" messaging with plus icon
- **Smooth transitions**: 200ms transition for visual feedback
- **Background tint**: Subtle primary color background when active

### Drag & Drop Interactions

#### Drag Behavior
1. **Long press start**: 300ms hold to initiate drag
2. **Visual feedback**: Card lifts with increased shadow and slight rotation
3. **Drop zones appear**: All valid drop targets highlight
4. **Ghost image**: Semi-transparent version follows finger/cursor

#### Drop Behavior
1. **Valid drop**: Card animates to new position with success feedback
2. **Invalid drop**: Card returns to origin with error shake animation
3. **Time slot change**: Activity updates with new time slot assignment
4. **Reorder within slot**: Activities can be reordered within same time period

### Timeline Navigation
- **Vertical scroll**: Main content scrolls through time slots
- **Day switching**: Horizontal day chips change entire timeline view
- **Smooth transitions**: 300ms easing between day changes

---

# 🗺️ MAP PAGE (`InteractiveMap`)

**Purpose**: Visual trip navigation, route planning, and location discovery
**Layout**: Full-screen map with overlay controls and information panels

### Visual Structure

#### Map Container (Full screen minus header)
```tsx
<div className="relative h-full w-full overflow-hidden">
  <div className="absolute inset-0 bg-gray-200"> {/* Map placeholder */}
    {/* Actual map would be rendered here */}
    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <Map className="w-12 h-12 mx-auto mb-2" />
        <p className="text-sm">Interactive Map</p>
        <p className="text-xs mt-1">Showing {selectedTrip?.currentCity || 'current location'}</p>
      </div>
    </div>
  </div>
</div>
```

#### Map Overlay Controls

##### Search Bar (Fixed top, 60px height)
```tsx
<div className="absolute top-4 left-4 right-4 z-10">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input 
      placeholder="Search locations, attractions..." 
      className="pl-10 pr-4 h-12 bg-white/95 backdrop-blur-sm border-border/50"
    />
  </div>
</div>
```
- **Semi-transparent background**: White with 95% opacity and backdrop blur
- **Full-width layout**: 16px margins on left and right
- **Search icon**: Left-aligned with proper vertical centering
- **Backdrop blur**: Creates elegant overlay effect

##### Layer Controls (Fixed top-right, 150px height)
```tsx
<div className="absolute top-20 right-4 z-10">
  <Card className="w-12 bg-white/95 backdrop-blur-sm">
    <div className="p-2 space-y-2">
      <button className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
        <MapPin className="w-4 h-4" />
      </button>
      <button className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
        <Layers className="w-4 h-4" />
      </button>
      <button className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
        <Route className="w-4 h-4" />
      </button>
    </div>
  </Card>
</div>
```
- **Compact vertical stack**: Minimal width with icon-only buttons
- **Active states**: Primary color for selected layer/view
- **Button sizing**: 32px circular buttons with 16px icons

##### Zoom Controls (Fixed bottom-right, 100px height)
```tsx
<div className="absolute bottom-24 right-4 z-10">
  <Card className="w-12 bg-white/95 backdrop-blur-sm">
    <div className="p-2 space-y-1">
      <button className="w-8 h-8 rounded-full bg-secondary hover:bg-accent flex items-center justify-center">
        <Plus className="w-4 h-4" />
      </button>
      <div className="h-px bg-border mx-2" />
      <button className="w-8 h-8 rounded-full bg-secondary hover:bg-accent flex items-center justify-center">
        <Minus className="w-4 h-4" />
      </button>
    </div>
  </Card>
</div>
```
- **Plus/minus layout**: Standard zoom control design
- **Separator line**: Thin border between zoom in/out
- **Hover states**: Secondary to accent color transition

##### Route Planning Button (Fixed bottom-center, 56px height)
```tsx
<div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
  <Button 
    onClick={() => onShowRoute()}
    className="h-12 px-6 bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
  >
    <Route className="w-4 h-4 mr-2" />
    Plan Route
  </Button>
</div>
```
- **Centered positioning**: Horizontal center with transform
- **Prominent styling**: Primary color with enhanced shadow
- **Action-oriented**: Clear call-to-action for route planning

#### Map Pins and Markers

##### Activity Pins (Semantic colored, 32px size)
```tsx
<div className="absolute" style={{ top: pin.y, left: pin.x }}>
  <div className="relative">
    <div className="w-8 h-8 rounded-full bg-[var(--color-orange-light)] border-2 border-[var(--color-orange-dark)] flex items-center justify-center shadow-md">
      <Utensils className="w-4 h-4 text-[var(--color-orange-dark)]" />
    </div>
    {pin.isSelected && (
      <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full border-2 border-primary animate-pulse" />
    )}
  </div>
</div>
```
- **Color coding by activity type**:
  - 🍊 Orange: Restaurants (Utensils icon)
  - 🟣 Purple: Attractions (Camera icon)
  - 🟡 Yellow: Museums (GraduationCap icon) 
  - 🟢 Green: Parks (TreePine icon)
  - 🩷 Pink: Nightlife (Users2 icon)
  - 🔴 Red: Emergency (AlertTriangle icon)
- **Selection indicator**: Pulsing ring around selected pins
- **Shadow effects**: Subtle drop shadow for depth and clarity

##### Current Location Pin (Special styling, 40px size)
```tsx
<div className="absolute" style={{ top: currentLocation.y, left: currentLocation.x }}>
  <div className="relative">
    <div className="w-10 h-10 rounded-full bg-blue-500 border-4 border-white shadow-lg flex items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-white" />
    </div>
    <div className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75" />
  </div>
</div>
```
- **Blue dot design**: Standard location indicator
- **Pulsing animation**: Continuous ping effect for current location
- **White border**: Clear contrast against map backgrounds

#### Information Panels

##### Pin Detail Popup (280px width, variable height)
```tsx
<div className="absolute bottom-32 left-4 right-4 z-20">
  <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
    <div className="p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
          <ImageWithFallback 
            src={selectedPin.image} 
            alt={selectedPin.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{selectedPin.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{selectedPin.rating}</span>
            </div>
            <span>•</span>
            <span>{selectedPin.category}</span>
          </div>
        </div>
        <button className="p-1 hover:bg-accent rounded-full">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{selectedPin.description}</p>
      
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
        <Button size="sm" className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Add to Trip
        </Button>
      </div>
    </div>
  </Card>
</div>
```
- **Slide-up animation**: Smooth entrance from bottom
- **Semi-transparent background**: Maintains map visibility
- **Dual actions**: Directions and add to trip as primary actions
- **Rich content**: Image, rating, description, and category info

### Map Interactions

#### Touch Gestures
1. **Pan**: Single finger drag to move map view
2. **Zoom**: Pinch-to-zoom gesture for scale adjustment  
3. **Tap pin**: Opens detail popup for selected location
4. **Long press**: Creates new custom location pin
5. **Double tap**: Quick zoom in centered on tap point

#### Button Actions
1. **Search**: Opens location search with autocomplete
2. **Layer toggle**: Switches between map views (satellite, transit, etc.)
3. **Route planning**: Opens `RouteTimelineModal`
4. **Zoom controls**: Programmatic zoom in/out
5. **Current location**: Centers map on user's current position

---

# 🧭 EXPLORE PAGE (`ExploreView`)

**Purpose**: Discover new places, activities, and experiences for current trip
**Layout**: Search-driven content discovery with categorical filtering

### Visual Structure

#### Header Section (Fixed, 140px height)
```tsx
<div className="border-b border-border/50 p-4 space-y-4">
  <div className="flex items-center justify-between">
    <h1 className="text-lg font-medium">Explore {currentCity}</h1>
    <Button variant="ghost" size="sm">
      <Filter className="w-4 h-4" />
    </Button>
  </div>
  
  {/* Search Bar */}
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <Input
      placeholder="Search places, events, guides in Paris..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="pl-10"
    />
  </div>
  
  {/* Category Filter Circles */}
  <div className="flex gap-3 overflow-x-auto pb-1">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => setSelectedCategory(category.id)}
        className={`flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
          isSelected
            ? `${colors.light} ${colors.dark} ${colors.border} border`
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        <IconComponent className="w-5 h-5" />
      </button>
    ))}
  </div>
</div>
```

#### Category Filter Circles Visual Details
- **Circle dimensions**: 44px diameter (w-11 h-11) for optimal touch targets
- **Icon sizing**: 20px icons (w-5 h-5) for clear visibility
- **Semantic color states**:
  - **Selected**: Full semantic color background with dark icon and border
  - **Unselected**: Secondary gray background with hover states
- **Category mapping**:
  ```tsx
  const categories = [
    { id: 'all', icon: Sparkles, colorTheme: HOPLA_COLORS.NEUTRAL },        // ⚪ Gray
    { id: 'food', icon: Utensils, colorTheme: HOPLA_COLORS.FOOD },          // 🍊 Orange  
    { id: 'attractions', icon: Camera, colorTheme: HOPLA_COLORS.ACTIVITY }, // 🟣 Purple
    { id: 'culture', icon: GraduationCap, colorTheme: HOPLA_COLORS.CULTURE }, // 🟡 Yellow
    { id: 'nature', icon: TreePine, colorTheme: HOPLA_COLORS.NATURE },      // 🟢 Green
    { id: 'nightlife', icon: Users2, colorTheme: HOPLA_COLORS.SOCIAL },     // 🩷 Pink
    { id: 'shopping', icon: ShoppingBag, colorTheme: HOPLA_COLORS.ACTIVITY } // 🟣 Purple
  ];
  ```

#### Content Cards Grid (Scrollable, infinite height)

##### Recommendation Cards (380px width × 320px height)
```tsx
<div className="p-4 space-y-4">
  {filteredRecommendations.map((item) => (
    <Card 
      key={item.id} 
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setSelectedItem(item)}
    >
      {/* Hero Image Section */}
      <div className="relative">
        <ImageWithFallback
          src={item.image}
          alt={item.title}
          className="w-full h-40 object-cover"
        />
        
        {/* Content Type Badge */}
        <div className="absolute top-2 left-2">
          <Badge 
            variant="secondary" 
            className={`text-xs ${colors.light} ${colors.dark} ${colors.border} border`}
          >
            {item.type} {/* "Community Guide", "Event", "POI" */}
          </Badge>
        </div>
        
        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(item.id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${
              likedItems.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white'
            }`}
          />
        </button>
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium leading-tight">{item.title}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          {item.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          {item.distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.distance}
            </div>
          )}
          {item.time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.time}
            </div>
          )}
          {item.reviews && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {item.reviews} reviews
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {item.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className={`text-xs ${colors.border}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
        
        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {item.author && `by ${item.author}`}
            {item.organizer && `by ${item.organizer}`}
            {item.likes && ` • ${item.likes} likes`}
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addToTrip(item);
            }}
            className={`h-8 px-3 text-xs ${colors.light} ${colors.dark} border ${colors.border} hover:opacity-90`}
            variant="outline"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add to Trip
          </Button>
        </div>
      </div>
    </Card>
  ))}
</div>
```

#### Card Visual Details

##### Image Section (160px height)
- **Hero image**: High-quality photos from Unsplash with proper aspect ratios
- **Type badge**: Positioned top-left with semantic color coding
  - "Community Guide": User-generated content
  - "Event": Time-sensitive activities  
  - "POI": Points of interest/attractions
- **Like button**: Semi-transparent background with heart icon
  - **Inactive**: White outline heart
  - **Active**: Filled red heart with red color

##### Content Section (160px height)
- **Title hierarchy**: Medium weight font in primary color
- **Rating display**: Small star icon with numerical rating
- **Description**: 2-3 lines of preview text in muted color
- **Meta row**: Distance, time, and review count with relevant icons
- **Tag pills**: Maximum 3 tags with outline style and semantic border colors
- **Bottom actions**: Author attribution and "Add to Trip" button

##### Add to Trip Button Styling
- **Semantic coloring**: Button uses semantic color of content category
- **Size**: Small (32px height) with compact padding
- **Icon**: Plus icon with 1px right margin
- **Hover state**: Subtle opacity reduction (90%)

### Content Types & Categories

#### Community Guides
- **Visual**: User avatar in badge area
- **Content**: Personal recommendations and hidden gems
- **Author**: "by [Username]" attribution
- **Engagement**: Like count and community metrics

#### Events
- **Visual**: Time-sensitive badge with clock icon
- **Content**: Scheduled activities and experiences  
- **Timing**: "Today 2:00 PM" or "Tonight 9:00 PM"
- **Organizer**: Event host or venue attribution

#### Points of Interest (POIs)
- **Visual**: Location-based badge with map pin
- **Content**: Attractions, landmarks, and destinations
- **Distance**: "2.1 km" or "25 min metro" information
- **Reviews**: Community rating and review count

### Interaction Flow

#### Browse Flow
1. **Category selection**: Tap circular filter → Updates content grid
2. **Search**: Type query → Real-time filtering of results
3. **Scroll**: Infinite scroll loading of recommendations
4. **Like**: Heart button → Adds to personal favorites

#### Discovery Flow  
1. **Card tap**: Opens `DetailedExploreView` with full information
2. **Add to Trip**: Opens `AddToTripModal` with trip/day selection
3. **Share**: Access sharing options for recommendations
4. **Save**: Add to personal collections or wishlist

---

# 📁 DOCUMENT VAULT PAGE (`DocumentVault`)

**Purpose**: Travel document storage, organization, and quick access
**Layout**: Categorized document management with secure storage

### Visual Structure

#### Header Section (Fixed, 80px height)
```tsx
<div className="p-4 border-b border-border/50">
  <div className="flex items-center justify-between">
    <h1 className="text-lg font-medium">Document Vault</h1>
    <Button variant="ghost" size="sm">
      <Plus className="w-4 h-4" />
    </Button>
  </div>
</div>
```

#### Document Categories (Scrollable grid)

##### Travel Documents Section
```tsx
<div className="p-4">
  <h2 className="text-lg font-medium mb-4">Travel Documents</h2>
  <div className="grid grid-cols-2 gap-3">
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[var(--color-blue-light)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-[var(--color-blue-dark)]" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">Passport</h3>
          <p className="text-xs text-muted-foreground">2 documents</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-[var(--color-blue-light)] rounded-full">
          <div className="h-2 bg-[var(--color-blue-dark)] rounded-full w-full" />
        </div>
        <p className="text-xs text-muted-foreground">All documents stored</p>
      </div>
    </Card>
  </div>
</div>
```

---

# 🎯 MODAL SYSTEM & OVERLAYS

## Add to Trip Modal (`AddToTripModal`)

**Trigger**: "Add to Trip" button from Explore page
**Layout**: Bottom sheet modal with 80vh height and slide-in animation

### Visual Structure

#### Modal Container
```tsx
<div className="fixed inset-0 z-50 bg-black/50 flex items-end">
  <div className="w-full max-w-md mx-auto bg-background rounded-t-xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
```
- **Backdrop**: 50% black overlay covering full screen
- **Modal position**: Bottom-aligned with rounded top corners
- **Animation**: Smooth slide-in from bottom with 300ms duration
- **Height**: 80% of viewport height with overflow protection

#### Header (Compact, 60px height)
```tsx
<div className="p-3 border-b border-border flex-shrink-0">
  <div className="flex items-center justify-between">
    <button
      onClick={() => setShowTripSelector(true)}
      className="flex items-center gap-2 hover:bg-accent rounded-lg p-1 -ml-1 transition-colors"
    >
      <h2 className="text-lg font-medium">Add to {currentTrip?.title || 'Trip'}</h2>
      <ChevronDown className="w-4 h-4 text-muted-foreground" />
    </button>
    <button 
      onClick={onClose}
      className="p-1 hover:bg-accent rounded-full"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
</div>
```
- **Contextual title**: "Add to Tokyo Spring Trip" with trip name
- **Trip selector**: Title is clickable with chevron indicator
- **Close button**: X icon in top-right corner
- **Compact padding**: Reduced from 16px to 12px for space efficiency

#### Scrollable Content Area

##### Item Preview Card (80px height)
```tsx
<div className="p-4">
  <Card className="p-3">
    <div className="flex gap-3">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <Badge className={`${colors.light} ${colors.dark} border ${colors.border} text-xs px-1.5 py-0.5`}>
            {item.type}
          </Badge>
        </div>
        <h3 className="font-medium line-clamp-1 text-sm">{item.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>{item.rating}</span>
          </div>
          {item.distance && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.distance}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </Card>
</div>
```
- **Compact layout**: 48px image with condensed text layout
- **Semantic badge**: Uses activity type color coding
- **Essential info**: Title, rating, distance only
- **Text truncation**: `line-clamp-1` prevents overflow

##### Day Selection Grid (160px height)
```tsx
<div className="px-4 mb-4">
  <h3 className="font-medium mb-3 text-sm">Choose Day</h3>
  <div className="grid grid-cols-4 gap-2">
    {availableDays.map((day) => (
      <button
        key={day.id}
        onClick={() => setSelectedDay(day.id)}
        disabled={day.isPast}
        className={`p-2.5 rounded-lg border text-left transition-colors ${
          selectedDay === day.id
            ? `${colors.light} ${colors.dark} border-2 ${colors.border.replace('/20', '')}`
            : day.isPast
            ? 'bg-muted/50 text-muted-foreground border-muted cursor-not-allowed'
            : 'border-border hover:bg-accent'
        }`}
      >
        <div className="flex flex-col">
          <span className="font-medium text-xs">{day.label}</span>
          {day.isRecommended && !day.isPast && (
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200 mt-1 px-1 py-0 self-start">
              {day.isToday ? 'Today' : 'Rec.'}
            </Badge>
          </Badge>
          )}
          <p className="text-xs text-muted-foreground mt-1">{day.date.split(',')[0]}</p>
        </div>
      </button>
    ))}
  </div>
</div>
```
- **4-column grid**: Fits 4-7 days comfortably in viewport
- **Day states**:
  - **Selected**: Semantic color background with bold border
  - **Recommended**: Green "Today" or "Rec." badge
  - **Past**: Disabled with muted styling
  - **Available**: Neutral with hover states
- **Compact info**: Day number, recommendation, and short date

##### Time Slot Selection (200px height)
```tsx
<div className="px-4 mb-6">
  <h3 className="font-medium mb-3 text-sm">Preferred Time</h3>
  <div className="space-y-2">
    {timeSlots.map((slot) => (
      <button
        key={slot.id}
        onClick={() => setSelectedTimeSlot(slot.id)}
        className={`w-full p-3 rounded-lg border text-left transition-colors ${
          selectedTimeSlot === slot.id
            ? 'border-primary bg-primary/5'
            : 'border-border hover:bg-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium text-sm">{slot.label}</p>
            <p className="text-xs text-muted-foreground">{slot.description}</p>
          </div>
          {selectedTimeSlot === slot.id && (
            <Check className="w-4 h-4 text-primary" />
          )}
        </div>
      </button>
    ))}
  </div>
</div>
```
- **Time options**:
  - **Flexible timing**: "No specific time"
  - **Morning**: "9:00 - 12:00"  
  - **Afternoon**: "13:00 - 17:00"
  - **Evening**: "18:00 - 22:00"
- **Selection feedback**: Primary color border and background tint
- **Check icon**: Confirms selected time slot
- **48px height**: Comfortable touch targets for time selection

#### Bottom Actions (Fixed, 80px height)
```tsx
<div className="p-4 border-t border-border bg-background flex-shrink-0">
  <div className="flex gap-3">
    <Button 
      variant="outline" 
      onClick={onClose}
      className="flex-1"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleAddToTrip}
      disabled={!selectedDay}
      className="flex-1"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add to Trip
    </Button>
  </div>
</div>
```
- **Two-button layout**: Equal-width cancel and confirm buttons
- **Disabled state**: Add button disabled until day is selected
- **Visual hierarchy**: Primary button for main action

### Trip Selector State (Hidden by default)

#### Alternate Header
```tsx
<div className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
  <div className="flex items-center gap-3">
    <button 
      onClick={() => setShowTripSelector(false)}
      className="p-1 hover:bg-accent rounded-full"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
    <h2 className="text-lg font-medium">Select Trip</h2>
  </div>
  <button 
    onClick={onClose}
    className="p-1 hover:bg-accent rounded-full"
  >
    <X className="w-5 h-5" />
  </button>
</div>
```

#### Trip Selection List
```tsx
<div className="overflow-y-auto flex-1 min-h-0 p-3">
  <div className="space-y-3">
    {availableTrips.map((trip) => (
      <button
        key={trip.id}
        onClick={() => handleTripSelect(trip)}
        className={`w-full p-4 rounded-lg border text-left transition-colors ${
          currentTrip?.id === trip.id
            ? 'border-primary bg-primary/5'
            : 'border-border hover:bg-accent'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{trip.title}</h3>
          {currentTrip?.id === trip.id && (
            <Check className="w-4 h-4 text-primary" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1">{trip.dates}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Day {trip.currentDay} of {trip.totalDays}
          </Badge>
          <span className="text-xs text-muted-foreground">• {trip.currentCity}</span>
        </div>
      </button>
    ))}
  </div>
</div>
```
- **Trip cards**: Full-width selection buttons with trip details
- **Current selection**: Primary border and background with check icon
- **Trip context**: Dates, current day, and city information
- **Back navigation**: Arrow left returns to main modal state

### Success State

#### Confirmation Screen
```tsx
<div className="p-6 text-center">
  <div className={`w-16 h-16 rounded-full ${colors.light} flex items-center justify-center mx-auto mb-4`}>
    <Check className={`w-8 h-8 ${colors.icon}`} />
  </div>
  
  <h2 className="text-xl font-medium mb-2">Added to Trip!</h2>
  <p className="text-muted-foreground mb-6">
    {item.title} has been added to {selectedDay} of your {currentTrip?.title}
  </p>

  <div className="space-y-3">
    <Button 
      onClick={handleViewItinerary}
      className="w-full"
    >
      <Calendar className="w-4 h-4 mr-2" />
      View Itinerary
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
    
    <Button 
      variant="outline" 
      onClick={handleStayExploring}
      className="w-full"
    >
      Keep Exploring
    </Button>
  </div>
</div>
```
- **Success icon**: Large checkmark with semantic color background
- **Confirmation message**: Clear feedback about what was added where
- **Next actions**: View itinerary or continue exploring
- **Visual hierarchy**: Primary action (View Itinerary) emphasized

---

# 👤 PROFILE OVERLAY (`Profile`)

**Trigger**: Profile button in Dashboard or Itinerary headers
**Layout**: Full-screen overlay with z-40 positioning

### Visual Structure
```tsx
<div className="absolute inset-0 bg-background z-40">
  <Profile onBack={() => setShowProfile(false)} />
</div>
```
- **Full coverage**: Covers entire app interface
- **High z-index**: Ensures overlay appears above all content
- **Clean background**: Uses main app background color
- **Back navigation**: Returns to previous page state

---

# 🛣️ ROUTE TIMELINE MODAL (`RouteTimelineModal`)

**Trigger**: "Plan Route" button from Map page
**Layout**: Full-screen modal for route planning and timeline management

### Visual Structure
```tsx
<div className="absolute inset-0 z-40">
  <RouteTimelineModal onClose={() => setShowRouteModal(false)} />
</div>
```
- **Full-screen coverage**: Complete interface takeover for complex task
- **Route visualization**: Timeline-based route planning interface
- **Transportation options**: Multiple route options with time estimates
- **Close action**: Returns to map view with optional route saving

---

# 📱 RESPONSIVE BEHAVIOR & MOBILE OPTIMIZATION

## Touch Targets & Accessibility
- **Minimum size**: 44px × 44px for all interactive elements
- **Thumb zones**: Primary actions positioned for comfortable thumb reach
- **Visual feedback**: Clear hover and active states for all buttons
- **High contrast**: Text meets WCAG readability standards

## Typography Scale
- **Base size**: 16px optimized for mobile readability
- **Hierarchy**: text-xs (12px) to text-2xl (24px) with proper line heights
- **System fonts**: Fast-loading, familiar fonts across platforms

## Animation & Performance
- **Smooth transitions**: 300ms easing for state changes
- **Modal animations**: Slide-in effects with backdrop blur
- **Scroll optimization**: Proper overflow handling prevents layout issues
- **Loading states**: Skeleton screens and progress indicators

## Layout Patterns
- **Card-based design**: Easy content scanning and interaction
- **Bottom navigation**: Thumb-friendly 5-tab layout
- **Semantic colors**: Consistent 9-color system reduces cognitive load
- **Context preservation**: State maintained during navigation

This comprehensive visual documentation covers every aspect of the Hopla travel app interface, from pixel-perfect layout details to complex interaction flows, ensuring consistent implementation of the mobile-first travel companion experience.