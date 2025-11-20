import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";


const BackButton = ({
  style,
  iconSize = 26,
  color = colors.white,
}: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => router.back()}
    >
      <ChevronLeft size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    // marginTop: verticalScale(0),
  },
});
