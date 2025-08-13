import { StateCreator } from "zustand"

import { RootStore, ItineraryItem } from "./types"

// TypeScript interface for this store slice
export interface ItineraryStore {
  items: ItineraryItem[]
  selectedDate: number
  isLoading: boolean
  error: string | null
  draggedItem: ItineraryItem | null

  // Actions
  setItems: (items: ItineraryItem[]) => void
  addItem: (item: ItineraryItem) => void
  updateItem: (itemId: string, updates: Partial<ItineraryItem>) => void
  deleteItem: (itemId: string) => void
  setSelectedDate: (day: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Drag & Drop actions
  setDraggedItem: (item: ItineraryItem | null) => void
  moveItem: (itemId: string, newDay: number, newTimeSlot: string, newPosition: number) => void
  reorderItems: (day: number, timeSlot: string, itemIds: string[]) => void

  // Computed values
  getItemsForDay: (day: number) => ItineraryItem[]
  getItemsForTimeSlot: (day: number, timeSlot: string) => ItineraryItem[]
  getItemById: (itemId: string) => ItineraryItem | undefined
  getItemsForTrip: (tripId: string) => ItineraryItem[]
  getNextAvailablePosition: (day: number, timeSlot: string) => number
}

// Selectors for derived values
export const itineraryItemsSelector = (state: RootStore) => state.items
export const selectedDateSelector = (state: RootStore) => state.selectedDate
export const draggedItemSelector = (state: RootStore) => state.draggedItem

// create our store slice with default data and actions
export const createItinerarySlice: StateCreator<RootStore, [], [], ItineraryStore> = (
  set,
  get,
) => ({
  items: [],
  selectedDate: 1,
  isLoading: false,
  error: null,
  draggedItem: null,

  setItems: (items) => set({ items, error: null }),

  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
      error: null,
    })),

  updateItem: (itemId, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
      ),
      error: null,
    })),

  deleteItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
      error: null,
    })),

  setSelectedDate: (day) => set({ selectedDate: day, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setDraggedItem: (item) => set({ draggedItem: item }),

  moveItem: (itemId, newDay, newTimeSlot, newPosition) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              day: newDay,
              timeSlot: newTimeSlot,
              position: newPosition,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
      error: null,
    })),

  reorderItems: (day, timeSlot, itemIds) =>
    set((state) => {
      const updatedItems = [...state.items]

      itemIds.forEach((itemId, index) => {
        const itemIndex = updatedItems.findIndex((item) => item.id === itemId)
        if (itemIndex !== -1) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            position: index,
            updatedAt: new Date().toISOString(),
          }
        }
      })

      return { items: updatedItems, error: null }
    }),

  // Computed values
  getItemsForDay: (day) =>
    get()
      .items.filter((item) => item.day === day)
      .sort((a, b) => {
        // Sort by time slot first, then by position
        const timeSlotOrder = { morning: 0, afternoon: 1, evening: 2, flexible: 3 }
        const slotA = timeSlotOrder[a.timeSlot as keyof typeof timeSlotOrder] || 0
        const slotB = timeSlotOrder[b.timeSlot as keyof typeof timeSlotOrder] || 0

        if (slotA !== slotB) return slotA - slotB
        return a.position - b.position
      }),

  getItemsForTimeSlot: (day, timeSlot) =>
    get()
      .items.filter((item) => item.day === day && item.timeSlot === timeSlot)
      .sort((a, b) => a.position - b.position),

  getItemById: (itemId) => get().items.find((item) => item.id === itemId),

  getItemsForTrip: (tripId) =>
    get()
      .items.filter((item) => item.tripId === tripId)
      .sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day

        const timeSlotOrder = { morning: 0, afternoon: 1, evening: 2, flexible: 3 }
        const slotA = timeSlotOrder[a.timeSlot as keyof typeof timeSlotOrder] || 0
        const slotB = timeSlotOrder[b.timeSlot as keyof typeof timeSlotOrder] || 0

        if (slotA !== slotB) return slotA - slotB
        return a.position - b.position
      }),

  getNextAvailablePosition: (day, timeSlot) => {
    const items = get().getItemsForTimeSlot(day, timeSlot)
    if (items.length === 0) return 0
    return Math.max(...items.map((item: ItineraryItem) => item.position)) + 1
  },
})

// a selector can be used to grab the full ItineraryStore
export const itineraryStoreSelector = (state: RootStore) => ({
  items: state.items,
  selectedDate: state.selectedDate,
  isLoading: state.isLoading,
  error: state.error,
  draggedItem: state.draggedItem,
  setItems: state.setItems,
  addItem: state.addItem,
  updateItem: state.updateItem,
  deleteItem: state.deleteItem,
  setSelectedDate: state.setSelectedDate,
  setLoading: state.setLoading,
  setError: state.setError,
  setDraggedItem: state.setDraggedItem,
  moveItem: state.moveItem,
  reorderItems: state.reorderItems,
  getItemsForDay: state.getItemsForDay,
  getItemsForTimeSlot: state.getItemsForTimeSlot,
  getItemById: state.getItemById,
  getItemsForTrip: state.getItemsForTrip,
  getNextAvailablePosition: state.getNextAvailablePosition,
})
