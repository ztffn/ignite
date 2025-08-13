import { useState } from "react"
import { View, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"

import { Card } from "../../components/Card"
import { Icon } from "../../components/Icon"
import { Screen } from "../../components/Screen"
import { Text } from "../../components/Text"
import { useTripStore } from "../../store"
import { useSafeAreaInsetsStyle } from "../../utils/useSafeAreaInsetsStyle"

const { width: screenWidth } = Dimensions.get("window")

interface PhraseCardProps {
  french: string
  phonetic: string
  english: string
  isActive: boolean
}

const PhraseCard: React.FC<PhraseCardProps> = ({ french, phonetic, english, isActive }) => (
  <Card
    style={{
      padding: 16,
      marginHorizontal: 8,
      backgroundColor: isActive ? "#ffffff" : "#f8f9fa",
      borderWidth: isActive ? 1 : 0.5,
      borderColor: isActive ? "#e5e7eb" : "#e5e7eb",
      shadowColor: isActive ? "#000" : "#000",
      shadowOffset: { width: 0, height: isActive ? 4 : 2 },
      shadowOpacity: isActive ? 0.1 : 0.05,
      shadowRadius: isActive ? 8 : 4,
      elevation: isActive ? 4 : 2,
    }}
  >
    <View
      style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}
    >
      <View style={{ flex: 1, gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>{french}</Text>
        <Text style={{ fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>"{phonetic}"</Text>
        <Text style={{ fontSize: 14, color: "#374151" }}>{english}</Text>
      </View>
      <TouchableOpacity
        style={{
          height: 64,
          width: 64,
          padding: 0,
          marginLeft: 8,
          backgroundColor: "#f3f4f6",
          borderRadius: 16,
          borderWidth: 2,
          borderColor: "#e5e7eb",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon icon="settings" size={32} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  </Card>
)

interface ActivityRowProps {
  time: string
  title: string
  location: string
  icon: string
  color: string
  countdown: string
  isUrgent: boolean
}

const ActivityRow: React.FC<ActivityRowProps> = ({
  time,
  title,
  location,
  icon,
  color,
  countdown,
  isUrgent,
}) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 8,
      borderRadius: 8,
    }}
  >
    <View
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: isUrgent ? "#fef2f2" : color,
      }}
    >
      <Icon icon="view" size={16} color={isUrgent ? "#ef4444" : "#ffffff"} />
    </View>

    <View style={{ flex: 1, minWidth: 0 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", flex: 1 }}>{title}</Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isUrgent ? "#ef4444" : "#d1d5db",
            backgroundColor: isUrgent ? "#fef2f2" : "transparent",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: isUrgent ? "#ef4444" : "#374151",
              fontWeight: "600",
            }}
          >
            {time}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, color: "#6b7280", flex: 1 }}>{location}</Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: isUrgent ? "#ef4444" : "#6b7280",
          }}
        >
          {countdown}
        </Text>
      </View>
    </View>

    <Icon icon="caretRight" size={16} color="#9ca3af" />
  </TouchableOpacity>
)

interface QuickActionProps {
  icon: string
  title: string
  subtitle: string
  color: string
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, color }) => (
  <TouchableOpacity
    style={{
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: color,
      flex: 1,
    }}
  >
    <View
      style={{
        padding: 8,
        backgroundColor: `${color}20`,
        borderRadius: 8,
      }}
    >
      <Icon icon="view" size={16} color={color} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 2 }}>{title}</Text>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
)

