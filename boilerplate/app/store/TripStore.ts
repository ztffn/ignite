import { StateCreator } from "zustand"

import { RootStore, Trip, City, TripChallenge, WeatherInfo } from "./types"

// TypeScript interface for this store slice
export interface TripStore {
  trips: Trip[]
  selectedTrip: Trip | null
  isLoading: boolean
  error: string | null
  weatherData: Record<string, WeatherInfo>
  challenges: TripChallenge[]

  // Actions
  setTrips: (trips: Trip[]) => void
  addTrip: (trip: Trip) => void
  updateTrip: (tripId: string, updates: Partial<Trip>) => void
  deleteTrip: (tripId: string) => void
  selectTrip: (trip: Trip | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Trip-specific actions
  addCity: (tripId: string, city: City) => void
  updateCity: (tripId: string, cityId: string, updates: Partial<City>) => void
  removeCity: (tripId: string, cityId: string) => void
  setCurrentCity: (tripId: string, cityId: string) => void

  // Challenge actions
  addChallenge: (challenge: TripChallenge) => void
  updateChallenge: (challengeId: string, updates: Partial<TripChallenge>) => void
  completeChallenge: (challengeId: string) => void

  // Weather actions
  updateWeather: (cityId: string, weather: WeatherInfo) => void

  // Computed values
  getCurrentTrip: () => Trip | null
  getCurrentCity: () => City | null
  getTripById: (tripId: string) => Trip | undefined
  getCitiesForTrip: (tripId: string) => City[]
  getChallengesForTrip: (tripId: string) => TripChallenge[]
}

// Selectors for derived values
export const tripsSelector = (state: RootStore) => state.trips
export const selectedTripSelector = (state: RootStore) => state.selectedTrip
export const currentTripSelector = (state: RootStore) => state.getCurrentTrip()
export const currentCitySelector = (state: RootStore) => state.getCurrentCity()
export const challengesSelector = (state: RootStore) => state.challenges

// create our store slice with default data and actions
export const createTripSlice: StateCreator<RootStore, [], [], TripStore> = (set, get) => ({
  trips: [],
  selectedTrip: null,
  isLoading: false,
  error: null,
  weatherData: {},
  challenges: [],

  setTrips: (trips) => set({ trips, error: null }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
      error: null,
    })),

  updateTrip: (tripId, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip,
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? { ...state.selectedTrip, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedTrip,
      error: null,
    })),

  deleteTrip: (tripId) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== tripId),
      selectedTrip: state.selectedTrip?.id === tripId ? null : state.selectedTrip,
      challenges: state.challenges.filter((challenge) => challenge.tripId !== tripId),
      error: null,
    })),

  selectTrip: (trip) => set({ selectedTrip: trip, error: null }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  addCity: (tripId, city) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? { ...trip, cities: [...trip.cities, city], updatedAt: new Date().toISOString() }
          : trip,
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? {
              ...state.selectedTrip,
              cities: [...state.selectedTrip.cities, city],
              updatedAt: new Date().toISOString(),
            }
          : state.selectedTrip,
      error: null,
    })),

  updateCity: (tripId, cityId, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              cities: trip.cities.map((city) =>
                city.id === cityId ? { ...city, ...updates } : city,
              ),
              updatedAt: new Date().toISOString(),
            }
          : trip,
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? {
              ...state.selectedTrip,
              cities: state.selectedTrip.cities.map((city) =>
                city.id === cityId ? { ...city, ...updates } : city,
              ),
              updatedAt: new Date().toISOString(),
            }
          : state.selectedTrip,
      error: null,
    })),

  removeCity: (tripId, cityId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              cities: trip.cities.filter((city) => city.id !== cityId),
              updatedAt: new Date().toISOString(),
            }
          : trip,
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? {
              ...state.selectedTrip,
              cities: state.selectedTrip.cities.filter((city) => city.id !== cityId),
              updatedAt: new Date().toISOString(),
            }
          : state.selectedTrip,
      error: null,
    })),

  setCurrentCity: (tripId, cityId) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? { ...trip, currentCityId: cityId, updatedAt: new Date().toISOString() }
          : trip,
      ),
      selectedTrip:
        state.selectedTrip?.id === tripId
          ? { ...state.selectedTrip, currentCityId: cityId, updatedAt: new Date().toISOString() }
          : state.selectedTrip,
      error: null,
    })),

  addChallenge: (challenge) =>
    set((state) => ({
      challenges: [...state.challenges, challenge],
      error: null,
    })),

  updateChallenge: (challengeId, updates) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === challengeId ? { ...challenge, ...updates } : challenge,
      ),
      error: null,
    })),

  completeChallenge: (challengeId) =>
    set((state) => ({
      challenges: state.challenges.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, completed: true, current: challenge.target }
          : challenge,
      ),
      error: null,
    })),

  updateWeather: (cityId, weather) =>
    set((state) => ({
      weatherData: { ...state.weatherData, [cityId]: weather },
      error: null,
    })),

  // Computed values
  getCurrentTrip: () => get().selectedTrip,

  getCurrentCity: () => {
    const state = get()
    const currentTrip = state.selectedTrip
    if (!currentTrip?.currentCityId) return null
    return currentTrip.cities.find((city) => city.id === currentTrip.currentCityId) || null
  },

  getTripById: (tripId) => get().trips.find((trip) => trip.id === tripId),

  getCitiesForTrip: (tripId) => get().trips.find((trip) => trip.id === tripId)?.cities || [],

  getChallengesForTrip: (tripId) =>
    get().challenges.filter((challenge) => challenge.tripId === tripId),
})

// a selector can be used to grab the full TripStore
export const tripStoreSelector = (state: RootStore) => ({
  trips: state.trips,
  selectedTrip: state.selectedTrip,
  isLoading: state.isLoading,
  error: state.error,
  weatherData: state.weatherData,
  challenges: state.challenges,
  addTrip: state.addTrip,
  updateTrip: state.updateTrip,
  deleteTrip: state.deleteTrip,
  selectTrip: state.selectTrip,
  setLoading: state.setLoading,
  setError: state.setError,
  addCity: state.addCity,
  updateCity: state.updateCity,
  removeCity: state.removeCity,
  setCurrentCity: state.setCurrentCity,
  addChallenge: state.addChallenge,
  updateChallenge: state.updateChallenge,
  completeChallenge: state.completeChallenge,
  updateWeather: state.updateWeather,
  getCurrentTrip: state.getCurrentTrip,
  getCurrentCity: state.getCurrentCity,
  getTripById: state.getTripById,
  getCitiesForTrip: state.getCitiesForTrip,
  getChallengesForTrip: state.getChallengesForTrip,
})
