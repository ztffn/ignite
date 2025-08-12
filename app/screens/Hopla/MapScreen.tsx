import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTripStore } from '../../store';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const MapScreen = () => {
  const { selectedTrip, getCurrentCity, weatherData } = useTripStore();

  if (!selectedTrip) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          Select a trip to view the map
        </Text>
      </Screen>
    );
  }

  const currentCity = getCurrentCity();
  const cityWeather = currentCity ? weatherData[currentCity.id] : null;

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Map View
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          {selectedTrip.title}
        </Text>
      </View>

      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Current Location
        </Text>
        {currentCity ? (
          <View>
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              {currentCity.name}, {currentCity.country}
            </Text>
            {cityWeather && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#666' }}>
                  {cityWeather.temperature}°C, {cityWeather.condition}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={{ color: '#666', fontStyle: 'italic' }}>
            No city selected
          </Text>
        )}
      </Card>

      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Trip Cities
        </Text>
        {selectedTrip.cities.length === 0 ? (
          <Text style={{ color: '#666', fontStyle: 'italic' }}>
            No cities added to this trip yet
          </Text>
        ) : (
          selectedTrip.cities.map((city) => (
            <View key={city.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{city.name}</Text>
              <Text style={{ color: '#666' }}>Days {city.startDay}-{city.endDay}</Text>
            </View>
          ))
        )}
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button text="Explore Places" style={{ flex: 1 }} />
        <Button text="Add City" style={{ flex: 1 }} />
      </View>
    </Screen>
  );
};
