# Engineer‑AI Kickoff Prompt (Migration from React Web → Expo RN + Tamagui)

You are migrating an existing **React (DOM) web prototype** to a **universal Expo (React Native) app** that runs on **iOS, Android, and Web** using **Tamagui**. The target is **feature parity on web** and **native‑quality UX** on mobile **without a future rewrite**.

## Objectives (in order)

0. **Audit current web repo**

   * Keep: TypeScript types, zod schemas, domain hooks, API clients, color semantics.
   * Replace: shadcn components, Tailwind/CSS, DOM file inputs, direct mapbox‑gl usage, Sonner toasts, Next/Web‑only idioms.

1. **Scaffold universal app**

   * Expo (RN) + **React Native Web**; **expo‑router v3** for file‑based navigation (URLs + deep links).
   * TypeScript strict, ESLint/Prettier.

2. **Monorepo packages**

   * `/ui`: Tamagui primitives (Stack, Text, Button) + components (Card, ListItem, Chip, Sheet, Toast).
   * `/core`: domain types, zod schemas, utilities, hooks (no platform code).
   * `/adapters`: Map, Directions, Files, OCR, Push (interfaces + web/native impls).
   * `/api`: typed Supabase client (OpenAPI), query keys, service functions.

3. **Tokens & theming**

   * Map current semantic colors to `tamagui.config.ts` (light/dark, spacing, radius, roles).
   * No Tailwind/CSS in screens—use Tamagui props/variants.

4. **Rebuild the 5 tabs** (Today, Itinerary, Map, Explore, Vault)

   * Use Tamagui primitives only.
   * Maintain layout/structure of the web prototype; replace DOM with RN primitives.
   * Modals → **Tamagui Sheet**; toasts → **Tamagui Toast**.

5. **Adapters**

   * **MapAdapter**: web = `maplibre‑gl`, native = `react‑native‑maplibre‑gl`; common API: `setPins`, `setRoute`, `fitToBounds`, `onPinPress`.
   * **DirectionsService**: Mapbox/compatible; walking fallback.
   * **Files**: `expo‑document‑picker` / `expo‑file‑system`.
   * **OCR**: on‑device Tesseract first; Cloud Vision fallback on low confidence.
   * **Push**: Expo Notifications (native); no‑op/email on web.

6. **Backend**

   * Supabase (EU): Postgres + PostGIS + pgvector + RLS + Auth + Storage.
   * Edge functions: `ai_plan_day`, `ingest_email_booking`, `generate_share_page`.

7. **State & data**

   * Local UI: **Zustand**.
   * Server cache: **TanStack Query** with persistence (MMKV native, IndexedDB web).

8. **Parity pass (web)**

   * Itinerary with **inline Route Timeline**, Map pins/route overlay, Vault list.
   * Behaviour matches current web prototype in **Expo Web**.

9. **Device pass (native)**

   * Run on mid‑range Android/iOS; verify navigation, FlashList scrolling, map gestures, offline basic flows.

10. **CI/CD**

* GitHub Actions: typecheck/tests + **Expo Web preview** on PR.
* EAS Build/Submit (iOS/Android); EAS Update (OTA JS).
* Sentry/PostHog placeholders wired.

## Constraints

* No `<div>/<span>` or DOM APIs inside views; platform specifics live behind **adapters**.
* No raw CSS in app screens; use **Tamagui tokens/props**.
* Keep EU data residency (Supabase).
* Maintain feature parity with current web while enabling native capabilities.

## Deliverables

* Runnable monorepo with Expo app, **web preview link**, Android/iOS internal builds.
* `/packages/ui` primitives/components; adapters (stubs + one real impl each).
* Typed Supabase client; 5 tabs operational with **Itinerary + inline Route Timeline**.
