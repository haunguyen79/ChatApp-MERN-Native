// rafce
// rnfes : React Native Functional Exported Stateless
// rnfe : React Native Functional Exported Component

import { View, StatusBar } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import React, { useEffect } from "react";
import "../global.css";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.replace("/(auth)/welcome"), 1500);
  }, [router]);

  return (
    <View className="flex-1 h-full w-full justify-center items-center bg-neutral-900">
      <StatusBar barStyle={"light-content"} className="bg-neutral-900" />
      <Animated.Image
        source={require("../assets/images/splashImage.png")}
        entering={FadeInDown.duration(700).springify()}
        className="h-[23%] aspect-square" //tỷ lệ khung hình 1:1 - tức là chiều rộng bằng chiều cao, tạo ra hình vuông.
        resizeMode={"contain"}
      />
    </View>
  );
};

export default SplashScreen;
