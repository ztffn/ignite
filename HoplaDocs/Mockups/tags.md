1) Theme: category → color tokens

app/theme/categoryTheme.ts

export const CATEGORY_THEME = {
  foodDrink:      { key: "foodDrink",      name: "Food & Drink",           light: "#FAECEC", dark: "#C4554D" }, // Red
  shopping:       { key: "shopping",       name: "Shopping",               light: "#F8ECDF", dark: "#CC782F" }, // Orange
  relaxWellness:  { key: "relaxWellness",  name: "Relax & Wellness",       light: "#EEF3ED", dark: "#548164" }, // Green
  sights:         { key: "sights",         name: "Sights & Photo Spots",   light: "#E9F3F7", dark: "#487CA5" }, // Blue
  cultureArts:    { key: "cultureArts",    name: "Culture & Arts",         light: "#F6F3F8", dark: "#8A67AB" }, // Purple
  nightlife:      { key: "nightlife",      name: "Nightlife & Music",      light: "#F9F2F5", dark: "#B35488" }, // Pink
  natureOutdoors: { key: "natureOutdoors", name: "Nature & Outdoors",      light: "#FAF3DD", dark: "#C29343" }, // Yellow
  heritage:       { key: "heritage",       name: "History & Architecture", light: "#F3EEEE", dark: "#976D57" }, // Brown
} as const;

export type CategoryKey = keyof typeof CATEGORY_THEME;

2) Tags: tag → icon + category

Use conservative Lucide icon names that exist in lucide-react-native. If an icon isn’t found (typo / future rename), we’ll fall back to HelpCircle.

app/data/tags.ts

import { CATEGORY_THEME, CategoryKey } from "../theme/categoryTheme";

export type TagKey =
  // Food & Drink
  | "Dinner" | "Lunch" | "Brunch" | "Cafés" | "Street Food" | "Bars" | "Wine Tasting"
  // Shopping
  | "Shops" | "Boutiques" | "Souvenirs" | "Markets" | "Deals"
  // Relax & Wellness
  | "Spa" | "Beach" | "Park" | "Lounge"
  // Sights & Photo Spots
  | "Landmarks" | "Architecture" | "Scenic View" | "Photo Spot" | "Museums" | "Galleries"
  // Culture & Arts
  | "Theatre" | "Live Music" | "Festival" | "Exhibit"
  // Nightlife & Music
  | "Clubbing" | "Party" | "DJ Set"
  // Nature & Outdoors
  | "Hiking" | "Mountains" | "Forest" | "Coast" | "Camping"
  // History & Architecture
  | "Old Town" | "Monument" ;

type TagMeta = {
  label: string;
  iconName: string;      // Lucide component name
  category: CategoryKey; // which color umbrella
};

export const TAGS: Record<TagKey, TagMeta> = {
  // Food & Drink (Red)
  Dinner:        { label: "Dinner",        iconName: "Utensils",     category: "foodDrink" },
  Lunch:         { label: "Lunch",         iconName: "Utensils",     category: "foodDrink" },
  Brunch:        { label: "Brunch",        iconName: "Utensils",     category: "foodDrink" },
  "Cafés":       { label: "Cafés",         iconName: "Coffee",       category: "foodDrink" },
  "Street Food": { label: "Street Food",   iconName: "Utensils",     category: "foodDrink" },
  Bars:          { label: "Bars",          iconName: "Beer",         category: "foodDrink" },
  "Wine Tasting":{ label: "Wine Tasting",  iconName: "Wine",         category: "foodDrink" },

  // Shopping (Orange)
  Shops:         { label: "Shops",         iconName: "ShoppingBag",  category: "shopping" },
  Boutiques:     { label: "Boutiques",     iconName: "Store",        category: "shopping" },
  Souvenirs:     { label: "Souvenirs",     iconName: "Gift",         category: "shopping" },
  Markets:       { label: "Markets",       iconName: "ShoppingBasket", category: "shopping" },
  Deals:         { label: "Deals",         iconName: "Tag",          category: "shopping" },

  // Relax & Wellness (Green)
  Spa:           { label: "Spa",           iconName: "Bath",         category: "relaxWellness" },
  Beach:         { label: "Beach",         iconName: "Waves",        category: "relaxWellness" },
  Park:          { label: "Park",          iconName: "Trees",        category: "relaxWellness" },
  Lounge:        { label: "Lounge",        iconName: "Armchair",     category: "relaxWellness" },

  // Sights & Photo Spots (Blue)
  Landmarks:     { label: "Landmarks",     iconName: "Landmark",     category: "sights" },
  Architecture:  { label: "Architecture",  iconName: "Building2",    category: "sights" },
  "Scenic View": { label: "Scenic View",   iconName: "Binoculars",   category: "sights" },
  "Photo Spot":  { label: "Photo Spot",    iconName: "Camera",       category: "sights" },
  Museums:       { label: "Museums",       iconName: "Museum",       category: "sights" },
  Galleries:     { label: "Galleries",     iconName: "Image",        category: "sights" },

  // Culture & Arts (Purple)
  Theatre:       { label: "Theatre",       iconName: "Drama",        category: "cultureArts" },
  "Live Music":  { label: "Live Music",    iconName: "Music",        category: "cultureArts" },
  Festival:      { label: "Festival",      iconName: "Ticket",       category: "cultureArts" },
  Exhibit:       { label: "Exhibit",       iconName: "Tickets",      category: "cultureArts" },

  // Nightlife & Music (Pink)
  Clubbing:      { label: "Clubbing",      iconName: "Disc",         category: "nightlife" },
  Party:         { label: "Party",         iconName: "PartyPopper",  category: "nightlife" },
  "DJ Set":      { label: "DJ Set",        iconName: "Disc3",        category: "nightlife" },

  // Nature & Outdoors (Yellow)
  Hiking:        { label: "Hiking",        iconName: "Route",        category: "natureOutdoors" },
  Mountains:     { label: "Mountains",     iconName: "Mountain",     category: "natureOutdoors" },
  Forest:        { label: "Forest",        iconName: "Trees",        category: "natureOutdoors" },
  Coast:         { label: "Coast",         iconName: "Waves",        category: "natureOutdoors" },
  Camping:       { label: "Camping",       iconName: "Tent",         category: "natureOutdoors" },

  // History & Architecture (Brown)
  "Old Town":    { label: "Old Town",      iconName: "Building2",    category: "heritage" },
  Monument:      { label: "Monument",      iconName: "Landmark",     category: "heritage" },
};