export const DashboardScreen = ({ navigation }: any) => {
  const { selectedTrip } = useTripStore()
  const $topContainerInsets = useSafeAreaInsetsStyle(["top"])
  const [headerExpanded, setHeaderExpanded] = useState(true)

  // Mock data for layout demonstration
  const phrases = [
    {
      french: "Où est la salle de bain?",
      phonetic: "oo-eh lah sahl duh ban",
      english: "Where is the bathroom?",
    },
    {
      french: "Combien ça coûte?",
      phonetic: "kom-bee-ahn sah koot",
      english: "How much does this cost?",
    },
    {
      french: "Je voudrais commander",
      phonetic: "zhuh voo-dreh kom-ahn-day",
      english: "I would like to order",
    },
  ]

  const nextActivities = [
    {
      time: "15:07",
      title: "Seine River Cruise",
      location: "Port de la Bourdonnais",
      icon: "view",
      color: "#ef4444",
      countdown: "in 10m",
      isUrgent: true,
    },
    {
      time: "15:42",
      title: "Afternoon Coffee",
      location: "Café de Flore",
      icon: "view",
      color: "#f97316",
      countdown: "in 45m",
      isUrgent: false,
    },
    {
      time: "16:57",
      title: "Dinner at Le Jules Verne",
      location: "Eiffel Tower",
      icon: "view",
      color: "#f97316",
      countdown: "in 1h 59m",
      isUrgent: false,
    },
  ]

  const quickActions = [
    { icon: "view", title: "Photo", subtitle: "Quick photo", color: "#3b82f6" },
    { icon: "pin", title: "Navigate", subtitle: "Get directions", color: "#8b5cf6" },
    { icon: "settings", title: "Translate", subtitle: "Phrase help", color: "#f59e0b" },
    { icon: "bell", title: "Emergency", subtitle: "Emergency contacts", color: "#ef4444" },
  ]

  const handleBack = () => {
    navigation.navigate("Welcome")
  }

  const handleProfile = () => {
    console.log("Show profile")
  }

  if (!selectedTrip) {
    return (
      <Screen preset="scroll" contentContainerStyle={{ padding: 20 }}>
        <View style={{ alignItems: "center", justifyContent: "center", flex: 1, minHeight: 400 }}>
          <Text style={{ fontSize: 20, marginBottom: 15, textAlign: "center" }}>
            No Trip Selected
          </Text>
          <Text style={{ fontSize: 16, color: "#666", textAlign: "center", marginBottom: 30 }}>
            Select a trip to view the dashboard
          </Text>
          <View style={{ gap: 16, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Welcome")}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: "#3b82f6",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#2563eb",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 16, fontWeight: "600" }}>
                Choose a Trip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // Reset to welcome page and clear navigation state
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Welcome" }],
                })
              }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: "#6b7280",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#4b5563",
              }}
            >
              <Text style={{ color: "#ffffff", fontSize: 14, fontWeight: "600" }}>
                Reset Navigation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    )
  }

  return (
    <Screen preset="scroll" style={{ backgroundColor: "#f9fafb" }}>
      {/* Dynamic Header Section */}
      <View
        style={[
          $topContainerInsets,
          {
            height: headerExpanded ? 160 : 64,
            backgroundColor: headerExpanded ? "#374151" : "#ffffff",
            borderBottomWidth: headerExpanded ? 0 : 1,
            borderBottomColor: "#e5e7eb",
            overflow: "hidden",
            position: "relative",
          },
        ]}
      >
        {/* Background Image (when expanded) */}
        {headerExpanded && (
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=200&fit=crop",
            }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              opacity: 0.8,
            }}
            resizeMode="cover"
          />
        )}

        {/* Gradient Overlay */}
        {headerExpanded && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />
        )}

        {/* Header Content */}
        <View
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: headerExpanded ? "space-between" : "flex-end",
            }}
          >
            {headerExpanded && (
              <TouchableOpacity
                onPress={handleBack}
                style={{
                  padding: 8,
                  borderRadius: 20,
                  backgroundColor: "rgba(0,0,0,0.2)",
                }}
              >
                <Icon icon="caretLeft" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleProfile}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: headerExpanded ? "rgba(0,0,0,0.2)" : "#f3f4f6",
              }}
            >
              <Icon icon="community" size={20} color={headerExpanded ? "#ffffff" : "#374151"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Info */}
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
          }}
        >
          {headerExpanded ? (
            <View style={{ paddingRight: 64 }}>
              <Text style={{ fontSize: 20, fontWeight: "600", color: "#ffffff", marginBottom: 4 }}>
                🗼 Day 3 in Paris
              </Text>
              <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                Living your best café-hopping life
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingRight: 64,
              }}
            >
              <View>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827" }}>
                  Day 3 in Paris
                </Text>
                <Text style={{ fontSize: 12, color: "#6b7280" }}>12:30 PM • Sunny 22°C</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: "#f3f4f6",
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>Day 3 of 7</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 8, paddingTop: 20 }}>
        {/* Current Activity Card */}
        <Card
          style={{
            padding: 12,
            borderLeftWidth: 4,
            borderLeftColor: "#f97316",
            backgroundColor: "#fef3c7",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Icon icon="heart" size={16} color="#f97316" />
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: "#f97316",
              }}
            >
              <Text style={{ fontSize: 12, color: "#ffffff", fontWeight: "600" }}>
                14:27 - 15:27
              </Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#f97316", marginLeft: "auto" }}>
              ⏰ 30m left
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "600" }}>Lunch at Café de l'Homme</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Icon icon="pin" size={12} color="#6b7280" />
              <Text style={{ fontSize: 14, color: "#6b7280" }}>Place du Trocadéro</Text>
            </View>
            <Text style={{ fontSize: 14, color: "#6b7280", fontStyle: "italic" }}>
              The view of the Eiffel Tower here is *chef's kiss* 💋
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>Directions</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 8,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  borderRadius: 8,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: "600" }}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Phrase Cards Stack */}
        <View style={{ height: 128, marginHorizontal: 24, marginBottom: 12 }}>
          {phrases.map((phrase, index) => (
            <PhraseCard
              key={index}
              french={phrase.french}
              phonetic={phrase.phonetic}
              english={phrase.english}
              isActive={index === 0}
            />
          ))}
        </View>

        {/* Coming Up Section */}
        <Card style={{ padding: 12, marginBottom: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Icon icon="settings" size={16} color="#6b7280" />
            <Text style={{ fontSize: 14, fontWeight: "600" }}>Coming Up</Text>
          </View>

          <View style={{ gap: 12 }}>
            {nextActivities.map((activity, index) => (
              <ActivityRow
                key={index}
                time={activity.time}
                title={activity.title}
                location={activity.location}
                icon={activity.icon}
                color={activity.color}
                countdown={activity.countdown}
                isUrgent={activity.isUrgent}
              />
            ))}
          </View>
        </Card>

        {/* Weather & Challenges Grid */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <Card style={{ flex: 1, padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Icon icon="heart" size={20} color="#f59e0b" />
              <Text style={{ fontSize: 16, fontWeight: "600" }}>Sunny, 22°C</Text>
            </View>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>
              Perfect weather for sightseeing
            </Text>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>High: 28°C</Text>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>Low: 18°C</Text>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>Rain: 10%</Text>
            </View>
          </Card>

          <Card style={{ flex: 1, padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>Trip Challenges</Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                }}
              >
                <Text style={{ fontSize: 12 }}>3 Active</Text>
              </View>
            </View>

            <View style={{ gap: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: "#fef3c7",
                  borderWidth: 1,
                  borderColor: "#f97316",
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: "#f97316",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon icon="heart" size={12} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#f97316" }}>
                    Culinary Explorer
                  </Text>
                  <Text style={{ fontSize: 10, color: "#6b7280" }}>Try 3 local specialties</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#f97316" }}>2/3</Text>
                  <View
                    style={{
                      width: 48,
                      height: 4,
                      backgroundColor: "#e5e7eb",
                      borderRadius: 2,
                      marginTop: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 4,
                        backgroundColor: "#f97316",
                        borderRadius: 2,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions Grid */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              icon={action.icon}
              title={action.title}
              subtitle={action.subtitle}
              color={action.color}
            />
          ))}
        </View>

        {/* Travel Toolkit Button */}
        <TouchableOpacity
          style={{
            width: "100%",
            padding: 12,
            borderWidth: 1,
            borderColor: "#3b82f6",
            borderRadius: 8,
            alignItems: "center",
            backgroundColor: "#f0f9ff",
            marginBottom: 24,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon icon="settings" size={16} color="#3b82f6" />
            <Text style={{ marginLeft: 8, color: "#3b82f6", fontWeight: "600" }}>
              Open Travel Toolkit
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  )
}
