import React, { useState, useCallback } from "react"
import { View, Text, TouchableOpacity, Pressable } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ReorderableList, { useReorderableDrag, ReorderableListReorderEvent } from "react-native-reorderable-list"
import { useNavigation } from "@react-navigation/native"

import { useAppTheme } from "../../theme/context"

// New type system for layout density
type LayoutDensity = 'condensed' | 'medium' | 'expanded'

// Density-specific styling configuration
const densityStyles = {
  condensed: {
    padding: 12, // spacing.sm equivalent
    marginBottom: 8, // spacing.xs equivalent
    emojiSize: 18,
    textSize: { title: 14, subtitle: 12 },
    showTags: false,
    transportVisibility: 'minimal',
    dayHeader: 'xl',
    cityText: 'sm',
    showTableHeaders: true
  },
  medium: {
    padding: 16, // spacing.md equivalent
    marginBottom: 12, // spacing.sm equivalent
    emojiSize: 24,
    textSize: { title: 16, subtitle: 14 },
    showTags: true,
    transportVisibility: 'expanded',
    dayHeader: 'xl',
    cityText: 'base',
    showTableHeaders: false
  },
  expanded: {
    padding: 24, // spacing.lg equivalent
    marginBottom: 16, // spacing.md equivalent
    emojiSize: 32,
    textSize: { title: 18, subtitle: 16 },
    showTags: true,
    transportVisibility: 'card',
    dayHeader: '2xl',
    cityText: 'base',
    showTableHeaders: false
  }
}

interface Activity {
  id: string
  time: string
  title: string
  type: string
  location?: string
  tags?: string[]
  emoji: string
  description?: string
  rating?: number
  price?: string
  backgroundImage?: string
  hasDocument?: boolean
  phone?: string
  website?: string
  notes?: string
}

interface TravelRoute {
  id: string
  fromActivityId: string
  toActivityId: string
  defaultMode: "walk" | "metro" | "bus" | "car"
  totalTime: string
  totalDistance: string
  totalCost?: string
  steps: any[]
  offline?: boolean
}

interface Day {
  id: string
  date: string
  city: string
  activities: Activity[]
  routes: TravelRoute[]
}

