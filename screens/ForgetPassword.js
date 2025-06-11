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

  const handleResetRequest = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const response = await fetch(`http://${baseIP}:8080/forgetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if the response is ok (status in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json(); // Get error details
        Alert.alert("Error", errorData.message);
        return; // Exit if there's an error
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Success", "Email sent successfully");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Network error occurred");
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
        <Text style={{ marginBottom: 30, fontSize: 16, color: "#174684" }}>
          Enter your email address associated with your account and We'll send
          your password reset info to the email address linked to your account.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          onChange={(e) => setEmail(e.target.value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleResetRequest}>
          <Text style={styles.buttonText}>Reset Password</Text>
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
    width: 150,
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

export default ForgetPassword;
