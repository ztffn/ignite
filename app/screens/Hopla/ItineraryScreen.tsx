import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTripStore, useItineraryStore } from '../../store';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const ItineraryScreen = () => {
  const { selectedTrip, getCurrentCity } = useTripStore();
  const { items, selectedDate, setSelectedDate, getItemsForDay } = useItineraryStore();

  if (!selectedTrip) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          Select a trip to view the itinerary
        </Text>
      </Screen>
    );
  }

  const currentCity = getCurrentCity();
  const todayItems = getItemsForDay(selectedDate);

  const timeSlots = ['morning', 'afternoon', 'evening', 'flexible'];

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {selectedTrip.title}
        </Text>
        {currentCity && (
          <Text style={{ fontSize: 16, color: '#666' }}>
            Currently in {currentCity.name}, {currentCity.country}
          </Text>
        )}
      </View>

      <Card style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
          Day {selectedDate}
        </Text>
        
        {timeSlots.map((slot) => {
          const slotItems = todayItems.filter(item => item.timeSlot === slot);
          return (
            <View key={slot} style={{ marginBottom: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8, textTransform: 'capitalize' }}>
                {slot}
              </Text>
              {slotItems.length === 0 ? (
                <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 10 }}>
                  No activities planned
                </Text>
              ) : (
                slotItems.map((item) => (
                  <TouchableOpacity key={item.id} style={{ marginLeft: 10, marginBottom: 5 }}>
                    <Text style={{ fontSize: 14 }}>{item.title}</Text>
                    {item.location && (
                      <Text style={{ fontSize: 12, color: '#666' }}>{item.location}</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          );
        })}
      </Card>

      <Button text="Add Activity" />
    </Screen>
  );
};