// Mock data for testing - matching the mockup exactly
const mockItinerary: Day[] = [
  {
    id: "1",
    date: "Day 1 – Amsterdam",
    city: "Amsterdam",
    activities: [
      {
        id: "a1",
        time: "09:30",
        title: "Hotel Check-in",
        type: "hotel",
        location: "Lloyd Hotel & Cultural Embassy",
        tags: ["Accommodation", "Rest"],
        emoji: "🏨",
        description: "Unique cultural hotel in Amsterdam's Eastern Docklands with artistic rooms.",
        rating: 4.1,
        price: "€150/night",
        backgroundImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop"
      },
      {
        id: "a2",
        time: "10:30",
        title: "Anne Frank House",
        type: "attraction",
        location: "Prinsengracht 263-267",
        tags: ["History", "Culture"],
        hasDocument: true,
        emoji: "📖",
        description: "Moving museum in the actual house where Anne Frank wrote her famous diary during WWII.",
        rating: 4.5,
        phone: "+31 20 556 7105",
        website: "annefrank.org",
        price: "€16",
        notes: "Book online in advance - tickets sell out quickly. Allow 1.5 hours.",
        backgroundImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop"
      },
      {
        id: "a3",
        time: "12:30",
        title: "Café de Reiger",
        type: "restaurant",
        location: "Nieuwe Leliestraat 34",
        tags: ["Dutch", "Local"],
        emoji: "🍻",
        description: "Traditional Amsterdam brown café serving hearty Dutch classics and great local beer.",
        rating: 4.3,
        price: "€€",
        backgroundImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop"
      },
      {
        id: "a4",
        time: "14:30",
        title: "Vondelpark Stroll",
        type: "nature",
        location: "Vondelpark",
        tags: ["Nature", "Walking", "Outdoors"],
        emoji: "🌳",
        description: "Amsterdam's most popular park - perfect for a relaxing walk and people watching.",
        rating: 4.4,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1523043737299-8ebe6b4a6520?w=800&h=400&fit=crop"
      },
      {
        id: "a5",
        time: "16:00",
        title: "Travel Buddy Meetup",
        type: "social",
        location: "Café Central",
        tags: ["Social", "Meeting", "Friends"],
        emoji: "👥",
        description: "Connect with fellow travelers and locals at this weekly social meetup.",
        rating: 4.2,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&h=400&fit=crop"
      },
      {
        id: "a6",
        time: "17:30",
        title: "Travel Notes Review",
        type: "note",
        location: "Hotel Room",
        tags: ["Planning", "Notes"],
        emoji: "📝",
        description: "Review today's experiences and plan tomorrow's activities.",
        rating: 0,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop"
      },
      {
        id: "a7",
        time: "19:00",
        title: "Restaurant Greetje",
        type: "restaurant",
        location: "Peperstraat 23",
        tags: ["Fine Dining", "Modern Dutch"],
        emoji: "🍽️",
        description: "Innovative restaurant serving modern interpretations of traditional Dutch cuisine.",
        rating: 4.6,
        price: "€€€€",
        backgroundImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop"
      }
    ],
    routes: [
      {
        id: "r1-1",
        fromActivityId: "a1",
        toActivityId: "a2",
        defaultMode: "walk",
        totalTime: "12 min",
        totalDistance: "850m",
        steps: [
          { id: "r1-1s1", mode: "walk", description: "Walk south on Prinsengracht", duration: "5 min" },
          { id: "r1-1s2", mode: "walk", description: "Turn right on Leliegracht", duration: "3 min" },
          { id: "r1-1s3", mode: "walk", description: "Continue to Nieuwe Leliestraat", duration: "4 min" }
        ]
      },
      {
        id: "r1-2",
        fromActivityId: "a2",
        toActivityId: "a3",
        defaultMode: "metro",
        totalTime: "15 min",
        totalDistance: "2.3km",
        totalCost: "€3.20",
        steps: [
          { id: "r1-2s1", mode: "walk", description: "Walk to Nieuwmarkt Metro Station", duration: "4 min" },
          { id: "r1-2s2", mode: "metro", description: "Metro 51, 53, 54 to Centraal Station", duration: "8 min" },
          { id: "r1-2s3", mode: "walk", description: "Walk to canal cruise departure point", duration: "3 min" }
        ]
      },
      {
        id: "r1-3",
        fromActivityId: "a3",
        toActivityId: "a4",
        defaultMode: "walk",
        totalTime: "5 min",
        totalDistance: "400m",
        steps: [
          { id: "r1-3s1", mode: "walk", description: "Walk into Jordaan district", duration: "5 min" }
        ]
      },
      {
        id: "r1-4",
        fromActivityId: "a4",
        toActivityId: "a5",
        defaultMode: "bus",
        totalTime: "18 min",
        totalDistance: "3.1km",
        totalCost: "€3.20",
        steps: [
          { id: "r1-4s1", mode: "walk", description: "Walk to Marnixstraat bus stop", duration: "3 min" },
          { id: "r1-4s2", mode: "bus", description: "Bus 18 towards Centrum", duration: "12 min" },
          { id: "r1-4s3", mode: "walk", description: "Walk to Peperstraat", duration: "3 min" }
        ]
      },
      {
        id: "r1-5",
        fromActivityId: "a5",
        toActivityId: "a6",
        defaultMode: "walk",
        totalTime: "6 min",
        totalDistance: "450m",
        steps: [
          { id: "r1-5s1", mode: "walk", description: "Walk back to hotel area", duration: "6 min" }
        ]
      },
      {
        id: "r1-6",
        fromActivityId: "a6",
        toActivityId: "a7",
        defaultMode: "walk",
        totalTime: "10 min",
        totalDistance: "700m",
        steps: [
          { id: "r1-6s1", mode: "walk", description: "Walk to Restaurant Greetje", duration: "10 min" }
        ]
      }
    ]
  },
  {
    id: "2",
    date: "Day 2 – Brussels",
    city: "Brussels",
    activities: [
      { 
        id: "b1", 
        time: "09:00", 
        title: "Medical Check-in", 
        type: "medical", 
        location: "Travel Health Clinic",
        tags: ["Health", "Safety", "Emergency"],
        hasDocument: true,
        emoji: "🏥",
        description: "Routine travel health check and prescription refill at local clinic.",
        rating: 4.0,
        price: "€35",
        backgroundImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop"
      },
      { 
        id: "b2", 
        time: "10:30", 
        title: "Grand Place", 
        type: "attraction", 
        location: "City Center",
        tags: ["Architecture", "UNESCO"],
        emoji: "🏰",
        description: "Breathtaking medieval town square considered one of the most beautiful in Europe.",
        rating: 4.7,
        price: "Free",
        notes: "Best light for photos in the morning. Check for flower carpet events.",
        backgroundImage: "https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800&h=400&fit=crop"
      },
      { 
        id: "b3", 
        time: "12:00", 
        title: "Brussels History Museum", 
        type: "museum", 
        location: "Rue de l'Empereur 4",
        tags: ["History", "Culture", "Education"],
        hasDocument: true,
        emoji: "🏛️",
        description: "Learn about Brussels' fascinating history from medieval times to modern EU capital.",
        rating: 4.3,
        price: "€12",
        backgroundImage: "https://images.unsplash.com/photo-1553987410-3c1bcc0a1a4b?w=800&h=400&fit=crop"
      },
      { 
        id: "b4", 
        time: "14:00", 
        title: "Chez Léon", 
        type: "restaurant", 
        location: "Rue des Bouchers 18",
        tags: ["Belgian", "Mussels"],
        emoji: "🦪",
        description: "Famous brasserie serving traditional Belgian mussels and frites since 1893.",
        rating: 4.2,
        price: "€€€",
        backgroundImage: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop"
      },
      { 
        id: "b5", 
        time: "16:00", 
        title: "Belgian Chocolate Workshop", 
        type: "entertainment", 
        location: "Rue de l'Étuve 41",
        tags: ["Chocolate", "Workshop"],
        hasDocument: true,
        emoji: "🍫",
        description: "Learn the art of Belgian chocolate making in this hands-on workshop experience.",
        rating: 4.5,
        price: "€45",
        backgroundImage: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=400&fit=crop"
      },
      { 
        id: "b6", 
        time: "18:00", 
        title: "Brussels Park Walk", 
        type: "nature", 
        location: "Parc de Bruxelles",
        tags: ["Nature", "Walking", "Green Space"],
        emoji: "🌲",
        description: "Peaceful walk through Brussels' historic central park near the Royal Palace.",
        rating: 4.2,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
      },
      { 
        id: "b7", 
        time: "20:00", 
        title: "Local Beer Tasting Group", 
        type: "social", 
        location: "Delirium Café",
        tags: ["Social", "Beer", "Meeting Locals"],
        emoji: "🍺",
        description: "Join locals and travelers for a guided Belgian beer tasting experience.",
        rating: 4.4,
        price: "€25",
        backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
      }
    ],
    routes: [
      {
        id: "r2-1",
        fromActivityId: "b1",
        toActivityId: "b2",
        defaultMode: "walk",
        totalTime: "3 min",
        totalDistance: "200m",
        steps: [
          { id: "r2-1s1", mode: "walk", description: "Short walk from Grand Place", duration: "3 min" }
        ]
      },
      {
        id: "r2-2",
        fromActivityId: "b2",
        toActivityId: "b3",
        defaultMode: "walk",
        totalTime: "2 min",
        totalDistance: "150m",
        steps: [
          { id: "r2-2s1", mode: "walk", description: "Walk to restaurant district", duration: "2 min" }
        ]
      },
      {
        id: "r2-3",
        fromActivityId: "b3",
        toActivityId: "b4",
        defaultMode: "metro",
        totalTime: "12 min",
        totalDistance: "1.8km",
        totalCost: "€2.10",
        steps: [
          { id: "r2-3s1", mode: "walk", description: "Walk to Bourse/Beurs Metro", duration: "3 min" },
          { id: "r2-3s2", mode: "metro", description: "Metro Line 1 to Parc (2 stops)", duration: "5 min" },
          { id: "r2-3s3", mode: "walk", description: "Walk to Royal Museums", duration: "4 min" }
        ]
      },
      {
        id: "r2-4",
        fromActivityId: "b4",
        toActivityId: "b5",
        defaultMode: "bus",
        totalTime: "14 min",
        totalDistance: "2.2km",
        totalCost: "€2.10",
        steps: [
          { id: "r2-4s1", mode: "walk", description: "Walk to Palais bus stop", duration: "2 min" },
          { id: "r2-4s2", mode: "bus", description: "Bus 27 towards Centre", duration: "8 min" },
          { id: "r2-4s3", mode: "walk", description: "Walk to Manneken Pis", duration: "4 min" }
        ]
      },
      {
        id: "r2-5",
        fromActivityId: "b5",
        toActivityId: "b6",
        defaultMode: "walk",
        totalTime: "4 min",
        totalDistance: "300m",
        steps: [
          { id: "r2-5s1", mode: "walk", description: "Walk through old town streets to Delirium", duration: "4 min" }
        ]
      },
      {
        id: "r2-6",
        fromActivityId: "b6",
        toActivityId: "b7",
        defaultMode: "walk",
        totalTime: "8 min",
        totalDistance: "650m",
        steps: [
          { id: "r2-6s1", mode: "walk", description: "Walk from Parc de Bruxelles to Delirium Café", duration: "8 min" }
        ]
      }
    ]
  },
  {
    id: "3",
    date: "Day 3 – Paris",
    city: "Paris",
    activities: [
      { 
        id: "p1", 
        time: "08:30", 
        title: "Train to Paris", 
        type: "transport", 
        location: "Brussels-Midi to Gare du Nord",
        tags: ["Transport", "Thalys", "High-speed"],
        hasDocument: true,
        emoji: "🚄",
        description: "High-speed Thalys train journey from Brussels to Paris in just 1h22m.",
        rating: 4.5,
        price: "€89",
        backgroundImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop"
      },
      { 
        id: "p2", 
        time: "10:30", 
        title: "Eiffel Tower Visit", 
        type: "attraction", 
        location: "Champ de Mars, 7th Arrondissement",
        tags: ["Tourist", "Photography"],
        hasDocument: true,
        emoji: "🗼",
        description: "Iconic iron lattice tower and symbol of Paris. Take the elevator to the top for breathtaking views of the city.",
        rating: 4.6,
        phone: "+33 8 92 70 12 39",
        website: "tour-eiffel.fr",
        price: "€29.40",
        notes: "Book tickets in advance to skip the line. Best photos from Trocadéro.",
        backgroundImage: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=400&fit=crop"
      },
      { 
        id: "p3", 
        time: "13:00", 
        title: "French Language Exchange", 
        type: "culture", 
        location: "Shakespeare & Company Café",
        tags: ["Language", "Culture", "Learning"],
        emoji: "🇫🇷",
        description: "Practice French with locals and fellow travelers in this famous literary café.",
        rating: 4.2,
        price: "€5",
        backgroundImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop"
      },
      { 
        id: "p4", 
        time: "14:30", 
        title: "Lunch at Café de l'Homme", 
        type: "restaurant", 
        location: "Place du Trocadéro",
        tags: ["French", "Fine Dining"],
        emoji: "🥂",
        description: "Sophisticated French restaurant with stunning Eiffel Tower views. Perfect for a memorable lunch experience.",
        rating: 4.4,
        price: "€€€€",
        backgroundImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop"
      },
      { 
        id: "p5", 
        time: "16:30", 
        title: "Tuileries Garden Walk", 
        type: "nature", 
        location: "Jardin des Tuileries",
        tags: ["Nature", "Gardens", "Walking"],
        emoji: "🌷",
        description: "Stroll through Paris's most famous formal garden between the Louvre and Place de la Concorde.",
        rating: 4.5,
        price: "Free",
        backgroundImage: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=400&fit=crop"
      },
      { 
        id: "p6", 
        time: "18:00", 
        title: "Louvre Museum", 
        type: "culture", 
        location: "1st Arrondissement",
        tags: ["Art", "Culture", "Museums"],
        hasDocument: true,
        emoji: "🖼️",
        description: "World's largest art museum featuring the Mona Lisa and countless masterpieces.",
        rating: 4.7,
        price: "€17",
        backgroundImage: "https://images.unsplash.com/photo-1566139992693-d29dcaa51722?w=800&h=400&fit=crop"
      },
      { 
        id: "p7", 
        time: "20:30", 
        title: "Parisian Dinner Party", 
        type: "social", 
        location: "Local Apartment",
        tags: ["Social", "Locals", "Home Cooking"],
        emoji: "🍾",
        description: "Join a local family for authentic home-cooked French dinner and cultural exchange.",
        rating: 4.8,
        price: "€40",
        backgroundImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
      },
      { 
        id: "p8", 
        time: "22:30", 
        title: "Hotel Le Marais Check-in", 
        type: "hotel", 
        location: "4th Arrondissement",
        tags: ["Accommodation", "Rest", "Boutique Hotel"],
        hasDocument: true,
        emoji: "🏨",
        description: "Charming boutique hotel in the historic Marais district.",
        rating: 4.3,
        price: "€180/night",
        backgroundImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop"
      }
    ],
    routes: [
      {
        id: "r3-1",
        fromActivityId: "p1",
        toActivityId: "p2",
        defaultMode: "walk",
        totalTime: "8 min",
        totalDistance: "650m",
        steps: [
          { id: "r3-1s1", mode: "walk", description: "Walk northeast on Av. Gustave Eiffel", duration: "3 min" },
          { id: "r3-1s2", mode: "walk", description: "Cross Pont de Bir-Hakeim", duration: "2 min" },
          { id: "r3-1s3", mode: "walk", description: "Walk to Place du Trocadéro", duration: "3 min" }
        ]
      },
      {
        id: "r3-2",
        fromActivityId: "p2",
        toActivityId: "p3",
        defaultMode: "metro",
        totalTime: "12 min",
        totalDistance: "2.1km",
        totalCost: "€2.15",
        steps: [
          { id: "r3-2s1", mode: "walk", description: "Walk to Trocadéro Metro", duration: "2 min" },
          { id: "r3-2s2", mode: "metro", description: "Line 9 to Bir-Hakeim (3 stops)", duration: "7 min" },
          { id: "r3-2s3", mode: "walk", description: "Walk to Port de la Bourdonnais", duration: "3 min" }
        ]
      },
      {
        id: "r3-3",
        fromActivityId: "p3",
        toActivityId: "p4",
        defaultMode: "metro",
        totalTime: "18 min",
        totalDistance: "3.2km",
        totalCost: "€2.15",
        steps: [
          { id: "r3-3s1", mode: "walk", description: "Walk to Bir-Hakeim Metro", duration: "3 min" },
          { id: "r3-3s2", mode: "metro", description: "Line 6 to Châtelet (5 stops)", duration: "11 min" },
          { id: "r3-3s3", mode: "walk", description: "Walk to Louvre Museum", duration: "4 min" }
        ]
      },
      {
        id: "r3-4",
        fromActivityId: "p4",
        toActivityId: "p5",
        defaultMode: "bus",
        totalTime: "22 min",
        totalDistance: "2.8km",
        totalCost: "€2.15",
        steps: [
          { id: "r3-4s1", mode: "walk", description: "Walk to Louvre-Rivoli bus stop", duration: "3 min" },
          { id: "r3-4s2", mode: "bus", description: "Bus 69 towards Père Lachaise", duration: "14 min" },
          { id: "r3-4s3", mode: "walk", description: "Walk to L'Ami Jean", duration: "5 min" }
        ]
      },
      {
        id: "r3-5",
        fromActivityId: "p5",
        toActivityId: "p6",
        defaultMode: "metro",
        totalTime: "16 min",
        totalDistance: "2.5km",
        totalCost: "€2.15",
        steps: [
          { id: "r3-5s1", mode: "walk", description: "Walk to Père Lachaise Metro", duration: "4 min" },
          { id: "r3-5s2", mode: "metro", description: "Line 2 to Place de Clichy (3 stops)", duration: "8 min" },
          { id: "r3-5s3", mode: "walk", description: "Walk to Sacré-Cœur", duration: "4 min" }
        ]
      },
      {
        id: "r3-6",
        fromActivityId: "p6",
        toActivityId: "p7",
        defaultMode: "walk",
        totalTime: "12 min",
        totalDistance: "950m",
        steps: [
          { id: "r3-6s1", mode: "walk", description: "Walk down Montmartre to local family's home", duration: "12 min" }
        ]
      },
      {
        id: "r3-7",
        fromActivityId: "p7",
        toActivityId: "p8",
        defaultMode: "metro",
        totalTime: "18 min",
        totalDistance: "2.8km",
        totalCost: "€2.15",
        steps: [
          { id: "r3-7s1", mode: "walk", description: "Walk to Anvers Metro", duration: "5 min" },
          { id: "r3-7s2", mode: "metro", description: "Line 2 to Châtelet (2 stops)", duration: "8 min" },
          { id: "r3-7s3", mode: "walk", description: "Walk to Hotel Le Marais", duration: "5 min" }
        ]
      }
    ]
  }
]

