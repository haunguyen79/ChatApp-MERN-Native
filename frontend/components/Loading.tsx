import { View, ActivityIndicator, ActivityIndicatorProps } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

const Loading = ({
  size = "large",
  color = colors.primaryDark,
}: ActivityIndicatorProps) => {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
