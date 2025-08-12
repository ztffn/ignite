import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { TripCard } from '../../components/TripCard';
import { useAuthenticationStore, useTripStore } from '../../store';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';

export const LandingScreen = ({ navigation }: any) => {
  const { user, isAuthenticated } = useAuthenticationStore();
  const { trips } = useTripStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  const recentTrips = trips.slice(0, 3);

  // Mock trip data for demonstration
  const mockTrips = [
    {
      id: '1',
      title: 'Paris',
      subtitle: 'City of love',
      imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop',
    },
    {
      id: '2',
      title: 'Tokyo',
      subtitle: 'Where tradition meets future',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    },
    {
      id: '3',
      title: 'New York',
      subtitle: 'The city that never sleeps',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
    },
  ];

  const goToComponents = () => {
    navigation.navigate('Demo', { screen: 'DemoShowroom' });
  };

  const handleTripPress = (tripId: string) => {
    console.log('Trip pressed:', tripId);
    // TODO: Navigate to trip details or select trip
  };

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }]}>
        <View>
          <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
            Welcome to Hopla
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>
            Your AI-powered travel companion
          </Text>
        </View>
        <TouchableOpacity onPress={goToComponents} style={{ padding: 10 }}>
          <Icon icon="settings" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
            {isAuthenticated ? `Hello, ${user?.name || 'Traveler'}!` : 'Get Started'}
          </Text>
          
          {isAuthenticated ? (
            <View>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                You have {trips.length} trip{trips.length !== 1 ? 's' : ''} planned
              </Text>
              {recentTrips.length > 0 && (
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                    Recent Trips:
                  </Text>
                  {recentTrips.map((trip) => (
                                         <Text key={trip.id} style={{ fontSize: 14, marginLeft: 10, marginBottom: 4 }}>
                       • {trip.title} - {trip.cities.length > 0 ? trip.cities[0].name : 'No cities'}
                     </Text>
                  ))}
                </View>
              )}
            </View>
          ) : (
            <Text style={{ fontSize: 16 }}>
              Sign in to start planning your next adventure
            </Text>
          )}
        </View>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Quick Actions
          </Text>
          <View style={{ gap: 10 }}>
            <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
                Plan New Trip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
              <Text style={{ textAlign: 'center', fontWeight: '600' }}>
                Explore Destinations
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
            Current Trip
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginBottom: 10 }}>
            You're currently planning: <Text style={{ fontWeight: '600' }}>Paris Adventure</Text>
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Use the tabs below to manage your itinerary, view the map, explore local attractions, and organize your documents.
          </Text>
        </View>
      </Card>
    </Screen>
  );
};
