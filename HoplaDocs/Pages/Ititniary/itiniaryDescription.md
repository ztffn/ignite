
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