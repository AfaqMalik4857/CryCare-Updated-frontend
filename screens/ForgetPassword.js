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

const ForgetPassword = ({ navigation }) => {
  const { setForgotEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async () => {
    // Validate email
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://${baseIP}:8080/forgetpassword`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setForgotEmail(email);
        Alert.alert(
          "Success",
          "Password reset instructions have been sent to your email.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("ResetPasswordConfirm"),
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
          Enter your email address associated with your account and we'll send
          password reset instructions to your email.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleResetRequest} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Send Reset Link"}
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
  buttonDisabled: {
    backgroundColor: "#a0a0a0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ForgetPassword; 