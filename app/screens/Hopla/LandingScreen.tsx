import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuthenticationStore, useTripStore } from '../../store';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const LandingScreen = () => {
  const { user, isAuthenticated } = useAuthenticationStore();
  const { trips } = useTripStore();

  if (!isAuthenticated) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Welcome to Hopla
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Your AI-powered travel companion
        </Text>
        <Button text="Get Started" />
      </Screen>
    );
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Welcome back, {user?.name}!
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          Ready for your next adventure?
        </Text>
      </View>

      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Recent Trips
        </Text>
        {trips.length === 0 ? (
          <Text style={{ color: '#666', fontStyle: 'italic' }}>
            No trips yet. Start planning your first adventure!
          </Text>
        ) : (
          trips.slice(0, 3).map((trip) => (
            <TouchableOpacity key={trip.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{trip.title}</Text>
              <Text style={{ color: '#666' }}>{trip.status} • {trip.totalDays} days</Text>
            </TouchableOpacity>
          ))
        )}
      </Card>

      <Button text="Create New Trip" />
    </Screen>
  );
};
