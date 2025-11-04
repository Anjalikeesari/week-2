import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "@/utils/theme";

export default function Card({
  children,
  onPress,
  style = {},
  padding = 16,
  marginHorizontal = 16,
  marginBottom = 16,
  borderRadius = 8,
}) {
  const theme = useTheme();

  const cardStyle = {
    backgroundColor: theme.colors.card.background,
    borderRadius,
    marginHorizontal,
    marginBottom,
    padding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity style={cardStyle} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
