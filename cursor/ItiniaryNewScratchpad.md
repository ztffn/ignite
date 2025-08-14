### Itinerary drag/drop migration plan (react-native-reorderable-list → react-native-sortables)

Source context: `boilerplate/app/screens/Hopla/ItineraryScreen.tsx`, `cursor/dragdropMigration.md`, `HoplaDocs/Pages/Ititniary/*`

Reference: React Native Sortables (`react-native-sortables`) – GitHub [`https://github.com/MatiPl01/react-native-sortables`](https://github.com/MatiPl01/react-native-sortables)

Goals
- Keep current visuals and layout behavior; only swap the DnD engine
- Preserve rules: position-0 protection, day-header non-draggable, dynamic placement when dropping on day headers, cross-day moves
- Maintain view modes (condensed | medium | expanded) and existing Ignite theming/components [[Uses Ignite components preference]]

---

Todo (implementation checklist)

1) Dependencies
- [ ] Add `react-native-sortables` (requires `react-native-reanimated@^3`/`^4` and `react-native-gesture-handler@^2` which we already use)
- [ ] iOS pods: run `pod install` if needed
- [ ] Remove `react-native-reorderable-list` from dependencies and code imports

2) Data model and flattening
- [ ] Keep `Day`/`Activity` models as-is
- [ ] Continue to build a flattened data array: `[day-header, activity*, day-header, activity*, ...]`
- [ ] Mark day headers as non-draggable items

3) Rendering migration (single mixed list)
- [ ] Replace `<ReorderableList />` with `Sortable.Flex` (single list)
- [ ] Provide `data`, `keyExtractor`, and `renderItem`
- [ ] In `renderItem`: 
  - [ ] Day header → render current header UI; `draggable={false}`
  - [ ] Activity → wrap current card UI as sortable item; start drag on long-press; keep `densityStyles`
- [ ] Keep `TravelChunk` rendering logic unchanged (still between activities; not draggable)

4) Reorder logic and rules
- [ ] Wire Sortables reorder event (e.g., `onChangeOrder`/`onReorder`) to a new adapter that calls our existing rule pipeline
- [ ] Re-implement handler contract to use indices from Sortables:
  - [ ] Rule 1: if target index is 0 → redirect to index 1
  - [ ] Rule 2: if drop target is a day header → compute valid position with `calculateValidPositionForDayHeader`
  - [ ] Rule 3: activity→activity moves → proceed normally
- [ ] Support cross-day moves: remove from source day, insert into computed target position within target day (reuse existing logic)
- [ ] Keep state updates in `itineraryData`; no bounce-back

5) Behavior parity and options
- [ ] Long-press to start drag (match current UX)
- [ ] Enable auto-scroll beyond screen bounds
- [ ] Keep haptics integration optional (only if dependency is present)
- [ ] Maintain selection/expanded state: `expandedRoutes` logic unchanged

6) Styling, theming, and Ignite conventions
- [ ] Preserve `densityStyles` behavior across modes
- [ ] Keep Ignite theme usage (`useAppTheme`) and existing wrapper components for text/buttons [[memory:6175610]]
- [ ] Do not change spacing, typography, or color tokens

7) Performance and code health
- [ ] Memoize flattened data and `renderItem` via `useMemo`/`useCallback`
- [ ] Avoid recreating large objects during drag
- [ ] Address existing linter warnings in `ItineraryScreen.tsx` after the swap

8) QA scenarios
- [ ] Same-day reordering within a day
- [ ] Cross-day reordering (Amsterdam ↔ Brussels ↔ Paris)
- [ ] Drop on day header → auto-place correctly
- [ ] Position 0 protection
- [ ] All three view modes still look correct
- [ ] Large dataset sanity (smooth drag)
- [ ] iOS and Android manual runs

9) Rollback plan
- [ ] Keep a branch with current `react-native-reorderable-list` in case of issues
- [ ] The migration is isolated to `ItineraryScreen.tsx` and deps; easy revert

---

Command hints
```bash
# install
pnpm add react-native-sortables
# or: yarn add react-native-sortables

# remove old
pnpm remove react-native-reorderable-list

# iOS (if needed)
cd ios && pod install && cd -
```

Integration notes
- Use `Sortable.Flex` to support a linear list with mixed items (headers non-draggable, activities draggable)
- Drive reordering from a controlled state: Sortables event → our rule adapter → update `itineraryData`
- Keep `TravelChunk` outside of draggable items; it should not affect indexes of draggable elements within a day
- No visual redesign; only internal DnD plumbing changes

Acceptance criteria
- Cross-day drag-drop works; items remain where dropped
- Day headers cannot be moved; dropping on a header places the item in a valid slot
- View modes render identically to before
- No new visual regressions; performance is at least as smooth as before


