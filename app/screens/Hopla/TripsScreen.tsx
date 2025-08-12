import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useTripStore } from '../../store';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const TripsScreen = () => {
  const { trips, selectTrip, selectedTrip } = useTripStore();

  const renderTrip = ({ item: trip }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => selectTrip(trip)}
      style={{ 
        padding: 15, 
        borderBottomWidth: 1, 
        borderBottomColor: '#eee',
        backgroundColor: selectedTrip?.id === trip.id ? '#f0f8ff' : 'transparent'
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 5 }}>
        {trip.title}
      </Text>
      <Text style={{ color: '#666', marginBottom: 5 }}>
        {trip.startDate} - {trip.endDate}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ color: '#666' }}>{trip.status}</Text>
        <Text style={{ color: '#666' }}>{trip.totalDays} days</Text>
      </View>
      {trip.cities.length > 0 && (
        <Text style={{ color: '#666', marginTop: 5 }}>
          {trip.cities.length} cities
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <Screen preset="fixed">
      <View style={{ padding: 20, paddingBottom: 0 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          My Trips
        </Text>
        <Button text="Create New Trip" style={{ marginBottom: 20 }} />
      </View>

      {trips.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
            No trips yet. Start planning your first adventure!
          </Text>
          <Button text="Create Your First Trip" />
        </View>
      ) : (
        <FlatList
          data={trips}
          renderItem={renderTrip}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      )}
    </Screen>
  );
};
