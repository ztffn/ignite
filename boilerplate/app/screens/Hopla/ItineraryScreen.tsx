import { View, TouchableOpacity } from "react-native"

import { Card } from "../../components/Card"
import { Screen } from "../../components/Screen"
import { Text } from "../../components/Text"
import { useItineraryStore, useTripStore, ItineraryItem } from "../../store"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"

export const ItineraryScreen = () => {
  const { selectedTrip } = useTripStore();
  const { items, addItem } = useItineraryStore();
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"]);

  const timeSlots = ["morning", "afternoon", "evening"]
  const todayItems = items.filter((item) => item.day === 1) // Show day 1 for now

  const handleAddItem = (timeSlot: string) => {
    addItem({
      id: Date.now().toString(),
      tripId: selectedTrip?.id || "default",
      cityId: "default",
      day: 1,
      timeSlot: timeSlot as "morning" | "afternoon" | "evening",
      title: "New Activity",
      description: "Add details here",
      category: "activity",
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  if (!selectedTrip) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 400 }}>
          <Text style={{ fontSize: 20, marginBottom: 15, textAlign: 'center' }}>
            No Trip Selected
          </Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            Select a trip to view and manage your itinerary
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { marginBottom: 30 }]}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 10 }}>
          Itinerary
        </Text>
        <Text style={{ fontSize: 16, color: '#666' }}>
          {selectedTrip.title} - Day 1
        </Text>
      </View>

      {timeSlots.map((slot) => {
        const slotItems = todayItems.filter((item: ItineraryItem) => item.timeSlot === slot);
        return (
          <View key={slot} style={{ marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', textTransform: 'capitalize' }}>
                {slot}
              </Text>
              <TouchableOpacity 
                style={{ padding: 8, backgroundColor: '#007AFF', borderRadius: 6 }}
                onPress={() => handleAddItem(slot)}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>
            
            {slotItems.length === 0 ? (
              <Card style={{ padding: 15 }}>
                <Text style={{ color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                  No activities planned
                </Text>
              </Card>
            ) : (
              slotItems.map((item: ItineraryItem) => (
                <TouchableOpacity key={item.id} style={{ marginLeft: 10, marginBottom: 5 }}>
                  <Card style={{ padding: 15 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 5 }}>
                      {item.title}
                    </Text>
                    {item.description && (
                      <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>
                        {item.description}
                      </Text>
                    )}
                    <Text style={{ fontSize: 12, color: '#007AFF', textTransform: 'capitalize' }}>
                      {item.category}
                    </Text>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </View>
        );
      })}
    </Screen>
  );
};
