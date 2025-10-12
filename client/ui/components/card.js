import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { cards_data } from "../../utils";

/**
 * @param {string} data - "deck", "thrown" or "<int>": card index in player's hand
 * @param {string} type - card's type
  */
export default function Card({ type, onPress, data }) {
  const card = cards_data[type];
  if (!card) return null;

  return (
    <Pressable onPress={onPress} style={[styles.card]}>
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
    width: 100,
    height: 150,
    margin: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});