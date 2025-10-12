import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import Card from "./card";

export default function AnimatedCardOverlay({ from, to, type, data, onFinish }) {
  const pos = useRef(new Animated.ValueXY(from)).current;

  useEffect(() => {
    Animated.timing(pos, {
      toValue: to,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.absolute,
        { transform: pos.getTranslateTransform() },
      ]}
    >
      <Card type={type} data={data} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    width: 100,
    height: 150,
  },
});