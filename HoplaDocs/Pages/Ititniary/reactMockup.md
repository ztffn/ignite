import React, { useState, useEffect } from 'react';
import { ArrowLeft, Rows3, List, Grid3X3, User } from 'lucide-react';
import ActivityCard from './ActivityCard';
import ActivityDetail from './ActivityDetail';
import TravelChunk from './TravelChunk';
import AddStopModal from './AddStopModal';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface Activity {
  id: string;
  time: string;
  title: string;
  type: 'restaurant' | 'attraction' | 'transport' | 'hotel' | 'note' | 'shopping' | 'wine' | 'nature' | 'entertainment' | 'coffee' | 'medical' | 'culture' | 'social' | 'museum';
  location?: string;
  tags?: string[];
  hasDocument?: boolean;
  emoji: string;
  description?: string;
  rating?: number;
  phone?: string;
  website?: string;
  price?: string;
  notes?: string;
  backgroundImage?: string;
}

interface RouteStep {
  id: string;
  mode: 'walk' | 'metro' | 'bus' | 'car';
  description: string;
  duration: string;
  distance?: string;
}

interface TravelRoute {
  id: string;
  fromActivityId: string;
  toActivityId: string;
  defaultMode: 'walk' | 'metro' | 'bus' | 'car';
  totalTime: string;
  totalDistance: string;
  totalCost?: string;
  steps: RouteStep[];
  offline?: boolean;
}

interface Day {
  id: string;
  date: string;
  city: string;
  activities: Activity[];
  routes: TravelRoute[];
}

