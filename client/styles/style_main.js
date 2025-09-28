import { StyleSheet } from "react-native";

export const stylesMain = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(143, 143, 143, 1)", 
  },
  subcontainer: {
    width: "90%",
    borderRadius: 20,
    borderStyle: "solid",
    flex: 1,
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(114, 114, 114, 1)", 
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    textAlign: "center",

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});