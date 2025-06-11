import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

const BackToHome = () => {
  const navigation = useNavigation();
  return (
    // Added return statement
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.actionButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  actionButton: {
    backgroundColor: "#2c709e",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default BackToHome;
