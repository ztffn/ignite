import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"

import { Card } from "../../components/Card"
import { Screen } from "../../components/Screen"
import { useTripStore } from "../../store"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"

export const TripsScreen = () => {
  const { trips, addTrip } = useTripStore()
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])

  const handleAddTrip = () => {
    addTrip({
      id: Date.now().toString(),
      title: "New Trip",
      description: "Plan your next adventure",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: "planning",
      currentDay: 1,
      totalDays: 7,
      cities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
      <View style={[$topContainerInsets, { marginBottom: 30 }]}>
        <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 10 }}>My Trips</Text>
        <Text style={{ fontSize: 16, color: "#666" }}>Plan and manage your adventures</Text>
      </View>

      {trips.length === 0 ? (
        <Card style={{ marginBottom: 20 }}>
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 18, marginBottom: 15, textAlign: "center" }}>
              No trips planned yet
            </Text>
            <Text style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 }}>
              Start planning your first adventure!
            </Text>
            <TouchableOpacity
              style={{ padding: 15, backgroundColor: "#007AFF", borderRadius: 8 }}
              onPress={handleAddTrip}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>Create First Trip</Text>
            </TouchableOpacity>
          </View>
        </Card>
      ) : (
        trips.map((trip) => (
          <Card key={trip.id} style={{ marginBottom: 15 }}>
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
                {trip.title}
              </Text>
              <Text style={{ fontSize: 14, color: "#666", marginBottom: 10 }}>
                {trip.description}
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  {trip.totalDays} days • {trip.status}
                </Text>
                <Text style={{ fontSize: 12, color: "#666" }}>{trip.cities.length} cities</Text>
              </View>
            </View>
          </Card>
        ))
      )}

      {trips.length > 0 && (
        <TouchableOpacity
          style={{ padding: 15, backgroundColor: "#007AFF", borderRadius: 8, marginTop: 10 }}
          onPress={handleAddTrip}
        >
          <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>
            Add New Trip
          </Text>
        </TouchableOpacity>
      )}
    </Screen>
  )
}
