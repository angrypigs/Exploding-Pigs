import React, { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';

import { cards_data } from '../../utils';

export default function AnimatedCard({ animData, onFinish }) {
  const w = animData.width ?? 100;
  const h = animData.height ?? 150;
  const card = cards_data[animData.type];
  console.log(animData)

  const x = useSharedValue(animData.x); // środek startowy X
  const y = useSharedValue(animData.y); // środek startowy Y

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x.value - w / 2, // żeby środek karty był w x.value
    top: y.value - h / 2,  // żeby środek karty był w y.value
    width: w,
    height: h,
    opacity: 1,
  }));

  useEffect(() => {
    const delay = animData.delay ?? 0;

    x.value = withDelay(
      delay,
      withTiming(animData.targetX, { duration: 800 })
    );

    y.value = withDelay(
      delay,
      withTiming(animData.targetY, { duration: 800 }, (finished) => {
        if (finished) runOnJS(onFinish)();
      })
    );
  }, []);

  if (!card) return null;

  return (
    <Animated.Image
      source={card.img}
      resizeMode="contain"
      style={style}
    />
  );
}