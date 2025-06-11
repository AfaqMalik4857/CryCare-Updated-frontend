import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

const SubmitButton = ({ handleSubmit, btnTitle, loading }) => {
  return (
    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
      <Text style={styles.btnText}>
        {loading ? "Please Wait..." : btnTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    height: 40,
    backgroundColor: "#2c709e",
    borderRadius: 10,
    marginTop: 90,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 120,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default SubmitButton;
