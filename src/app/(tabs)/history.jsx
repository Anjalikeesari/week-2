import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { Image } from "expo-image";
import { useTheme } from "@/utils/theme";
import { Trash2, Calendar } from "lucide-react-native";
import Card from "@/components/Card";
import StatusBadge from "@/components/StatusBadge";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/waste/history?limit=50");

      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }

      const data = await response.json();
      setHistory(data.data || []);
    } catch (err) {
      console.error("History fetch error:", err);
      setError("Failed to load classification history");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory]),
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderHistoryItem = ({ item }) => (
    <Card style={{ marginHorizontal: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {item.image_url && item.image_url !== "base64_image" && (
          <Image
            source={{ uri: item.image_url }}
            style={{ width: 80, height: 80, borderRadius: 8 }}
            contentFit="cover"
          />
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_700Bold",
                fontSize: 16,
                color: theme.colors.text.primary,
              }}
            >
              {item.category_name || "Unknown"}
            </Text>
            <StatusBadge
              status={`${Math.round(item.confidence_score * 100)}%`}
              type="success"
              size="small"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Calendar size={12} color={theme.colors.text.secondary} />
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 12,
                color: theme.colors.text.secondary,
                marginLeft: 6,
              }}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>

          {item.detected_items && (
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 12,
                color: theme.colors.text.tertiary,
              }}
              numberOfLines={1}
            >
              {typeof item.detected_items === "string"
                ? JSON.parse(item.detected_items).join(", ")
                : item.detected_items.join(", ")}
            </Text>
          )}

          {item.is_correct !== null && (
            <View style={{ marginTop: 8 }}>
              <StatusBadge
                status={item.is_correct ? "Correct" : "Incorrect"}
                type={item.is_correct ? "success" : "error"}
                size="small"
              />
            </View>
          )}
        </View>
      </View>
    </Card>
  );

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
          Classification History
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 14,
            color: theme.colors.text.secondary,
          }}
        >
          Your past waste classifications
        </Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 16,
              color: theme.colors.text.primary,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Unable to Load History
          </Text>
          <Text
            style={{
              fontFamily: "Roboto_400Regular",
              fontSize: 14,
              color: theme.colors.text.secondary,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchHistory}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                fontSize: 14,
                color: "white",
              }}
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : history.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 32,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.isDark
                ? "rgba(9, 177, 75, 0.15)"
                : "#E8F5E8",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Trash2 size={36} color={theme.colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 18,
              color: theme.colors.text.primary,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            No Classifications Yet
          </Text>
          <Text
            style={{
              fontFamily: "Roboto_400Regular",
              fontSize: 14,
              color: theme.colors.text.secondary,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            Start classifying waste items to build your history and track your
            environmental impact.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + 16,
          }}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </View>
  );
}
