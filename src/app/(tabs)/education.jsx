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
import { useTheme } from "@/utils/theme";
import {
  Leaf,
  Droplets,
  Zap,
  AlertTriangle,
  Package,
  Flame,
} from "lucide-react-native";
import Card from "@/components/Card";

export default function EducationScreen() {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/waste/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error("Categories fetch error:", err);
      setError("Failed to load waste categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getIconForCategory = (name) => {
    const iconProps = { size: 24, color: "white" };
    switch (name) {
      case "Plastic":
        return <Package {...iconProps} />;
      case "Glass":
        return <Droplets {...iconProps} />;
      case "Organic/Food Waste":
        return <Leaf {...iconProps} />;
      case "Metal":
        return <Zap {...iconProps} />;
      case "Electronics":
        return <AlertTriangle {...iconProps} />;
      case "Hazardous Waste":
        return <Flame {...iconProps} />;
      default:
        return <Package {...iconProps} />;
    }
  };

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        setSelectedCategory(selectedCategory?.id === item.id ? null : item)
      }
      style={{
        marginHorizontal: 16,
        marginBottom: 12,
      }}
    >
      <Card
        style={{
          backgroundColor: item.color_code,
          paddingVertical: 20,
          borderWidth: 0,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_700Bold",
                fontSize: 18,
                color: "white",
                marginBottom: 4,
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              {item.description}
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 12,
            }}
          >
            {getIconForCategory(item.name)}
          </View>
        </View>

        {selectedCategory?.id === item.id && (
          <View
            style={{
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.95)",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              How to Dispose:
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 18,
                marginBottom: 12,
              }}
            >
              {item.disposal_instructions}
            </Text>

            <Text
              style={{
                fontFamily: "Roboto_500Medium",
                fontSize: 13,
                color: "rgba(255, 255, 255, 0.95)",
                marginBottom: 8,
                fontWeight: "600",
              }}
            >
              Environmental Impact:
            </Text>
            <Text
              style={{
                fontFamily: "Roboto_400Regular",
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 18,
              }}
            >
              {item.environmental_impact}
            </Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );

  const tipsData = [
    {
      title: "Rinse Before Recycling",
      description:
        "Clean containers prevent contamination and help with sorting.",
    },
    {
      title: "Separate Your Waste",
      description:
        "Keep recyclables separate from organic waste to improve processing efficiency.",
    },
    {
      title: "Know Your Local Rules",
      description:
        "Recycling rules vary by location. Check your municipality's guidelines.",
    },
    {
      title: "Reduce First",
      description:
        "The best waste is no waste. Try to reduce consumption before recycling.",
    },
    {
      title: "Compost at Home",
      description:
        "Organic waste can be composted to create nutrient-rich soil for gardens.",
    },
    {
      title: "E-Waste Matters",
      description:
        "Electronic waste contains toxic materials. Never throw away electronics with trash.",
    },
  ];

  const renderTip = ({ item }) => (
    <Card style={{ marginHorizontal: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
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
          <Leaf size={18} color={theme.colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Roboto_600SemiBold",
              fontSize: 14,
              color: theme.colors.text.primary,
              marginBottom: 4,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              fontFamily: "Roboto_400Regular",
              fontSize: 12,
              color: theme.colors.text.secondary,
              lineHeight: 16,
            }}
          >
            {item.description}
          </Text>
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
          Learn About Waste
        </Text>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 14,
            color: theme.colors.text.secondary,
          }}
        >
          Understand waste categories and recycling tips
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
            Unable to Load Categories
          </Text>
          <TouchableOpacity
            onPress={fetchCategories}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: theme.colors.primary,
              borderRadius: 8,
              marginTop: 16,
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
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Categories Section */}
          {categories.length > 0 && (
            <>
              <View
                style={{
                  paddingHorizontal: 16,
                  marginBottom: 16,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto_600SemiBold",
                    fontSize: 16,
                    color: theme.colors.text.primary,
                  }}
                >
                  Waste Categories
                </Text>
              </View>
              <FlatList
                data={categories}
                renderItem={renderCategoryCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </>
          )}

          {/* Tips Section */}
          <View
            style={{ paddingHorizontal: 16, marginBottom: 16, marginTop: 8 }}
          >
            <Text
              style={{
                fontFamily: "Roboto_600SemiBold",
                fontSize: 16,
                color: theme.colors.text.primary,
              }}
            >
              Recycling Tips
            </Text>
          </View>
          <FlatList
            data={tipsData}
            renderItem={renderTip}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </ScrollView>
      )}
    </View>
  );
}
