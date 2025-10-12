import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { cards_data } from "../../utils";

/**
 * @param {string} type - card's type
  */
export default function Card({ type, onPress, coords, width = 100, height = 150 }) {
  const card = cards_data[type];
  if (!card) return null;
  console.log(coords);

  return (
    <Pressable onPress={onPress} style={[styles.card, 
      {width, height, left: coords[0] - width / 2, top: coords[1] - height / 2}
    ]}>
      <Image
        source={card.img}
        resizeMode="contain"
        style={styles.image}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: 100,
    height: 150,
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});