const mockItinerary: Day[] = [
  {
    id: '1',
    date: 'Day 1 – Amsterdam',
    city: 'Amsterdam',
    activities: [
      { 
        id: 'a1', 
        time: '09:30', 
        title: 'Hotel Check-in', 
        type: 'hotel', 
        location: 'Lloyd Hotel & Cultural Embassy',
        tags: ['Accommodation', 'Rest'],
        emoji: '🏨',
        description: 'Unique cultural hotel in Amsterdam\'s Eastern Docklands with artistic rooms.',
        rating: 4.1,
        price: '€150/night',
        backgroundImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'
      },
      { 
        id: 'a2', 
        time: '10:30', 
        title: 'Anne Frank House', 
        type: 'attraction', 
        location: 'Prinsengracht 263-267',
        tags: ['History', 'Culture'],
        hasDocument: true,
        emoji: '📖',
        description: 'Moving museum in the actual house where Anne Frank wrote her famous diary during WWII.',
        rating: 4.5,
        phone: '+31 20 556 7105',
        website: 'annefrank.org',
        price: '€16',
        notes: 'Book online in advance - tickets sell out quickly. Allow 1.5 hours.',
        backgroundImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop'
      },
      { 
        id: 'a3', 
        time: '12:30', 
        title: 'Café de Reiger', 
        type: 'restaurant', 
        location: 'Nieuwe Leliestraat 34',
        tags: ['Dutch', 'Local'],
        emoji: '🍻',
        description: 'Traditional Amsterdam brown café serving hearty Dutch classics and great local beer.',
        rating: 4.3,
        price: '€€',
        backgroundImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop'
      },
      { 
        id: 'a4', 
        time: '14:30', 
        title: 'Vondelpark Stroll', 
        type: 'nature', 
        location: 'Vondelpark',
        tags: ['Nature', 'Walking', 'Outdoors'],
        emoji: '🌳',
        description: 'Amsterdam\'s most popular park - perfect for a relaxing walk and people watching.',
        rating: 4.4,
        price: 'Free',
        backgroundImage: 'https://images.unsplash.com/photo-1523043737299-8ebe6b4a6520?w=800&h=400&fit=crop'
      },
      { 
        id: 'a5', 
        time: '16:00', 
        title: 'Travel Buddy Meetup', 
        type: 'social', 
        location: 'Café Central',
        tags: ['Social', 'Meeting', 'Friends'],
        emoji: '👥',
        description: 'Connect with fellow travelers and locals at this weekly social meetup.',
        rating: 4.2,
        price: 'Free',
        backgroundImage: 'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=800&h=400&fit=crop'
      },
      { 
        id: 'a6', 
        time: '17:30', 
        title: 'Travel Notes Review', 
        type: 'note', 
        location: 'Hotel Room',
        tags: ['Planning', 'Notes'],
        emoji: '📝',
        description: 'Review today\'s experiences and plan tomorrow\'s activities.',
        rating: 0,
        price: 'Free',
        backgroundImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop'
      },
      { 
        id: 'a7', 
        time: '19:00', 
        title: 'Restaurant Greetje', 
        type: 'restaurant', 
        location: 'Peperstraat 23',
        tags: ['Fine Dining', 'Modern Dutch'],
        emoji: '🍽️',
        description: 'Innovative restaurant serving modern interpretations of traditional Dutch cuisine.',
        rating: 4.6,
        price: '€€€€',
        backgroundImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=400&fit=crop'
      }
    ],
    routes: [
      {
        id: 'r1-1',
        fromActivityId: 'a1',
        toActivityId: 'a2',
        defaultMode: 'walk',
        totalTime: '12 min',
        totalDistance: '850m',
        steps: [
          { id: 'r1-1s1', mode: 'walk', description: 'Walk south on Prinsengracht', duration: '5 min' },
          { id: 'r1-1s2', mode: 'walk', description: 'Turn right on Leliegracht', duration: '3 min' },
          { id: 'r1-1s3', mode: 'walk', description: 'Continue to Nieuwe Leliestraat', duration: '4 min' }
        ]
      },
      {
        id: 'r1-2',
        fromActivityId: 'a2',
        toActivityId: 'a3',
        defaultMode: 'metro',
        totalTime: '15 min',
        totalDistance: '2.3km',
        totalCost: '€3.20',
        steps: [
          { id: 'r1-2s1', mode: 'walk', description: 'Walk to Nieuwmarkt Metro Station', duration: '4 min' },
          { id: 'r1-2s2', mode: 'metro', description: 'Metro 51, 53, 54 to Centraal Station', duration: '8 min' },
          { id: 'r1-2s3', mode: 'walk', description: 'Walk to canal cruise departure point', duration: '3 min' }
        ]
      },
      {
        id: 'r1-3',
        fromActivityId: 'a3',
        toActivityId: 'a4',
        defaultMode: 'walk',
        totalTime: '5 min',
        totalDistance: '400m',
        steps: [
          { id: 'r1-3s1', mode: 'walk', description: 'Walk into Jordaan district', duration: '5 min' }
        ]
      },
      {
        id: 'r1-4',
        fromActivityId: 'a4',
        toActivityId: 'a5',
        defaultMode: 'bus',
        totalTime: '18 min',
        totalDistance: '3.1km',
        totalCost: '€3.20',
        steps: [
          { id: 'r1-4s1', mode: 'walk', description: 'Walk to Marnixstraat bus stop', duration: '3 min' },
          { id: 'r1-4s2', mode: 'bus', description: 'Bus 18 towards Centrum', duration: '12 min' },
          { id: 'r1-4s3', mode: 'walk', description: 'Walk to Peperstraat', duration: '3 min' }
        ]
      }
    ]
  },
  {
    id: '2',
    date: 'Day 2 – Brussels',
    city: 'Brussels',
    activities: [
      { 
        id: 'b1', 
        time: '09:00', 
        title: 'Medical Check-in', 
        type: 'medical', 
        location: 'Travel Health Clinic',
        tags: ['Health', 'Safety', 'Emergency'],
        hasDocument: true,
        emoji: '🏥',
        description: 'Routine travel health check and prescription refill at local clinic.',
        rating: 4.0,
        price: '€35',
        backgroundImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
      },
      { 
        id: 'b2', 
        time: '10:30', 
        title: 'Grand Place', 
        type: 'attraction', 
        location: 'City Center',
        tags: ['Architecture', 'UNESCO'],
        emoji: '🏰',
        description: 'Breathtaking medieval town square considered one of the most beautiful in Europe.',
        rating: 4.7,
        price: 'Free',
        notes: 'Best light for photos in the morning. Check for flower carpet events.',
        backgroundImage: 'https://images.unsplash.com/photo-1559113202-c916b8e44373?w=800&h=400&fit=crop'
      },
      { 
        id: 'b3', 
        time: '12:00', 
        title: 'Brussels History Museum', 
        type: 'museum', 
        location: 'Rue de l\'Empereur 4',
        tags: ['History', 'Culture', 'Education'],
        hasDocument: true,
        emoji: '🏛️',
        description: 'Learn about Brussels\' fascinating history from medieval times to modern EU capital.',
        rating: 4.3,
        price: '€12',
        backgroundImage: 'https://images.unsplash.com/photo-1553987410-3c1bcc0a1a4b?w=800&h=400&fit=crop'
      },
      { 
        id: 'b4', 
        time: '14:00', 
        title: 'Chez Léon', 
        type: 'restaurant', 
        location: 'Rue des Bouchers 18',
        tags: ['Belgian', 'Mussels'],
        emoji: '🦪',
        description: 'Famous brasserie serving traditional Belgian mussels and frites since 1893.',
        rating: 4.2,
        price: '€€€',
        backgroundImage: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop'
      },
      { 
        id: 'b5', 
        time: '16:00', 
        title: 'Belgian Chocolate Workshop', 
        type: 'entertainment', 
        location: 'Rue de l\'Étuve 41',
        tags: ['Chocolate', 'Workshop'],
        hasDocument: true,
        emoji: '🍫',
        description: 'Learn the art of Belgian chocolate making in this hands-on workshop experience.',
        rating: 4.5,
        price: '€45',
        backgroundImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=400&fit=crop'
      },
      { 
        id: 'b6', 
        time: '18:00', 
        title: 'Brussels Park Walk', 
        type: 'nature', 
        location: 'Parc de Bruxelles',
        tags: ['Nature', 'Walking', 'Green Space'],
        emoji: '🌲',
        description: 'Peaceful walk through Brussels\' historic central park near the Royal Palace.',
        rating: 4.2,
        price: 'Free',
        backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop'
      },
      { 
        id: 'b7', 
        time: '20:00', 
        title: 'Local Beer Tasting Group', 
        type: 'social', 
        location: 'Delirium Café',
        tags: ['Social', 'Beer', 'Meeting Locals'],
        emoji: '🍺',
        description: 'Join locals and travelers for a guided Belgian beer tasting experience.',
        rating: 4.4,
        price: '€25',
        backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop'
      }
    ],
    routes: [
      {
        id: 'r2-1',
        fromActivityId: 'b1',
        toActivityId: 'b2',
        defaultMode: 'walk',
        totalTime: '3 min',
        totalDistance: '200m',
        steps: [
          { id: 'r2-1s1', mode: 'walk', description: 'Short walk from Grand Place', duration: '3 min' }
        ]
      },
      {
        id: 'r2-2',
        fromActivityId: 'b2',
        toActivityId: 'b3',
        defaultMode: 'walk',
        totalTime: '2 min',
        totalDistance: '150m',
        steps: [
          { id: 'r2-2s1', mode: 'walk', description: 'Walk to restaurant district', duration: '2 min' }
        ]
      },
      {
        id: 'r2-3',
        fromActivityId: 'b3',
        toActivityId: 'b4',
        defaultMode: 'metro',
        totalTime: '12 min',
        totalDistance: '1.8km',
        totalCost: '€2.10',
        steps: [
          { id: 'r2-3s1', mode: 'walk', description: 'Walk to Bourse/Beurs Metro', duration: '3 min' },
          { id: 'r2-3s2', mode: 'metro', description: 'Metro Line 1 to Parc (2 stops)', duration: '5 min' },
          { id: 'r2-3s3', mode: 'walk', description: 'Walk to Royal Museums', duration: '4 min' }
        ]
      },
      {
        id: 'r2-4',
        fromActivityId: 'b4',
        toActivityId: 'b5',
        defaultMode: 'bus',
        totalTime: '14 min',
        totalDistance: '2.2km',
        totalCost: '€2.10',
        steps: [
          { id: 'r2-4s1', mode: 'walk', description: 'Walk to Palais bus stop', duration: '2 min' },
          { id: 'r2-4s2', mode: 'bus', description: 'Bus 27 towards Centre', duration: '8 min' },
          { id: 'r2-4s3', mode: 'walk', description: 'Walk to Manneken Pis', duration: '4 min' }
        ]
      },
      {
        id: 'r2-5',
        fromActivityId: 'b5',
        toActivityId: 'b6',
        defaultMode: 'walk',
        totalTime: '4 min',
        totalDistance: '300m',
        steps: [
          { id: 'r2-5s1', mode: 'walk', description: 'Walk through old town streets to Delirium', duration: '4 min' }
        ]
      }
    ]
  },
  {
    id: '3',
    date: 'Day 3 – Paris',
    city: 'Paris',
    activities: [
      { 
        id: 'p1', 
        time: '08:30', 
        title: 'Train to Paris', 
        type: 'transport', 
        location: 'Brussels-Midi to Gare du Nord',
        tags: ['Transport', 'Thalys', 'High-speed'],
        hasDocument: true,
        emoji: '🚄',
        description: 'High-speed Thalys train journey from Brussels to Paris in just 1h22m.',
        rating: 4.5,
        price: '€89',
        backgroundImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop'
      },
      { 
        id: 'p2', 
        time: '10:30', 
        title: 'Eiffel Tower Visit', 
        type: 'attraction', 
        location: 'Champ de Mars, 7th Arrondissement',
        tags: ['Tourist', 'Photography'],
        hasDocument: true,
        emoji: '🗼',
        description: 'Iconic iron lattice tower and symbol of Paris. Take the elevator to the top for breathtaking views of the city.',
        rating: 4.6,
        phone: '+33 8 92 70 12 39',
        website: 'tour-eiffel.fr',
        price: '€29.40',
        notes: 'Book tickets in advance to skip the line. Best photos from Trocadéro.',
        backgroundImage: 'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=400&fit=crop'
      },
      { 
        id: 'p3', 
        time: '13:00', 
        title: 'French Language Exchange', 
        type: 'culture', 
        location: 'Shakespeare & Company Café',
        tags: ['Language', 'Culture', 'Learning'],
        emoji: '🇫🇷',
        description: 'Practice French with locals and fellow travelers in this famous literary café.',
        rating: 4.2,
        price: '€5',
        backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
      },
      { 
        id: 'p4', 
        time: '14:30', 
        title: 'Lunch at Café de l\'Homme', 
        type: 'restaurant', 
        location: 'Place du Trocadéro',
        tags: ['French', 'Fine Dining'],
        emoji: '🥂',
        description: 'Sophisticated French restaurant with stunning Eiffel Tower views. Perfect for a memorable lunch experience.',
        rating: 4.4,
        price: '€€€€',
        backgroundImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop'
      },
      { 
        id: 'p5', 
        time: '16:30', 
        title: 'Tuileries Garden Walk', 
        type: 'nature', 
        location: 'Jardin des Tuileries',
        tags: ['Nature', 'Gardens', 'Walking'],
        emoji: '🌷',
        description: 'Stroll through Paris\'s most famous formal garden between the Louvre and Place de la Concorde.',
        rating: 4.5,
        price: 'Free',
        backgroundImage: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=400&fit=crop'
      },
      { 
        id: 'p6', 
        time: '18:00', 
        title: 'Louvre Museum', 
        type: 'culture', 
        location: '1st Arrondissement',
        tags: ['Art', 'Culture', 'Museums'],
        hasDocument: true,
        emoji: '🖼️',
        description: 'World\'s largest art museum featuring the Mona Lisa and countless masterpieces.',
        rating: 4.7,
        price: '€17',
        backgroundImage: 'https://images.unsplash.com/photo-1566139992693-d29dcaa51722?w=800&h=400&fit=crop'
      },
      { 
        id: 'p7', 
        time: '20:30', 
        title: 'Parisian Dinner Party', 
        type: 'social', 
        location: 'Local Apartment',
        tags: ['Social', 'Locals', 'Home Cooking'],
        emoji: '🍾',
        description: 'Join a local family for authentic home-cooked French dinner and cultural exchange.',
        rating: 4.8,
        price: '€40',
        backgroundImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop'
      },
      { 
        id: 'p8', 
        time: '22:30', 
        title: 'Hotel Le Marais Check-in', 
        type: 'hotel', 
        location: '4th Arrondissement',
        tags: ['Accommodation', 'Rest', 'Boutique Hotel'],
        hasDocument: true,
        emoji: '🏨',
        description: 'Charming boutique hotel in the historic Marais district.',
        rating: 4.3,
        price: '€180/night',
        backgroundImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'
      }
    ],
    routes: [
      {
        id: 'r1',
        fromActivityId: '1',
        toActivityId: '2',
        defaultMode: 'walk',
        totalTime: '8 min',
        totalDistance: '650m',
        steps: [
          { id: 'r1s1', mode: 'walk', description: 'Walk northeast on Av. Gustave Eiffel', duration: '3 min' },
          { id: 'r1s2', mode: 'walk', description: 'Cross Pont de Bir-Hakeim', duration: '2 min' },
          { id: 'r1s3', mode: 'walk', description: 'Walk to Place du Trocadéro', duration: '3 min' }
        ]
      },
      {
        id: 'r2',
        fromActivityId: '2',
        toActivityId: '3',
        defaultMode: 'metro',
        totalTime: '12 min',
        totalDistance: '2.1km',
        totalCost: '€2.15',
        steps: [
          { id: 'r2s1', mode: 'walk', description: 'Walk to Trocadéro Metro', duration: '2 min' },
          { id: 'r2s2', mode: 'metro', description: 'Line 9 to Bir-Hakeim (3 stops)', duration: '7 min' },
          { id: 'r2s3', mode: 'walk', description: 'Walk to Port de la Bourdonnais', duration: '3 min' }
        ]
      },
      {
        id: 'r3',
        fromActivityId: '3',
        toActivityId: '4',
        defaultMode: 'metro',
        totalTime: '18 min',
        totalDistance: '3.2km',
        totalCost: '€2.15',
        steps: [
          { id: 'r3s1', mode: 'walk', description: 'Walk to Bir-Hakeim Metro', duration: '3 min' },
          { id: 'r3s2', mode: 'metro', description: 'Line 6 to Châtelet (5 stops)', duration: '11 min' },
          { id: 'r3s3', mode: 'walk', description: 'Walk to Louvre Museum', duration: '4 min' }
        ]
      },
      {
        id: 'r4',
        fromActivityId: '4',
        toActivityId: '5',
        defaultMode: 'bus',
        totalTime: '22 min',
        totalDistance: '2.8km',
        totalCost: '€2.15',
        steps: [
          { id: 'r4s1', mode: 'walk', description: 'Walk to Louvre-Rivoli bus stop', duration: '3 min' },
          { id: 'r4s2', mode: 'bus', description: 'Bus 69 towards Père Lachaise', duration: '14 min' },
          { id: 'r4s3', mode: 'walk', description: 'Walk to L\'Ami Jean', duration: '5 min' }
        ]
      }
    ]
  }
];

