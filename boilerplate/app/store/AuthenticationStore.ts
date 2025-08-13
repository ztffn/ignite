import { StateCreator } from "zustand"

import { RootStore, User, UserPreferences } from "./types"

// TypeScript interface for this store slice
export interface AuthenticationStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  logout: () => void
}

// Selectors for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.user
export const userSelector = (state: RootStore) => state.user
export const userPreferencesSelector = (state: RootStore) => state.user?.preferences

// create our store slice with default data and actions
export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (
  set,
  get,
) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  updateUserPreferences: (preferences) => {
    const currentUser = get().user
    if (currentUser) {
      set({
        user: {
          ...currentUser,
          preferences: {
            ...currentUser.preferences,
            ...preferences,
          },
        },
      })
    }
  },

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    }),
})

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  error: state.error,
  setUser: state.setUser,
  setLoading: state.setLoading,
  setError: state.setError,
  updateUserPreferences: state.updateUserPreferences,
  logout: state.logout,
})