export const getCategoryForTag = (tag: TagKey) => TAGS[tag].category;
export const getColorsForCategory = (category: CategoryKey) => CATEGORY_THEME[category];

    If any of those icon names don’t exist in your installed lucide-react-native version, they’ll auto‑fallback in the component below. You can tweak the names with IDE autocomplete.

3) Icon wrapper with safe fallback

app/components/Icon.tsx

import * as React from "react";
import * as Lucide from "lucide-react-native";

type LucideName = keyof typeof Lucide;

type Props = {
  name: string;         // we accept string to allow runtime mapping
  size?: number;
  color?: string;
};

export function Icon({ name, size = 18, color }: Props) {
  const Cmp = (Lucide as any)[name as LucideName] ?? Lucide.HelpCircle;
  return <Cmp size={size} color={color} />;
}

4) Category pill & Tag chip

app/components/CategoryPill.tsx

import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CATEGORY_THEME, CategoryKey } from "../theme/categoryTheme";

export function CategoryPill({ category }: { category: CategoryKey }) {
  const { name, light, dark } = CATEGORY_THEME[category];
  return (
    <View style={[styles.wrap, { backgroundColor: light, borderColor: dark }]}>
      <Text style={[styles.text, { color: dark }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.25,
  },
});

app/components/ActivityTag.tsx

import * as React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { TAGS, TagKey, getCategoryForTag } from "../data/tags";
import { CATEGORY_THEME } from "../theme/categoryTheme";
import { Icon } from "./Icon";

type Props = {
  tag: TagKey;
  onPress?: (tag: TagKey) => void;
  selected?: boolean;
};

export function ActivityTag({ tag, onPress, selected }: Props) {
  const meta = TAGS[tag];
  const category = getCategoryForTag(tag);
  const colors = CATEGORY_THEME[category];
  const bg = selected ? colors.dark : colors.light;
  const fg = selected ? "#FFFFFF" : colors.dark;

  return (
    <Pressable onPress={() => onPress?.(tag)} style={({ pressed }) => [
      styles.wrap,
      { backgroundColor: bg, borderColor: colors.dark, opacity: pressed ? 0.9 : 1 }
    ]}>
      <View style={styles.row}>
        <Icon name={meta.iconName} color={fg} size={16} />
        <Text style={[styles.text, { color: fg }]}>{meta.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  text: { fontSize: 14, fontWeight: "600" },
});

5) Example: render an itinerary row

app/screens/TagsDemoScreen.tsx

import * as React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { ActivityTag } from "../components/ActivityTag";
import { CategoryPill } from "../components/CategoryPill";
import { CATEGORY_THEME, CategoryKey } from "../theme/categoryTheme";

const EXAMPLE: { title: string; category: CategoryKey; tags: Array<any> }[] = [
  { title: "Dinner at Bistro Paul", category: "foodDrink",      tags: ["Dinner", "Wine Tasting"] },
  { title: "Morning at Mercado",    category: "shopping",       tags: ["Markets", "Deals"] },
  { title: "Beach afternoon",       category: "relaxWellness",  tags: ["Beach", "Lounge"] },
  { title: "Golden hour walk",      category: "sights",         tags: ["Scenic View", "Photo Spot"] },
];

export default function TagsDemoScreen() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {EXAMPLE.map((stop, i) => {
        const colors = CATEGORY_THEME[stop.category];
        return (
          <View key={i} style={[styles.card, { borderColor: colors.dark, backgroundColor: colors.light }]}>
            <View style={styles.header}>
              <CategoryPill category={stop.category} />
              <Text style={styles.title}>{stop.title}</Text>
            </View>
            <View style={styles.tagsRow}>
              {stop.tags.map((t: any) => (
                <ActivityTag
                  key={t}
                  tag={t}
                  selected={!!selected[t]}
                  onPress={(tag) => setSelected((s) => ({ ...s, [tag]: !s[tag] }))}
                />
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  header: { marginBottom: 8, gap: 6 },
  title: { fontSize: 16, fontWeight: "700" },
  tagsRow: { flexDirection: "row", flexWrap: "wrap" },
});