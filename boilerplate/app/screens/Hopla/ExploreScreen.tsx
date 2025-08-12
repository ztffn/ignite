import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { useTripStore } from '../../store';
import { useSafeAreaInsetsStyle } from '../../utils/useSafeAreaInsetsStyle';

export const ExploreScreen = () => {
  const { selectedTrip } = useTripStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  const exploreCategories = [
    { name: 'Local Attractions', icon: '🏛️', description: 'Discover landmarks and points of interest' },
    { name: 'Restaurants', icon: '🍽️', description: 'Find local cuisine and dining spots' },
    { name: 'Cultural Events', icon: '🎭', description: 'Explore festivals, museums, and shows' },
    { name: 'Outdoor Activities', icon: '🏃', description: 'Hiking, parks, and adventure sports' },
    { name: 'Shopping', icon: '🛍️', description: 'Markets, boutiques, and local crafts' },
    { name: 'Nightlife', icon: '🌙', description: 'Bars, clubs, and evening entertainment' },
  ];

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { marginBottom: 30 }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
          Explore
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          Discover amazing places and experiences
        </Text>
      </View>

      {!selectedTrip ? (
        <Card style={{ marginBottom: 20 }}>
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 18, marginBottom: 15, textAlign: 'center' }}>
              No Trip Selected
            </Text>
            <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
              Select a trip to explore local attractions and activities
            </Text>
            <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8 }}>
              <Text style={{ color: 'white', fontWeight: '600' }}>
                Select a Trip
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        <>
          <Card style={{ marginBottom: 20 }}>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                Current Location
              </Text>
              <Text style={{ fontSize: 16, color: '#666' }}>
                {selectedTrip.cities[0]?.name || 'Unknown City'}
              </Text>
            </View>
          </Card>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
              What would you like to explore?
            </Text>
            {exploreCategories.map((category, index) => (
              <TouchableOpacity key={index} style={{ marginBottom: 15 }}>
                <Card style={{ padding: 20 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginRight: 15 }}>
                      {category.icon}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>
                        {category.name}
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        {category.description}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 20, color: '#007AFF' }}>
                      →
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={{ padding: 15, backgroundColor: '#007AFF', borderRadius: 8, marginTop: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
          Get AI Recommendations
        </Text>
      </TouchableOpacity>
    </Screen>
  );
};
