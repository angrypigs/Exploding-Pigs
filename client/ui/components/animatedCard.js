import { useEffect } from 'react';
import Animated, {
    Easing,
    ReduceMotion,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';
import { cards_data } from '../../utils/gameUtils';

export default function AnimatedCard({ animData, onFinish }) {
    const w = animData.width ?? 100;
    const h = animData.height ?? 150;
    const card = cards_data[animData.type];

    const x = useSharedValue(animData.x);
    const y = useSharedValue(animData.y);

    const opacity = useSharedValue(1);

    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        top: 0,
        left: 0,
        width: w,
        height: h,
        transform: [{ translateX: x.value - w / 2 }, { translateY: y.value - h / 2 }],
        opacity: opacity.value,
        zIndex: 1000,
    }));

    useEffect(() => {
        const delay = animData.delay ?? 0;
        const duration = 500;
        opacity.value = withTiming(1, { duration: 100 });
        x.value = withDelay(
            delay,
            withTiming(animData.targetX, {
                duration,
                easing: Easing.out(Easing.quad),
                reduceMotion: ReduceMotion.Never,
            })
        );

        y.value = withDelay(
            delay,
            withTiming(
                animData.targetY,
                { duration, easing: Easing.out(Easing.quad), reduceMotion: ReduceMotion.Never },
                finished => {
                    if (finished && onFinish) {
                        runOnJS(onFinish)();
                    }
                }
            )
        );

        opacity.value = withDelay(
            delay,
            withTiming(0, {
                duration,
                easing: Easing.in(Easing.exp),
                reduceMotion: ReduceMotion.Never,
            })
        );
    }, []);

    if (!card) return null;

    return (
        <Animated.View style={style}>
            <Animated.Image
                source={card.img}
                resizeMode="contain"
                style={{ width: '100%', height: '100%' }}
            />
        </Animated.View>
    );
}
