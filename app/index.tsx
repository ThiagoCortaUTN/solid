import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
  FadeIn,
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";

const text = "Hello there";

const generateRandomColor = () => ({
  newRed: Math.random() * 255,
  newGreen: Math.random() * 255,
  newBlue: Math.random() * 255,
});

export default function App() {
  const red = useSharedValue(255);
  const green = useSharedValue(255);
  const blue = useSharedValue(255);
  const textColorProgress = useSharedValue(0);

  const onPress = () => {
    const { newRed, newGreen, newBlue } = generateRandomColor();

    red.value = withSpring(newRed);
    green.value = withSpring(newGreen);
    blue.value = withSpring(newBlue);

    // https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
    const luminance = Math.round(
      0.2126 * newRed + 0.7152 * newGreen + 0.0722 * newBlue
    );

    textColorProgress.value = withSpring(luminance > 127.5 ? 0 : 1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgb(${red.value}, ${green.value}, ${blue.value})`,
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      textColorProgress.value,
      [0, 1],
      ["#000000", "#FFFFFF"]
    ),
  }));

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      accessible={true}
      accessibilityLabel="Change background color"
      accessibilityHint="Tap to generate a new random background color"
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <Animated.View style={styles.textContainer}>
          {text.split("").map((letter, index) => (
            <Animated.Text
              key={index}
              entering={FadeIn.duration(400).delay(index * 150)}
              style={[styles.text, textStyle]}
            >
              {letter}
            </Animated.Text>
          ))}
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 50,
  },
});
