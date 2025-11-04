import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react-native";
import { useTheme } from "@/utils/theme";
import Card from "./Card";
import StatusBadge from "./StatusBadge";

export default function ClassificationResultCard({
  classification,
  onFeedback,
  loading = false,
}) {
  const theme = useTheme();

  if (!classification) {
    return null;
  }

  const {
    category,
    colorCode,
    detectedItems,
    confidence,
    disposalInstructions,
    environmentalImpact,
  } = classification;

  const getStatusType = () => {
    if (category === "Hazardous Waste" || category === "Electronics") {
      return "warning";
    }
    if (category === "Organic/Food Waste") {
      return "info";
    }
    return "success";
  };

  return (
    <Card>
      {/* Header with Category and Confidence */}
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: colorCode,
              marginRight: 12,
            }}
          />
          <Text
            style={{
              fontFamily: "Roboto_700Bold",
              fontSize: 20,
              color: theme.colors.text.primary,
              flex: 1,
            }}
          >
            {category}
          </Text>
          <StatusBadge status={`${confidence}%`} type="success" size="small" />
        </View>
      </View>

      {/* Detected Items */}
      {detectedItems && detectedItems.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 14,
              color: theme.colors.text.secondary,
              marginBottom: 8,
            }}
          >
            Items Detected:
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {detectedItems.map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: theme.isDark
                    ? "rgba(9, 177, 75, 0.15)"
                    : "#E8F5E8",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Roboto_400Regular",
                    fontSize: 12,
                    color: theme.colors.primary,
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Disposal Instructions */}
      <View
        style={{
          marginBottom: 16,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.divider,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <CheckCircle2
            size={18}
            color={theme.colors.success}
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 14,
              color: theme.colors.text.secondary,
            }}
          >
            Disposal Instructions:
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 13,
            color: theme.colors.text.primary,
            lineHeight: 20,
            marginLeft: 26,
          }}
        >
          {disposalInstructions}
        </Text>
      </View>

      {/* Environmental Impact */}
      <View style={{ marginBottom: 16 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <AlertCircle
            size={18}
            color={theme.colors.info}
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 14,
              color: theme.colors.text.secondary,
            }}
          >
            Environmental Impact:
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "Roboto_400Regular",
            fontSize: 13,
            color: theme.colors.text.primary,
            lineHeight: 20,
            marginLeft: 26,
          }}
        >
          {environmentalImpact}
        </Text>
      </View>

      {/* Feedback Buttons */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TouchableOpacity
          onPress={() => onFeedback(true)}
          disabled={loading}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: theme.isDark
              ? "rgba(34, 199, 90, 0.15)"
              : "#E8F5E8",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <ThumbsUp size={16} color={theme.colors.success} />
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 13,
              color: theme.colors.success,
              marginLeft: 6,
            }}
          >
            Correct
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFeedback(false)}
          disabled={loading}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: theme.isDark
              ? "rgba(255, 69, 58, 0.15)"
              : "#FFE8E6",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <ThumbsDown size={16} color={theme.colors.error} />
          <Text
            style={{
              fontFamily: "Roboto_500Medium",
              fontSize: 13,
              color: theme.colors.error,
              marginLeft: 6,
            }}
          >
            Incorrect
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
