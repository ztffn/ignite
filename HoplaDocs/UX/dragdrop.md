# Draggable FlashList — Minimal LongPress→Pan Example (RNGH v2 + Reanimated 3)

This is a **copy-pasteable** baseline that preserves **native scrolling**, then after a **500 ms long press** switches into a **manual Pan** so the hold → drag feels continuous. Works with variable row heights.

- - -

## 1) Prerequisites

*   Expo SDK 50+ or RN 0.73+
    
*   Packages:
    
    *   `react-native-gesture-handler` (v2+)
        
    *   `react-native-reanimated` (v3+)
        
    *   `@shopify/flash-list`
        

bash

Copy code

`# expo expo install react-native-gesture-handler react-native-reanimated npm i @shopify/flash-list  # bare RN: also follow reanimated + RNGH autolinking & babel steps`

**Reanimated config** (babel): add `"react-native-reanimated/plugin"` last.

js

Copy code

`// babel.config.js module.exports = function (api) {   api.cache(true);   return {     presets: ["babel-preset-expo"],     plugins: ["react-native-reanimated/plugin"],   }; };`

**Entry root**: wrap your app with `GestureHandlerRootView`.

tsx

Copy code

``// App.tsx (or index.js entry) import React from "react"; import { SafeAreaView } from "react-native"; import { GestureHandlerRootView } from "react-native-gesture-handler"; import DraggableItineraryList from "./DraggableItineraryList";  export default function App() {   const data = Array.from({ length: 20 }).map((_, i) => ({     id: String(i + 1),     title: `Block #${i + 1}`,   }));    return (     <GestureHandlerRootView style={{ flex: 1 }}>       <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>         <DraggableItineraryList           data={data}           onReorder={(next) => console.log("reordered", next.map(x => x.id))}         />       </SafeAreaView>     </GestureHandlerRootView>   ); }``

- - -

## 2) Minimal Implementation

### `DraggableItineraryList.tsx`

tsx

Copy code

`import React, { useCallback, useRef, useState } from "react"; import { View, Text } from "react-native"; import Animated, { useSharedValue } from "react-native-reanimated"; import { Gesture, GestureDetector } from "react-native-gesture-handler"; import { FlashList, FlashListProps } from "@shopify/flash-list";  type Item = { id: string; title: string };  type Props = {   data: Item[];   onReorder?: (next: Item[]) => void; };  export default function DraggableItineraryList({ data, onReorder }: Props) {   const [items, setItems] = useState<Item[]>(data);   const listRef = useRef<FlashList<Item>>(null);    // Shared gesture state   const scrollEnabled = useSharedValue(true);   const activeId = useSharedValue<string | null>(null);   const offsetY = useSharedValue(0);   const startY = useSharedValue(0);    // Track per-item measured heights (for variable-height rows)   const heightsRef = useRef(new Map<string, number>()).current;    const setHeight = useCallback((id: string, h: number) => {     heightsRef.set(id, h);   }, []);    const indexFromAbsoluteY = useCallback((absY: number) => {     // Convert absolute Y to list index using measured heights     let acc = 0;     let idx = 0;     for (const it of items) {       const h = heightsRef.get(it.id) ?? 0;       if (absY < acc + h / 2) break;       acc += h;       idx += 1;     }     return Math.max(0, Math.min(idx, items.length - 1));   }, [items, heightsRef]);    const reorderAt = useCallback((dragId: string, targetIndex: number) => {     setItems(prev => {       const from = prev.findIndex(i => i.id === dragId);       if (from < 0 || targetIndex < 0 || targetIndex >= prev.length || targetIndex === from) return prev;       const next = prev.slice();       const [moved] = next.splice(from, 1);       next.splice(targetIndex, 0, moved);       onReorder?.(next);       return next;     });   }, [onReorder]);    const renderItem: FlashListProps<Item>["renderItem"] = ({ item }) => {     return (       <DraggableRow         item={item}         listRef={listRef}         activeId={activeId}         offsetY={offsetY}         startY={startY}         scrollEnabled={scrollEnabled}         onMeasure={setHeight}         indexFromAbsoluteY={indexFromAbsoluteY}         onDrop={(id, absY) => reorderAt(id, indexFromAbsoluteY(absY))}       />     );   };    return (     <FlashList       ref={listRef}       data={items}       keyExtractor={(it) => it.id}       renderItem={renderItem}       estimatedItemSize={72}       scrollEnabled={scrollEnabled.value}       ItemSeparatorComponent={() => <View style={{ height: 8 }} />}       contentContainerStyle={{ padding: 16 }}     />   ); }  type RowProps = {   item: Item;   listRef: React.RefObject<FlashList<Item>>;   activeId: Animated.SharedValue<string | null>;   offsetY: Animated.SharedValue<number>;   startY: Animated.SharedValue<number>;   scrollEnabled: Animated.SharedValue<boolean>;   onMeasure: (id: string, h: number) => void;   indexFromAbsoluteY: (absY: number) => number;   onDrop: (id: string, absY: number) => void; };  function DraggableRow({   item,   activeId,   offsetY,   startY,   scrollEnabled,   onMeasure,   onDrop, }: RowProps) {   const isActive = useSharedValue(false);    const pan = Gesture.Pan()     .manualActivation(true)     .onTouchesMove((_, state) => {       if (isActive.value) state.activate();     })     .onUpdate((e) => {       if (!isActive.value) return;       offsetY.value = e.translationY;     })     .onEnd((e) => {       if (!isActive.value) return;       const absY = startY.value + e.translationY;       onDrop(item.id, absY);       isActive.value = false;       activeId.value = null;       scrollEnabled.value = true;       offsetY.value = 0;     })     .onFinalize(() => {       if (isActive.value) {         isActive.value = false;         activeId.value = null;         scrollEnabled.value = true;         offsetY.value = 0;       }     })     .shouldCancelWhenOutside(false);    const longPress = Gesture.LongPress()     .minDuration(500)     .maxDistance(10)     .onStart((e) => {       isActive.value = true;       activeId.value = item.id;       scrollEnabled.value = false;       startY.value = e.absoluteY;       pan.activate(); // continuous hold→drag     })     .onEnd(() => {       if (isActive.value) {         isActive.value = false;         activeId.value = null;         scrollEnabled.value = true;       }     });    const composed = Gesture.Simultaneous(longPress, pan);    const style = Animated.useAnimatedStyle(() => {     const active = isActive.value && activeId.value === item.id;     return {       transform: [{ translateY: active ? offsetY.value : 0 }, { scale: active ? 1.03 : 1 }],       zIndex: active ? 10 : 0,       shadowOpacity: active ? 0.2 : 0,       shadowRadius: active ? 8 : 0,       elevation: active ? 4 : 0,     };   });    return (     <GestureDetector gesture={composed}>       <Animated.View         onLayout={(e) => onMeasure(item.id, e.nativeEvent.layout.height)}         style={[{ padding: 16, borderRadius: 12, backgroundColor: "#F5F7FB" }, style]}       >         <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 6 }}>{item.title}</Text>         <Text style={{ opacity: 0.6 }}>           Long-press 500 ms, then drag. Release to drop & reorder.         </Text>       </Animated.View>     </GestureDetector>   ); }`

