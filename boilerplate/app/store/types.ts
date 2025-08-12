// Core types for the Hopla travel app

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: string;
  currency: string;
  timezone: string;
  notifications: boolean;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  currentDay: number;
  totalDays: number;
  cities: City[];
  currentCityId?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  startDay: number;
  endDay: number;
  semanticColor: string; // For UI theming
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface ItineraryItem {
  id: string;
  tripId: string;
  cityId: string;
  day: number;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'flexible';
  title: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
  category: 'attraction' | 'restaurant' | 'transport' | 'accommodation' | 'activity';
  rating?: number;
  notes?: string;
  position: number; // for drag & drop ordering
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  category: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  reviews?: number;
  images?: string[];
  tags: string[];
  openingHours?: string;
  priceRange?: string;
}

export interface Document {
  id: string;
  tripId?: string;
  name: string;
  type: 'passport' | 'visa' | 'booking' | 'ticket' | 'insurance' | 'other';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  expiresAt?: string;
  tags: string[];
}

export interface TripChallenge {
  id: string;
  tripId: string;
  title: string;
  description: string;
  category: 'culinary' | 'cultural' | 'adventure' | 'social' | 'photography';
  target: number;
  current: number;
  completed: boolean;
  semanticColor: string;
}

export interface WeatherInfo {
  cityId: string;
  temperature: number;
  condition: string;
  description: string;
  high: number;
  low: number;
  precipitation: number;
  icon: string;
  lastUpdated: string;
}

// Root store interface that combines all store slices
export interface RootStore {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Trip management
  trips: Trip[];
  selectedTrip: Trip | null;
  weatherData: Record<string, WeatherInfo>;
  challenges: TripChallenge[];
  
  // Itinerary management
  items: ItineraryItem[];
  selectedDate: number;
  draggedItem: ItineraryItem | null;
  
  // Document management
  documents: Document[];
  selectedDocument: Document | null;
  searchQuery: string;
  selectedCategory: string | null;
  
  // Actions (will be filled by individual stores)
  [key: string]: any;
}
