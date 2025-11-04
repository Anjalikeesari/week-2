import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "@/utils/theme";
import {
  Leaf,
  Droplet,
  Award,
  TrendingUp,
  Settings,
  Info,
} from "lucide-react-native";
import Card from "@/components/Card";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  // Mock stats - in a real app, fetch from backend
  const stats = {
    itemsClassified: 24,
    correctClassifications: 22,
    wasteRecycled: 12.5,
    co2Saved: 8.3,
    streak: 7,
  };

  const achievements = [
    {
      id: 1,
      title: "Earth Guardian",
      description: "Classified 10 waste items",
      icon: Leaf,
      unlocked: true,
    },
    {
      id: 2,
      title: "Recycling Master",
      description: "Achieved 90% accuracy",
      icon: Award,
      unlocked: true,
    },
    {
      id: 3,
      title: "Environmental Hero",
      description: "Save 10 kg of CO2",
      icon: TrendingUp,
      unlocked: stats.co2Saved >= 10,
    },
    {
      id: 4,
      title: "Weekly Warrior",
      description: "Classify items for 7 days",
      icon: Award,
      unlocked: stats.streak >= 7,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
        }}
      >
        <Text
          style={{
            fontFamily: "Roboto_700Bold",
            fontSize: 28,
            color: theme.colors.text.primary,
            marginBottom: 4,
          }}
        >
          Profile
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 14,
            color: theme.colors.text.secondary,
          }}
        >
          Your waste classification journey
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <Card
          style={{
            backgroundColor: theme.colors.primary,
            marginBottom: 20,
            borderWidth: 0,
          }}
        >
          <View style={{ alignItems: "center", paddingVertical: 8 }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Leaf size={40} color="white" />
            </View>
            <Text
              style={{
                fontFamily: "Roboto_700Bold",
                fontSize: 20,
                color: "white",
                marginBottom: 4,
              }}
            >
              Eco Warrior
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Keep making a difference! 🌱
            </Text>
          </View>
        </Card>

        {/* Stats Grid */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Roboto_600SemiBold",
              fontSize: 16,
              color: theme.colors.text.primary,
              marginBottom: 12,
            }}
          >
            Your Impact
          </Text>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <Card style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.isDark
                      ? "rgba(9, 177, 75, 0.15)"
                      : "#E8F5E8",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Award size={20} color={theme.colors.primary} />
                </View>
                <Text
                  style={{
                    fontFamily: "Roboto_700Bold",
                    fontSize: 18,
                    color: theme.colors.text.primary,
                  }}
                >
                  {stats.itemsClassified}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 11,
                    color: theme.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Items Classified
                </Text>
              </View>
            </Card>

            <Card style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.isDark
                      ? "rgba(34, 199, 90, 0.15)"
                      : "#E8F5E8",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <TrendingUp size={20} color={theme.colors.success} />
                </View>
                <Text
                  style={{
                    fontFamily: "Roboto_700Bold",
                    fontSize: 18,
                    color: theme.colors.text.primary,
                  }}
                >
                  {stats.correctClassifications}
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 11,
                    color: theme.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Correct
                </Text>
              </View>
            </Card>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Card style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.isDark
                      ? "rgba(50, 208, 250, 0.15)"
                      : "#F0F9FF",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Leaf size={20} color={theme.colors.info} />
                </View>
                <Text
                  style={{
                    fontFamily: "Roboto_700Bold",
                    fontSize: 18,
                    color: theme.colors.text.primary,
                  }}
                >
                  {stats.wasteRecycled}kg
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 11,
                    color: theme.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  Waste Recycled
                </Text>
              </View>
            </Card>

            <Card style={{ flex: 1 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.isDark
                      ? "rgba(255, 176, 32, 0.15)"
                      : "#FFFAED",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Droplet size={20} color={theme.colors.warning} />
                </View>
                <Text
                  style={{
                    fontFamily: "Roboto_700Bold",
                    fontSize: 18,
                    color: theme.colors.text.primary,
                  }}
                >
                  {stats.co2Saved}kg
                </Text>
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 11,
                    color: theme.colors.text.secondary,
                    textAlign: "center",
                  }}
                >
                  CO2 Saved
                </Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Achievements */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Roboto_600SemiBold",
              fontSize: 16,
              color: theme.colors.text.primary,
              marginBottom: 12,
            }}
          >
            Achievements
          </Text>

          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.id}
                style={{
                  marginBottom: 10,
                  opacity: achievement.unlocked ? 1 : 0.5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: achievement.unlocked
                        ? theme.colors.primary
                        : theme.colors.text.disabled,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Icon size={24} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: "Roboto_600SemiBold",
                        fontSize: 14,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {achievement.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Roboto_400Regular",
                        fontSize: 12,
                        color: theme.colors.text.secondary,
                        marginTop: 2,
                      }}
                    >
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.unlocked && (
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: theme.colors.success,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 16 }}>✓</Text>
                    </View>
                  )}
                </View>
              </Card>
            );
          })}
        </View>

        {/* Settings */}
        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontFamily: "Roboto_600SemiBold",
              fontSize: 16,
              color: theme.colors.text.primary,
              marginBottom: 12,
            }}
          >
            Settings
          </Text>

          <TouchableOpacity>
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.isDark
                        ? "rgba(9, 177, 75, 0.15)"
                        : "#E8F5E8",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Settings size={18} color={theme.colors.primary} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Roboto_600SemiBold",
                        fontSize: 14,
                        color: theme.colors.text.primary,
                      }}
                    >
                      Preferences
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Roboto_400Regular",
                        fontSize: 12,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Manage your settings
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 10 }}>
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: theme.isDark
                        ? "rgba(50, 208, 250, 0.15)"
                        : "#F0F9FF",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Info size={18} color={theme.colors.info} />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontFamily: "Roboto_600SemiBold",
                        fontSize: 14,
                        color: theme.colors.text.primary,
                      }}
                    >
                      About
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Roboto_400Regular",
                        fontSize: 12,
                        color: theme.colors.text.secondary,
                      }}
                    >
                      Version 1.0.0
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
