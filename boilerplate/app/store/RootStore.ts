import { MMKV } from "react-native-mmkv"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useShallow } from "zustand/react/shallow"

import {
  AuthenticationStore,
  authenticationStoreSelector,
  createAuthenticationSlice,
} from "./AuthenticationStore"
import { DocumentStore, documentStoreSelector, createDocumentSlice } from "./DocumentStore"
import { ItineraryStore, itineraryStoreSelector, createItinerarySlice } from "./ItineraryStore"
import { TripStore, tripStoreSelector, createTripSlice } from "./TripStore"

// Create MMKV instance for storage
const mmkvStorage = new MMKV()

// Create a proper storage adapter for Zustand
const createMMKVStorage = () => ({
  getItem: (name: string) => {
    const value = mmkvStorage.getString(name)
    return Promise.resolve(value || null)
  },
  setItem: (name: string, value: string) => {
    mmkvStorage.set(name, value)
    return Promise.resolve()
  },
  removeItem: (name: string) => {
    mmkvStorage.delete(name)
    return Promise.resolve()
  },
})

// Combine all store interfaces
export interface RootStore extends AuthenticationStore, TripStore, ItineraryStore, DocumentStore {
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

// Create the main store with all slices
export const useStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createTripSlice(...a),
      ...createItinerarySlice(...a),
      ...createDocumentSlice(...a),

      // Persistence state
      _hasHydrated: false,
      setHasHydrated: (state) => {
        const set = a[0]
        set({
          _hasHydrated: state,
        })
      },
    }),
    {
      name: "hopla-app-store",
      storage: createJSONStorage(() => createMMKVStorage()),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      // Only persist certain parts of the store
      partialize: (state) => ({
        user: state.user,
        userPreferences: state.user?.preferences,
        trips: state.trips,
        selectedTrip: state.selectedTrip,
        items: state.items,
        documents: state.documents,
        _hasHydrated: state._hasHydrated,
      }),
    },
  ),
)

// Custom hooks for each store slice (using shallow comparison for performance)
export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector))
export const useTripStore = () => useStore(useShallow(tripStoreSelector))
export const useItineraryStore = () => useStore(useShallow(itineraryStoreSelector))
export const useDocumentStore = () => useStore(useShallow(documentStoreSelector))

// Additional convenience hooks for common patterns
export const useCurrentTrip = () => useStore((state) => state.selectedTrip)
export const useCurrentCity = () => useStore((state) => state.getCurrentCity())
export const useTripChallenges = () =>
  useStore((state) => state.getChallengesForTrip(state.selectedTrip?.id || ""))
export const useTodayItems = () => useStore((state) => state.getItemsForDay(state.selectedDate))
export const useWeatherData = () => useStore((state) => state.weatherData)

// Hook for checking if store has hydrated (useful for loading states)
export const useStoreHydrated = () => useStore((state) => state._hasHydrated)