- - -

## 3) How it works (for another agent)

*   **Native scroll by default:** The list handles vertical moves until a long press succeeds.
    
*   **Long press “arms” drag:** `LongPress.minDuration(500).maxDistance(10)` ensures the finger is mostly still; on start we:
    
    *   mark `isActive = true`
        
    *   store `startY = e.absoluteY`
        
    *   disable list scrolling (`scrollEnabled = false`)
        
    *   **activate** the manual pan (`pan.activate()`), so the user keeps holding and moves seamlessly.
        
*   **Manual pan:** `Pan().manualActivation(true)` won’t compete with scroll until we call `activate()`. While active, we update `offsetY`.
    
*   **Drop & reorder:** On `Pan.onEnd`, compute `absY = startY + translationY`, convert to index using measured heights, reorder, then reset flags.
    
*   **Variable heights:** Each row reports its height on layout; the absolute Y → index mapping walks those heights. For uniform rows, use math (`round(translationY / ROW_HEIGHT)`).
    

- - -

## 4) Optional Enhancements (quick notes)

*   **Edge auto-scroll while dragging:** On each `Pan.onUpdate`, if `e.absoluteY` is near top/bottom (e.g., < 100 or > screenHeight − 100), increment/decrement the list offset (throttle at ~60–120 ms).
    
*   **Handle taps:** Wrap content inside the `Animated.View` with a `Pressable` when `!isActive`. Or use a drag handle icon and attach gestures only to it.
    
*   **Stability:** If conflicts appear, try `Gesture.Race(Gesture.Native(), Gesture.Exclusive(longPress, pan))`.
    

- - -

## 5) Troubleshooting

*   **Pan steals scroll immediately:** You forgot `manualActivation(true)` or you called `activate()` too early.
    
*   **Long-press triggers while scrolling:** Reduce `maxDistance` (e.g., `10`) so scrolling movement cancels the long press.
    
*   **Nothing drags after pop-out:** Ensure `pan.activate()` is called inside `LongPress.onStart`, and `GestureDetector` wraps the row.
    
*   **Android weirdness:** Verify the app root is `GestureHandlerRootView` and Reanimated plugin is configured.
    

- - -

## 6) What to change in your app

*   Replace `FlashList` with your list if needed (works with `FlatList` too).
    
*   Swap the row UI in `DraggableRow` with your block design.
    
*   If you use a **drag handle**, move the `GestureDetector` to that handle only.
    
*   For deterministic reorders, persist `items` to your store and call `onReorder`.
    

That’s it — this is the smallest reliable pattern that keeps scroll silky but gives you continuous **hold → drag → drop**.