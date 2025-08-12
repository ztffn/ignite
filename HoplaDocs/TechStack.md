

# Hopla Travel App — Tech Stack Spec (Updated for Ignite)

## 1) Goals & constraints

*   **Single codebase** for mobile + web, zero "rewrite later".
    
*   **Notion-like minimalism**, native feel on mobile, responsive on web.
    
*   **Offline-first**, cheap to run, EU-friendly data residency.
    
*   Keep the door open to AI/OCR without locking the app to cloud.
    

- - -

## 2) Frontend runtime & UI

**Runtime**

*   **Expo (React Native)** with **React Native Web** enabled.
    
*   **React Navigation** (already implemented in Ignite) for navigation on native & web.
    

**UI system**

*   **Ignite's built-in component system** for primitives, tokens, variants (RN + Web).
    
*   **FlashList** (Shopify) for high-perf lists (Itinerary, Vault).
    
*   **Icons:** `lucide-react-native` for parity with current Lucide set.
    
*   **Sheets/Bottom sheets:** Custom modal components using Ignite's Card and overlay system.
    

**State & data**

*   **Zustand** for local UI state (lightweight stores).
    
*   **TanStack Query** for server state, retries, cache, offline persistence (MMKV on native, IndexedDB on web).
    
*   **react-hook-form + zod** for forms & validation (typed).
    

**Maps & geo**

*   **MapLibre** everywhere via adapter:
    
    *   Web: `maplibre-gl`
        
    *   Native: `react-native-maplibre-gl`
        
*   **Directions/Places**: Mapbox/MapLibre-compatible APIs (multi-modal when available); graceful fallback to walking.
    

**Files & device**

*   `expo-document-picker`, `expo-file-system`, `expo-media-library`.
    
*   **Notifications**: Expo Notifications (native); no-op or email fallback on web.
    
*   **Secure storage**: `expo-secure-store` (tokens); **MMKV** for fast cache.
    

**Theming & tokens**

*   **Ignite's theme system** with design tokens that loosely mirror current shadcn variables (spacing, radius, color roles).
    
*   One theme for light/dark; minimal semantic roles (accent, surface, border, text).
    

- - -

## 3) Backend & services

**Platform**

*   **Supabase** (managed Postgres) with:
    
    *   **PostGIS** for geospatial queries.
        
    *   **pgvector** for embeddings (similarity, de-dup).
        
    *   **RLS** (Row Level Security) for per-user/trip access.
        
    *   **Auth** (Apple/Google/Email).
        
    *   **Storage** for images/docs (signed URLs).
        
    *   **Realtime** for collaboration (optional initially).
        

**Edge functions (Deno)**

*   `ai_plan_day` (brokers to AI service).
    
*   `ingest_email_booking` (parse inbound emails → docs).
    
*   `generate_share_page` (public trip pages, static).
    

**AI / OCR**

*   **FastAPI service** (single endpoint) in front of:
    
    *   **OpenAI gpt-4o-mini** for itinerary suggestions (quotas enforced here).
        
    *   **On-device Tesseract** first; **Cloud Vision** fallback when online & low confidence.
        

**Observability**

*   **Sentry** (errors & releases).
    
*   **PostHog** (product analytics; self-host or EU cloud).
    

- - -

## 4) Project structure & tooling

**Structure (based on Ignite boilerplate)**

```
/hopla_ignite
  /boilerplate-backup     # Original Ignite backup
  /boilerplate            # Our Hopla app (modified Ignite)
    /app
      /components         # Ignite components + our custom ones
      /screens           # Hopla screens (Today, Itinerary, Map, Explore, Vault)
      /theme             # Ignite theme system + Hopla color tokens
      /services          # API, maps, storage services
      /utils             # Domain utilities, date/geo helpers
      /context           # React Context for app state
    /assets              # Images, icons, fonts
    /ios                 # iOS native code
    /android             # Android native code
  /HoplaDocs             # Documentation
```

**DevX**

*   TypeScript **strict**; ESLint + Prettier (already configured in Ignite).
    
*   Husky + lint-staged (format/tsc on commit).
    
*   Storybook (optional) on web for component documentation.
    

**CI/CD**

*   **GitHub Actions**: typecheck, tests, **Expo Web preview** on PR.
    
*   **EAS Build/Submit** for iOS/Android; **EAS Update** for OTA JS.
    
*   Versioned Sentry releases & PostHog tagging.
    

- - -

## 5) Data model & API (stack only)

*   **Postgres** tables: `user`, `trip`, `segment`, `itinerary_item`, `place`, `place_trip`, `document`, `review`.
    
