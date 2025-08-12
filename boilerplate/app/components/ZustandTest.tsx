import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthenticationStore, useTripStore } from '../store';

export const ZustandTest = () => {
  const { user, isAuthenticated, setUser } = useAuthenticationStore();
  const { trips, addTrip } = useTripStore();

  const handleLogin = () => {
    setUser({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      preferences: {
        language: 'en',
        currency: 'USD',
        timezone: 'UTC',
        notifications: true,
      },
    });
  };

  const handleAddTrip = () => {
    addTrip({
      id: Date.now().toString(),
      title: `Test Trip ${trips.length + 1}`,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'planning',
      currentDay: 1,
      totalDays: 7,
      cities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Zustand Store Test</Text>
      
      <View style={{ gap: 5 }}>
        <Text>Authentication Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</Text>
        {user && (
          <Text>User: {user.name} ({user.email})</Text>
        )}
      </View>

      <View style={{ gap: 5 }}>
        <Text>Trips Count: {trips.length}</Text>
        {trips.map((trip: any) => (
          <Text key={trip.id}>- {trip.title}</Text>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        {!isAuthenticated ? (
          <Button title="Login" onPress={handleLogin} />
        ) : (
          <Button title="Logout" onPress={() => setUser(null)} />
        )}
        
        <Button title="Add Test Trip" onPress={handleAddTrip} />
      </View>
    </View>
  );
};
