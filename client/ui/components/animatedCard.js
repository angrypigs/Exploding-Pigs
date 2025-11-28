import { useEffect } from 'react';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

import { cards_data } from '../../utils';

export default function AnimatedCard({ animData, onFinish }) {
    const w = animData.width ?? 100;
    const h = animData.height ?? 150;
    const card = cards_data[animData.type];

    const x = useSharedValue(animData.x);
    const y = useSharedValue(animData.y);

    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        left: x.value - w / 2,
        top: y.value - h / 2,
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
            withTiming(animData.targetY, { duration: 800 }, finished => {
                if (finished) runOnJS(onFinish)();
            })
        );
    }, []);

    if (!card) return null;

    return (
        <Animated.Image source={card.img} resizeMode="contain" style={style} />
    );
}