// Transportation chunk component showing travel between activities
const TravelChunk: React.FC<{ 
  route: TravelRoute; 
  fromPlace: string; 
  toPlace: string; 
  colors: any; 
  spacing: any;
  expanded: boolean;
  onToggle: () => void;
  layoutDensity: LayoutDensity;
}> = ({ route, fromPlace, toPlace, colors, spacing, expanded, onToggle, layoutDensity }) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "walk": return "🚶"
      case "metro": return "🚇"
      case "bus": return "🚌"
      case "car": return "🚗"
      default: return "🚶"
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.border + "20",
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
        borderRadius: 12,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Main route info */}
      <Pressable onPress={onToggle} style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: colors.textDim, marginRight: spacing.sm }}>
          {getModeIcon(route.defaultMode)} to {toPlace}
        </Text>
        <View style={{ marginLeft: "auto", flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 12, color: colors.textDim, marginRight: spacing.xs }}>
            ⏱️ {route.totalTime}
          </Text>
          {route.totalCost && (
            <Text style={{ fontSize: 12, color: colors.textDim, marginLeft: spacing.xs }}>
              • {route.totalCost}
            </Text>
          )}
          <Text style={{ fontSize: 16, color: colors.textDim, marginLeft: spacing.sm }}>
            {expanded ? "▲" : "▼"}
          </Text>
        </View>
      </Pressable>

      {/* Expanded route steps */}
      {expanded && (
        <View style={{ marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }}>
          {route.steps.map((step, index) => (
            <View key={step.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: spacing.xs }}>
              <Text style={{ fontSize: 12, color: colors.textDim, marginRight: spacing.sm }}>
                {getModeIcon(step.mode)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textDim, flex: 1 }}>
                {step.description}
              </Text>
              <Text style={{ fontSize: 12, color: colors.textDim }}>
                {step.duration}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

// Draggable activity card component matching the mockup style
const DraggableItem: React.FC<{ 
  item: Activity; 
  colors: any; 
  spacing: any;
  layoutDensity: LayoutDensity;
}> = ({ item, colors, spacing, layoutDensity }) => {
  const drag = useReorderableDrag()
  
  // Get density-specific styles
  const styles = densityStyles[layoutDensity]

  return (
    <Pressable
      style={{
        backgroundColor: colors.background,
        marginHorizontal: spacing.md,
        marginBottom: styles.marginBottom,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        padding: styles.padding,
        minHeight: layoutDensity === 'condensed' ? 60 : 80,
      }}
      onLongPress={drag}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {/* Time and Emoji */}
        <View style={{ marginRight: spacing.sm, alignItems: "center" }}>
          <Text style={{ 
            fontSize: styles.textSize.subtitle, 
            fontWeight: "600", 
            color: colors.text, 
            marginBottom: 4 
          }}>
            {item.time}
          </Text>
          <Text style={{ fontSize: styles.emojiSize }}>{item.emoji}</Text>
        </View>
        
        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: styles.textSize.title, 
            fontWeight: "600", 
            color: colors.text, 
            marginBottom: 4 
          }}>
            {item.title}
          </Text>
          {item.location && (
            <Text style={{ 
              fontSize: styles.textSize.subtitle, 
              color: colors.textDim 
            }}>
              {item.location}
            </Text>
          )}
          {styles.showTags && item.tags && item.tags.length > 0 && (
            <View style={{ flexDirection: "row", marginTop: 4, flexWrap: "wrap" }}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.border,
                    paddingHorizontal: spacing.xs,
                    paddingVertical: 2,
                    borderRadius: 8,
                    marginRight: spacing.xs,
                    marginBottom: spacing.xs,
                  }}
                >
                  <Text style={{ fontSize: 11, color: colors.textDim }}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Document indicator */}
        {item.hasDocument && (
          <View style={{ marginLeft: spacing.sm }}>
            <View
              style={{
                width: 24,
                height: 24,
                backgroundColor: colors.tint + "20",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 12, color: colors.tint }}>📄</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  )
}

export const ItineraryScreen = () => {
  const navigation = useNavigation() as any
  const { theme } = useAppTheme()
  const { colors, spacing } = theme
  const topContainerInsets = useSafeAreaInsets()
  
  // Updated state management with LayoutDensity type system
  const [layoutDensity, setLayoutDensity] = useState<LayoutDensity>('medium')
  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set())
  
  // State for the actual itinerary data that can be modified
  const [itineraryData, setItineraryData] = useState<Day[]>(mockItinerary)

  const handleReorder = useCallback(({ from, to }: ReorderableListReorderEvent) => {
    console.log('🔄 Reorder triggered:', { from, to })
    
    // Get the flattened data structure from the current state
    const flattenedData = itineraryData.flatMap((day, dayIndex) => {
      const dayInfo = getDayInfo(day)
      const items: Array<{
        id: string
        type: 'day-header' | 'activity'
        day: Day
        dayIndex: number
        dayInfo?: { weekday: string; date: string }
        activity?: Activity
        activityIndex?: number
      }> = []
      
      // Add day header as a non-draggable item
      items.push({
        id: `day-${day.id}`,
        type: 'day-header',
        day,
        dayIndex,
        dayInfo
      })
      
      // Add activities as draggable items
      day.activities.forEach((activity, activityIndex) => {
        items.push({
          id: `activity-${activity.id}`,
          type: 'activity',
          activity,
          day,
          dayIndex,
          activityIndex
        })
      })
      
      return items
    })
    
    // Rule 1: Position 0 protection - never allow drops above the first day header
    if (to === 0) {
      const adjustedTo = 1
      console.log('🛡️ Position 0 protection: redirecting from', to, 'to', adjustedTo)
      handleReorderInternal({ from, to: adjustedTo }, flattenedData)
      return
    }
    
    // Rule 2: Day header handling - dynamic positioning based on context
    const toItem = flattenedData[to]
    if (toItem?.type === 'day-header') {
      const targetPosition = calculateValidPositionForDayHeader(to, flattenedData)
      if (targetPosition !== null) {
        console.log('🎯 Day header drop, redirecting to valid position:', targetPosition)
        handleReorderInternal({ from, to: targetPosition }, flattenedData)
        return
      }
    }
    
    // Rule 3: Normal reorder - proceed with the original logic
    console.log('✅ Normal reorder: proceeding with', { from, to })
    handleReorderInternal({ from, to }, flattenedData)
  }, [itineraryData])

  // Dynamic position calculation for day header drops
  const calculateValidPositionForDayHeader = useCallback((dayHeaderIndex: number, flattenedData: any[]) => {
    // Find the previous day's last activity
    let previousDayLastActivity = null
    let currentDayIndex = -1
    
    // Walk backwards to find the previous day's structure
    for (let i = dayHeaderIndex - 1; i >= 0; i--) {
      const item = flattenedData[i]
      if (item?.type === 'day-header') {
        // Found the previous day header
        currentDayIndex = i
        break
      }
      if (item?.type === 'activity' && previousDayLastActivity === null) {
        // Found the last activity of the previous day
        previousDayLastActivity = i
      }
    }
    
    if (previousDayLastActivity !== null) {
      // Place after the last activity of the previous day
      return previousDayLastActivity
    }
    
    // Fallback: if no previous activity found, place at the beginning of the current day
    // Find the first activity after this day header
    for (let i = dayHeaderIndex + 1; i < flattenedData.length; i++) {
      if (flattenedData[i]?.type === 'activity') {
        return i
      }
    }
    
    // Last resort: place at the very end
    return flattenedData.length - 1
  }, [])

  // Internal handler that processes the actual reordering logic
  const handleReorderInternal = useCallback(({ from, to }: { from: number; to: number }, flattenedData: any[]) => {
    console.log('🔧 Internal reorder processing:', { from, to })
    
    // Find the source and target items
    const fromItem = flattenedData[from]
    const toItem = flattenedData[to]
    
    console.log('📍 From item:', fromItem)
    console.log('📍 To item:', toItem)
    
    // Only allow reordering activities, not day headers
    if (fromItem.type !== 'activity' || toItem.type !== 'activity') {
      console.log('❌ Cannot reorder day headers')
      return
    }
    
    // Allow cross-day reordering - remove the same-day restriction
    const isSameDay = fromItem.dayIndex === toItem.dayIndex
    console.log('🌍 Reorder type:', isSameDay ? 'Same-day' : 'Cross-day', { 
      fromDay: fromItem.dayIndex, 
      toDay: toItem.dayIndex
    })
    
    // Create a deep copy of the itinerary data
    const newItineraryData = [...itineraryData]
    
    if (isSameDay) {
      // Same-day reorder - simpler logic
      const day = newItineraryData[fromItem.dayIndex!]
      const newActivities = [...day.activities]
      
      console.log('📋 Same-day - Before:', newActivities.map(a => a.title))
      
      // Remove from original position and insert at new position
      const [movedActivity] = newActivities.splice(fromItem.activityIndex!, 1)
      newActivities.splice(toItem.activityIndex!, 0, movedActivity)
      
      console.log('📋 Same-day - After:', newActivities.map(a => a.title))
      
      // Update the day's activities
      newItineraryData[fromItem.dayIndex!] = {
        ...day,
        activities: newActivities
      }
    } else {
      // Cross-day reorder - more complex logic
      // Remove activity from source day
      const sourceDay = newItineraryData[fromItem.dayIndex!]
      const sourceActivities = [...sourceDay.activities]
      const [movedActivity] = sourceActivities.splice(fromItem.activityIndex!, 1)
      
      console.log('📤 Removed from day', fromItem.dayIndex, '-', movedActivity.title)
      
      // Update source day
      newItineraryData[fromItem.dayIndex!] = {
        ...sourceDay,
        activities: sourceActivities
      }
      
      // Add activity to target day
      const targetDay = newItineraryData[toItem.dayIndex!]
      const targetActivities = [...targetDay.activities]
      
      // Calculate the actual position within the target day's activities
      // Find all activities in the target day that come before the target position
      let targetDayActivityIndex = 0
      for (let i = 0; i < to; i++) {
        const item = flattenedData[i]
        if (item?.dayIndex === toItem.dayIndex && item?.type === 'activity') {
          targetDayActivityIndex++
        }
      }
      
      // If we're dropping at the very end of the target day (after all activities),
      // place it at the end of the activities array
      if (targetDayActivityIndex >= targetActivities.length) {
        targetDayActivityIndex = targetActivities.length
      }
      
      console.log('🎯 Target:', {
        day: toItem.dayIndex,
        position: targetDayActivityIndex,
        totalActivities: targetActivities.length
      })
      
      targetActivities.splice(targetDayActivityIndex, 0, movedActivity)
      
      console.log('📥 Added to day', toItem.dayIndex, '-', movedActivity.title, 'at position', targetDayActivityIndex)
      
      // Update target day
      newItineraryData[toItem.dayIndex!] = {
        ...targetDay,
        activities: targetActivities
      }
    }
    
    // Update the state with the new data
    setItineraryData(newItineraryData)
    console.log('✅', isSameDay ? 'Same-day' : 'Cross-day', 'reorder completed')
  }, [itineraryData])

  const toggleRoute = useCallback((routeId: string) => {
    setExpandedRoutes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(routeId)) {
        newSet.delete(routeId)
      } else {
        newSet.add(routeId)
      }
      return newSet
    })
  }, [])

  const getRouteForActivity = useCallback((day: Day, activityId: string) => {
    return day.routes.find((route) => route.fromActivityId === activityId)
  }, [])

  // Helper function to get day info for display
  const getDayInfo = (day: Day) => {
    const dayMap: { [key: string]: { weekday: string; date: string } } = {
      "1": { weekday: "Monday", date: "Dec 9" },
      "2": { weekday: "Tuesday", date: "Dec 10" },
      "3": { weekday: "Wednesday", date: "Dec 11" }
    }
    return dayMap[day.id] || { weekday: `Day ${day.id}`, date: "" }
  }

  if (!itineraryData.length) {
      return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No itinerary data</Text>
        </View>
      )
  }

    return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, topContainerInsets]}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.text }}>
            Tokyo
        </Text>
          <Text style={{ fontSize: 16, color: colors.textDim, marginTop: 4 }}>
            Multi-day Trip
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Layout Changer */}
        <TouchableOpacity
            onPress={() => setShowLayoutMenu(!showLayoutMenu)}
          style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: showLayoutMenu ? colors.tint + "20" : colors.border + "20",
          justifyContent: "center",
          alignItems: "center",
              marginRight: spacing.sm,
              borderWidth: 1,
              borderColor: showLayoutMenu ? colors.tint : colors.border,
        }}
      >
            <Text style={{ fontSize: 18, color: showLayoutMenu ? colors.tint : colors.text }}>
              {layoutDensity === 'condensed' ? '☰' : layoutDensity === 'medium' ? '☰' : '⊞'}
        </Text>
        </TouchableOpacity>
          
          {/* Settings - Navigate to Ignite Components Showcase */}
          <TouchableOpacity 
            onPress={() => {
              console.log("Settings button pressed")
              console.log("Navigation object:", navigation)
              try {
                navigation.navigate("Demo", { screen: "DemoShowroom" })
                console.log("Navigation attempted successfully")
              } catch (error) {
                console.error("Navigation error:", error)
              }
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.border + "20",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 20, color: colors.text }}>⚙️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Layout Menu Slideout */}
        {showLayoutMenu && (
          <>
            {/* Backdrop to close menu when tapping outside */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}
              onPress={() => setShowLayoutMenu(false)}
              activeOpacity={0}
            />
            
      <View
              style={{
                position: "absolute",
                top: 60,
                right: spacing.md,
            backgroundColor: colors.background,
                borderRadius: 12,
                padding: spacing.sm,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 5,
                zIndex: 1000,
              }}
            >
              {/* Compact Layout Option */}
              <TouchableOpacity
                onPress={() => {
                  setLayoutDensity('condensed')
                  setShowLayoutMenu(false)
                }}
            style={{
              flexDirection: "row",
              alignItems: "center",
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  borderRadius: 8,
                  backgroundColor: layoutDensity === 'condensed' ? colors.tint + "20" : 'transparent',
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: spacing.sm }}>☰</Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: layoutDensity === 'condensed' ? colors.tint : colors.text,
                  fontWeight: layoutDensity === 'condensed' ? '600' : '400'
                }}>
                  Compact
                </Text>
            </TouchableOpacity>

              {/* List Layout Option */}
              <TouchableOpacity
                onPress={() => {
                  setLayoutDensity('medium')
                  setShowLayoutMenu(false)
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  borderRadius: 8,
                  backgroundColor: layoutDensity === 'medium' ? colors.tint + "20" : 'transparent',
                  marginBottom: spacing.xs,
                }}
              >
                <Text style={{ fontSize: 16, marginRight: spacing.sm }}>☰</Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: layoutDensity === 'medium' ? colors.tint : colors.text,
                  fontWeight: layoutDensity === 'medium' ? '600' : '400'
                }}>
                  List
              </Text>
              </TouchableOpacity>
              
              {/* Cards Layout Option */}
              <TouchableOpacity
                onPress={() => {
                  setLayoutDensity('expanded')
                  setShowLayoutMenu(false)
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  borderRadius: 8,
                  backgroundColor: layoutDensity === 'expanded' ? colors.tint + "20" : 'transparent',
                }}
              >
                <Text style={{ fontSize: 16, marginRight: spacing.sm }}>⊞</Text>
                <Text style={{ 
                  fontSize: 14, 
                  color: layoutDensity === 'expanded' ? colors.tint : colors.text,
                  fontWeight: layoutDensity === 'expanded' ? '600' : '400'
                }}>
                  Cards
                </Text>
            </TouchableOpacity>
          </View>
          </>
        )}
      </View>

      {/* Multi-day Reorderable List */}
      <View style={{ flex: 1 }}>
        <ReorderableList
          data={itineraryData.flatMap((day, dayIndex) => {
            const dayInfo = getDayInfo(day)
            const items: Array<{
              id: string
              type: 'day-header' | 'activity'
              day: Day
              dayIndex: number
              dayInfo?: { weekday: string; date: string }
              activity?: Activity
              activityIndex?: number
            }> = []
            
            // Add day header as a non-draggable item
            items.push({
              id: `day-${day.id}`,
              type: 'day-header',
              day,
              dayIndex,
              dayInfo
            })
            
            // Add activities as draggable items
            day.activities.forEach((activity, activityIndex) => {
              items.push({
                id: `activity-${activity.id}`,
                type: 'activity',
                activity,
                day,
                dayIndex,
                activityIndex
              })
            })
            
            return items
          })}
          onReorder={handleReorder}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }: { item: any; index: number }) => {
            if (item.type === 'day-header') {
              return (
                <View key={item.id}>
                  {/* Day Header - scrolls with content */}
      <View
        style={{
          paddingHorizontal: spacing.md,
                      paddingVertical: spacing.md,
                      borderBottomWidth: item.dayIndex < itineraryData.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border + "30",
          backgroundColor: colors.background,
        }}
      >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
                        <Text style={{ fontSize: 20, fontWeight: "600", color: colors.text }}>
                          {item.dayInfo?.weekday} <Text style={{ color: colors.textDim }}>{item.dayInfo?.date}</Text>
            </Text>
                        <Text style={{ color: colors.textDim, marginTop: 6 }}>{item.day.city}</Text>
          </View>
          <TouchableOpacity>
            <Text style={{ color: colors.tint, fontSize: 16 }}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>
                </View>
              )
            } else if (item.type === 'activity') {
              // Type guard to ensure we have the required properties
              if (!item.activity || typeof item.activityIndex !== 'number') {
                return null
              }
              
              // Activity item
              const { activity, day, activityIndex } = item
              const route = getRouteForActivity(day, activity.id)
              const isLastActivity = activityIndex === day.activities.length - 1
              
            return (
              <View key={item.id}>
                  {/* Activity Card */}
                  <DraggableItem item={activity} colors={colors} spacing={spacing} layoutDensity={layoutDensity} />
                  
                  {/* Transportation Chunk (if not last activity and route exists) */}
                  {!isLastActivity && route && densityStyles[layoutDensity].transportVisibility !== 'minimal' && (
                    <TravelChunk
                      route={route}
                      fromPlace={activity.title}
                      toPlace={day.activities[activityIndex + 1]?.title || "Next stop"}
                      colors={colors}
                      spacing={spacing}
                      expanded={expandedRoutes.has(route.id)}
                      onToggle={() => toggleRoute(route.id)}
                      layoutDensity={layoutDensity}
                  />
                )}
              </View>
            )
            }
            
            return null
          }}
        />
      </View>
    </View>
  )
}
