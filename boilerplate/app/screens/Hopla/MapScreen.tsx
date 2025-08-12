import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { useTripStore } from '../../store';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';

export const MapScreen = () => {
  const { selectedTrip, getCurrentCity } = useTripStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  if (!selectedTrip) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 400 }}>
          <Text style={{ fontSize: 20, marginBottom: 15, textAlign: 'center' }}>
            No Trip Selected
          </Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            Select a trip to view the map
          </Text>
        </View>
      </Screen>
    );
  }

  const currentCity = getCurrentCity();

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { marginBottom: 30 }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
          Map
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          {selectedTrip.title}
        </Text>
      </View>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Current Location
          </Text>
          {currentCity ? (
            <View>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                {currentCity.name}, {currentCity.country}
              </Text>
              <Text style={{ fontSize: 14, color: '#666' }}>
                Day {currentCity.startDay} - {currentCity.endDay}
              </Text>
            </View>
          ) : (
            <Text style={{ fontSize: 16, color: '#666' }}>
              No city selected
            </Text>
          )}
        </View>
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
            Trip Cities
          </Text>
          {selectedTrip.cities.length === 0 ? (
            <Text style={{ fontSize: 16, color: '#666', fontStyle: 'italic' }}>
              No cities added to this trip yet
            </Text>
          ) : (
            selectedTrip.cities.map((city) => (
              <View key={city.id} style={{ marginBottom: 10, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>
                  {city.name}, {city.country}
                </Text>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  Days {city.startDay} - {city.endDay}
                </Text>
              </View>
            ))
          )}
        </View>
      </Card>

      <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Open Full Map
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};
