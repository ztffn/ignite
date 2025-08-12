

# Travel Companion — Tech Stack Spec (Focused)

## 1) Goals & constraints

*   **Single codebase** for mobile + web, zero “rewrite later”.
    
*   **Notion-like minimalism**, native feel on mobile, responsive on web.
    
*   **Offline-first**, cheap to run, EU-friendly data residency.
    
*   Keep the door open to AI/OCR without locking the app to cloud.
    

- - -

## 2) Frontend runtime & UI

**Runtime**

*   **Expo (React Native)** with **React Native Web** enabled.
    
*   **expo-router v3** for file-based navigation on native & web (URLs + deep links).
    

**UI system**

*   **Tamagui (OSS core)** for primitives, tokens, variants (RN + Web).
    
*   **FlashList** (Shopify) for high-perf lists (Itinerary, Vault).
    
*   **Icons:** `@tamagui/lucide-icons` (or `lucide-react-native`) for parity with current Lucide set.
    
*   **Sheets/Bottom sheets:** Tamagui `Sheet` (RN + Web) for modals; optional `@gorhom/bottom-sheet` on native if needed.
    

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

*   `tamagui.config.ts` with design tokens that loosely mirror current shadcn variables (spacing, radius, color roles).
    
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

## 4) Monorepo & tooling

**Structure (pnpm + Turborepo)**

bash

CopyEdit

`/apps   /mobile      # Expo app (iOS/Android + RN Web preview) /packages   /ui          # Tamagui primitives & components (Card, Chip, ListItem, Sheet, Toast)   /core        # domain types, zod schemas, hooks, date/geo utils   /adapters    # Map/OCR/Files/Directions/Push interfaces + impls (web/native)   /api         # typed Supabase client, query keys, service funcs   /config      # eslint, tsconfig, tamagui.config, env utils`

**DevX**

*   TypeScript **strict**; ESLint + Prettier.
    
*   Husky + lint-staged (format/tsc on commit).
    
*   Storybook (optional) on web for `/packages/ui` primitives.
    

**CI/CD**

*   **GitHub Actions**: typecheck, tests, **Expo Web preview** on PR.
    
*   **EAS Build/Submit** for iOS/Android; **EAS Update** for OTA JS.
    
*   Versioned Sentry releases & PostHog tagging.
    

- - -

## 5) Data model & API (stack only)

*   **Postgres** tables: `user`, `trip`, `segment`, `itinerary_item`, `place`, `place_trip`, `document`, `review`.
    
*   Access via **PostgREST** or **Supabase JS** SDK; wrap in `/packages/api`.
    
*   Use **zod** schemas in `/packages/core` to validate IO boundaries.
    

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

*   **Unit/Component**: Jest + React Testing Library (RN).
    
*   **E2E**: **Maestro** (scriptable workflows; CI-friendly).
    
*   **Contract**: `openapi-typescript` to type backend responses; break builds on schema drift.
    

- - -

## 9) Migration guide (current web → universal RN + Tamagui)

**What we keep**

*   Domain logic (TS types, zod schemas, utilities).
    
*   Any API client logic (ported into `/packages/api`).
    
*   Color/category semantics (map them to Tamagui tokens).
    

**What we replace**

*   **shadcn/ui + Tailwind** → **Tamagui** primitives + variants.
    
*   **DOM elements** (`div/span/button`) → RN primitives (`Stack/View`, `Text`, `Button/Pressable`).
    
*   **Sonner toasts** → Tamagui `Toast` (or `react-native-toast-message`).
    
*   **Modal overlays** → Tamagui `Sheet`.
    
*   **Lucide React** → `lucide-react-native` / `@tamagui/lucide-icons`.
    
*   **mapbox-gl-js only** → Map adapter (web: maplibre-gl; native: rn-maplibre-gl).
    
*   **File input** → `expo-document-picker`; **localStorage** → MMKV / SecureStore.
    

**Process**

1.  Stand up **Expo + RN Web** skeleton with Tamagui tokens.
    
2.  Port the **5 tabs** (Today, Itinerary, Map, Explore, Vault) as Tamagui screens.
    
3.  Implement **MapAdapter** & **DirectionsService**; stub on web first.
    
4.  Port **Add-next-stop** sheet & **Route Timeline** using Tamagui `Sheet`.
    
5.  Wire Supabase Auth + Storage; test offline on a physical Android.
    
6.  Switch web preview from the old DOM app to **Expo Web**.
    

- - -

## 10) Licensing & costs (stack implications)

*   **Tamagui OSS**: free. (Pro optional; not required.)
    
*   **MapLibre**: OSS. (If Mapbox APIs used for Directions/Places → usage fees.)
    
*   **Supabase**: free tier to start; scale with usage.
    
*   **OpenAI / Cloud Vision**: pay-as-you-go; gated by our quota service.
    

- - -

## 11) Acceptance criteria (stack)

*   App runs on **iOS, Android, and Web** from one repo.
    
*   Basic flow works **offline**; reconnect merges without data loss.
    
*   Map & directions work on native; web parity via adapter.
    
*   CI builds mobile binaries; **Expo Web** preview link on each PR.
    
*   No DOM APIs inside view components; adapters handle platform specifics.
    
