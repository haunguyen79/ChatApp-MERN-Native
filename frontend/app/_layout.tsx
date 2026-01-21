import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/contexts/authContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import { useEffect } from "react";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(main)/profileModal"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="(main)/newConversationModal"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

const RootLayout = () => {
  useEffect(() => {
    // Suppress specific SafeAreaView deprecation warning coming from some libs
    LogBox.ignoreLogs([
      "SafeAreaView has been deprecated and will be removed in a future release",
    ]);
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StackLayout />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
