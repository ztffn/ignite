import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Icon } from '../../components/Icon';
import { useAuthenticationStore, useTripStore } from '../../store';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';

export const LandingScreen = ({ navigation }: any) => {
  const { user, isAuthenticated } = useAuthenticationStore();
  const { trips } = useTripStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  const recentTrips = trips.slice(0, 3);

  const goToComponents = () => {
    navigation.navigate('Demo', { screen: 'DemoShowroom' });
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
    </Screen>
  );
};
