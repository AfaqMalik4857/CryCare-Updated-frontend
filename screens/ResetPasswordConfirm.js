import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import React, { useContext, useState } from "react";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/authContext";
import { baseIP } from "../const";

const ResetPasswordConfirm = ({ navigation, route }) => {
  const { forgotEmail } = useContext(AuthContext);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://${baseIP}:8080/resetpassword`,
        {
          email: forgotEmail,
          token: route.params?.token,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "There was an error processing your request."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["transparent", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginLeft: 20, marginTop: 65 }}
          onPress={() => navigation.navigate("Login")}
        >
          <Icon name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>

        <Image
          source={require("../assets/crycarelogo.png")}
          style={styles.logo}
        />
      </View>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Please enter your new password below.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Resetting..." : "Reset Password"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 800,
  },
  logo: {
    width: 200,
    height: 53,
    alignSelf: "flex-start",
    marginTop: 50,
    marginLeft: 10,
  },
  title: {
    color: "#174684",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 80,
    textAlign: "left",
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2c709e",
    padding: 15,
    width: 200,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ResetPasswordConfirm; 