*   Access via **PostgREST** or **Supabase JS** SDK; wrap in `/app/services`.
    
*   Use **zod** schemas in `/app/utils` to validate IO boundaries.
    

- - -

## 6) Offline & sync (how the stack handles it)

*   **Query cache** persisted (MMKV native, IndexedDB web).
    
*   **SQLite (expo-sqlite)** for itinerary edits when offline; replay on reconnect.
    
*   Conflict: field-level last-write-wins; ordering via **position-as-float** (robust during concurrent drag-drops).
    
*   Map tiles packaged per segment; cap per trip (configurable).
    

- - -

## 7) Security & privacy (stack choices)

*   Tokens only in **SecureStore**; never in AsyncStorage or localStorage.
    
*   Supabase Storage: encrypted at rest; signed URLs short TTL.
    
*   GDPR: data residency in EU region, export/delete endpoints.
    
*   Crash logs scrub PII; analytics behind consent.
    

- - -

## 8) Testing

*   **Unit/Component**: Jest + React Testing Library (RN) - already configured in Ignite.
    
*   **E2E**: **Maestro** (scriptable workflows; CI-friendly).
    
*   **Contract**: `openapi-typescript` to type backend responses; break builds on schema drift.
    

- - -

## 9) Migration guide (Ignite boilerplate → Hopla app)

**What we keep from Ignite**

*   Core component system (Button, Card, Text, etc.).
    
*   Theme system (colors, spacing, typography).
    
*   Navigation structure and utilities.
    
*   Testing setup and configuration.
    
*   Build and deployment configuration.
    

**What we add for Hopla**

*   **Custom screens**: Today, Itinerary, Map, Explore, Vault.
    
*   **State management**: Zustand stores for app state.
    
*   **API integration**: Supabase client and services.
    
*   **Maps**: MapLibre integration with platform adapters.
    
*   **Offline support**: SQLite + sync mechanisms.
    
*   **Forms**: react-hook-form + zod validation.
    

**Process**

1.  **Setup base**: Install additional dependencies (Zustand, TanStack Query, etc.).
    
2.  **Create screens**: Build the 5 main Hopla screens using Ignite components.
    
3.  **Implement services**: API, maps, storage, and offline services.
    
4.  **Add state management**: Zustand stores for trips, user, and app state.
app/store/
├── RootStore.ts          # Main store combining all slices
├── AuthenticationStore.ts # User auth & profile
├── TripStore.ts          # Trip management & state
├── ItineraryStore.ts     # Daily plans & activities
├── MapStore.ts           # Map state & locations
├── DocumentStore.ts      # Document vault
└── index.ts              # Exports

import { useAuthenticationStore, useTripStore } from '../store';

const MyComponent = () => {
  const { user, setUser } = useAuthenticationStore();
  const { trips, addTrip } = useTripStore();
  
  // Use the store...
};

5.  **Integrate backend**: Supabase auth, database, and storage.
    
6.  **Test offline**: Verify offline functionality on physical devices.
    
7.  **Web testing**: Ensure React Native Web works properly.
    

- - -

## 10) Dependencies to add

**Core dependencies (already in Ignite)**
- ✅ expo, react-native, react
- ✅ @react-navigation/native, @react-navigation/bottom-tabs
- ✅ expo-dev-client, expo-splash-screen

**Additional dependencies needed**
```json
{
  "dependencies": {
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "lucide-react-native": "^0.294.0",
    "react-native-flash-list": "^1.6.0",
    "react-native-maplibre-gl": "^8.1.0",
    "maplibre-gl": "^2.4.0",
    "expo-document-picker": "~11.5.0",
    "expo-file-system": "~15.4.0",
    "expo-media-library": "~15.4.0",
    "expo-secure-store": "~12.8.0",
    "expo-sqlite": "~11.3.0",
    "expo-notifications": "~0.20.0",
    "@supabase/supabase-js": "^2.38.0",
    "react-native-mmkv": "^3.2.0"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.0.0",
    "maestro": "^0.4.0"
  }
}
```

- - -

## 11) Acceptance criteria (updated stack)

*   App runs on **iOS, Android, and Web** from one repo (using Ignite + RN Web).
    
*   Basic flow works **offline**; reconnect merges without data loss.
    
*   Map & directions work on native; web parity via adapter.
    
*   CI builds mobile binaries; **Expo Web** preview link on each PR.
    
*   Uses Ignite's component system; no DOM APIs inside view components.
    
*   Maintains Ignite's performance and testing standards.
    
