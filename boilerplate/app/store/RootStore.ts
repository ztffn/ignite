import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { persist, createJSONStorage } from "zustand/middleware";

import { AuthenticationStore, authenticationStoreSelector, createAuthenticationSlice } from "./AuthenticationStore";
import { TripStore, tripStoreSelector, createTripSlice } from "./TripStore";
import { ItineraryStore, itineraryStoreSelector, createItinerarySlice } from "./ItineraryStore";
import { DocumentStore, documentStoreSelector, createDocumentSlice } from "./DocumentStore";

// Combine all store interfaces
export interface RootStore extends AuthenticationStore, TripStore, ItineraryStore, DocumentStore {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
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
        const set = a[0];
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "hopla-app-store",
      storage: createJSONStorage(() => {
        // Use MMKV for native, localStorage for web
        if (typeof window !== 'undefined' && window.localStorage) {
          return {
            getItem: (name: string) => {
              const value = window.localStorage.getItem(name);
              return value ? Promise.resolve(value) : Promise.resolve(null);
            },
            setItem: (name: string, value: string) => {
              window.localStorage.setItem(name, value);
              return Promise.resolve();
            },
            removeItem: (name: string) => {
              window.localStorage.removeItem(name);
              return Promise.resolve();
            },
          };
        }
        // Fallback to AsyncStorage for React Native
        return require('react-native-mmkv').MMKV;
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
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
    }
  )
);

// Custom hooks for each store slice (using shallow comparison for performance)
export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector));
export const useTripStore = () => useStore(useShallow(tripStoreSelector));
export const useItineraryStore = () => useStore(useShallow(itineraryStoreSelector));
export const useDocumentStore = () => useStore(useShallow(documentStoreSelector));

// Additional convenience hooks for common patterns
export const useCurrentTrip = () => useStore((state) => state.selectedTrip);
export const useCurrentCity = () => useStore((state) => state.getCurrentCity());
export const useTripChallenges = () => useStore((state) => state.getChallengesForTrip(state.selectedTrip?.id || ''));
export const useTodayItems = () => useStore((state) => state.getItemsForDay(state.selectedDate));
export const useWeatherData = () => useStore((state) => state.weatherData);

// Hook for checking if store has hydrated (useful for loading states)
export const useStoreHydrated = () => useStore((state) => state._hasHydrated);