type LayoutDensity = 'condensed' | 'medium' | 'expanded';

interface ItineraryViewProps {
  trip: any;
  onBack: () => void;
  onShowProfile: () => void;
}

export default function ItineraryView({ trip, onBack, onShowProfile }: ItineraryViewProps) {
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());
  const [lastScrollY, setLastScrollY] = useState(0);
  const [layoutDensity, setLayoutDensity] = useState<LayoutDensity>('medium');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [addStopContext, setAddStopContext] = useState<any>(null);

  // Map day IDs to weekdays and dates for the European trip
  const getDayInfo = (dayId: string) => {
    const dayMap: { [key: string]: { weekday: string; date: string } } = {
      '1': { weekday: 'Monday', date: 'Dec 9' },
      '2': { weekday: 'Tuesday', date: 'Dec 10' }, 
      '3': { weekday: 'Wednesday', date: 'Dec 11' }
    };
    return dayMap[dayId] || { weekday: `Day ${dayId}`, date: '' };
  };

  // Auto-collapse routes when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);
      
      if (scrollDelta > 100) {
        setExpandedRoutes(new Set());
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleRoute = (routeId: string) => {
    const newExpanded = new Set(expandedRoutes);
    if (newExpanded.has(routeId)) {
      newExpanded.delete(routeId);
    } else {
      newExpanded.add(routeId);
    }
    setExpandedRoutes(newExpanded);
  };

  const getRouteForActivity = (day: Day, fromActivityId: string) => {
    return day.routes.find(route => route.fromActivityId === fromActivityId);
  };

  const handleActivityTap = (activityId: string) => {
    // Find activity across all days
    let foundActivity: Activity | null = null;
    for (const day of mockItinerary) {
      const activity = day.activities.find(a => a.id === activityId);
      if (activity) {
        foundActivity = activity;
        break;
      }
    }
    if (foundActivity) {
      setSelectedActivity(foundActivity);
    }
  };

  const getDensityIcon = (density: LayoutDensity) => {
    switch (density) {
      case 'condensed': return <Rows3 className="w-4 h-4" />;
      case 'expanded': return <Grid3X3 className="w-4 h-4" />;
      default: return <List className="w-4 h-4" />;
    }
  };

  const getDensityLabel = (density: LayoutDensity) => {
    switch (density) {
      case 'condensed': return 'Compact';
      case 'expanded': return 'Cards';
      default: return 'List';
    }
  };

  const handleDensityChange = (density: LayoutDensity) => {
    console.log('Changing density to:', density); // Debug log
    setLayoutDensity(density);
  };

  // Simple logic to determine current time activity (for demo, let's say it's the second activity of day 2)
  const getCurrentActivityId = () => {
    return 'b2'; // Mock current activity for demonstration
  };

  if (selectedActivity) {
    return (
      <ActivityDetail 
        activity={selectedActivity} 
        onBack={() => setSelectedActivity(null)} 
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-medium">{trip?.title || 'European Adventure'}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Layout Density Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 border border-border hover:bg-accent"
                >
                  {getDensityIcon(layoutDensity)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-28">
                {(['condensed', 'medium', 'expanded'] as const).map((density) => {
                  const getMenuIcon = (d: LayoutDensity) => {
                    switch (d) {
                      case 'condensed': return <Rows3 className="w-4 h-4 mr-2" />;
                      case 'expanded': return <Grid3X3 className="w-4 h-4 mr-2" />;
                      default: return <List className="w-4 h-4 mr-2" />;
                    }
                  };
                  
                  return (
                    <DropdownMenuItem 
                      key={density}
                      onClick={() => handleDensityChange(density)}
                      className={`cursor-pointer ${layoutDensity === density ? 'bg-accent text-accent-foreground' : ''}`}
                    >
                      {getMenuIcon(density)}
                      {getDensityLabel(density)}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/avatar.jpg" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={onShowProfile} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Render all days */}
        {mockItinerary.map((day, dayIndex) => (
          <div key={day.id}>
            {/* Day Header - Section Separator */}
            <div className={`${
              dayIndex > 0 ? 'border-t border-border/20 pt-8 mt-12' : 'pt-2'
            } ${
              layoutDensity === 'condensed' ? 'pb-6 px-4' : 
              layoutDensity === 'expanded' ? 'pb-8 px-6' : 'pb-6 px-4'
            }`}>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className={`text-foreground font-semibold ${
                    layoutDensity === 'expanded' ? 'text-2xl' : 
                    layoutDensity === 'condensed' ? 'text-xl' : 'text-xl'
                  }`}>
                    {getDayInfo(day.id).weekday}
                    <span className="text-muted-foreground font-normal ml-2">
                      {getDayInfo(day.id).date}
                    </span>
                  </h2>
                  <p className={`text-muted-foreground font-medium ${
                    layoutDensity === 'condensed' ? 'text-sm' : 'text-base'
                  }`}>
                    {day.city}
                  </p>
                </div>
                
                {/* Add Stop Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setAddStopContext({
                      insertAfter: day.activities[day.activities.length - 1]?.title || 'Start of day',
                      dayName: day.date,
                      cityName: day.city,
                      position: 'end'
                    });
                    setShowAddStopModal(true);
                  }}
                  className="text-xs h-8 px-3 text-muted-foreground/60 hover:text-muted-foreground mt-1"
                >
                  + Add
                </Button>
              </div>
            </div>

            {/* Table Header for Condensed View */}
            {layoutDensity === 'condensed' && (
              <div className="border-b border-border/20 px-4 py-2 bg-muted/5 mx-4">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-medium text-muted-foreground w-10 flex-shrink-0">
                    Time
                  </div>
                  <div className="text-xs font-medium text-muted-foreground flex-1">
                    Activity
                  </div>
                </div>
              </div>
            )}

            {/* Activities and Routes */}
            <div className={`${
              layoutDensity === 'condensed' ? 'pb-6' : 'pb-8'
            }`}>
              {day.activities.map((activity, index) => {
                const route = getRouteForActivity(day, activity.id);
                const isLastActivity = index === day.activities.length - 1;
                const isCurrentTime = activity.id === getCurrentActivityId();
                
                return (
                  <div key={activity.id}>
                    {/* Activity Card */}
                    <ActivityCard
                      id={activity.id}
                      time={activity.time}
                      title={activity.title}
                      type={activity.type}
                      location={activity.location}
                      tags={activity.tags}
                      hasDocument={activity.hasDocument}
                      emoji={activity.emoji}
                      backgroundImage={activity.backgroundImage}
                      rating={activity.rating}
                      price={activity.price}
                      layoutDensity={layoutDensity}
                      isCurrentTime={isCurrentTime}
                      onTap={() => handleActivityTap(activity.id)}
                    />
                    
                    {/* Travel Chunk (if not last activity and not condensed) */}
                    {!isLastActivity && route && layoutDensity !== 'condensed' && (
                      <TravelChunk
                        fromPlace={activity.title}
                        toPlace={day.activities[index + 1]?.title || 'Next stop'}
                        defaultMode={route.defaultMode}
                        totalTime={route.totalTime}
                        totalDistance={route.totalDistance}
                        totalCost={route.totalCost}
                        steps={route.steps}
                        expanded={expandedRoutes.has(route.id)}
                        onToggle={() => toggleRoute(route.id)}
                        offline={route.offline}
                      />
                    )}
                  </div>
                );
              })}
            </div>


          </div>
        ))}
      </div>

      {/* Add Stop Modal */}
      {showAddStopModal && addStopContext && (
        <AddStopModal
          isOpen={showAddStopModal}
          onClose={() => {
            setShowAddStopModal(false);
            setAddStopContext(null);
          }}
          context={addStopContext}
          onAddStop={(stopData) => {
            // TODO: Handle adding the stop to the itinerary
            console.log('Adding stop:', stopData);
            setShowAddStopModal(false);
            setAddStopContext(null);
          }}
        />
      )}
    </div>
  );
}