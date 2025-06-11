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

const ResetPasswordConfirm = ({ navigation }) => {
  const { setForgotEmail } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetRequestConfirm = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    try {
      const data = {
        email: email,
      };
      setLoading(true);
      const response = await axios
        .post("http://192.168.0.101:8080/forgetpassword", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.success) {
            setForgotEmail(email);
            navigation.navigate("ResetPasswordConfirm");
            Alert.alert(
              "Success",
              "A password reset link has been sent to your email."
            );
          } else {
            Alert.alert(
              "Error",
              response.data.message || "An error occurred. Please try again."
            );
          }
        });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      Alert.alert("Error", "There was an error processing your request.");
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
        <Text
          style={{ marginBottom: 30, fontSize: 16, color: "#174684" }}
        ></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetRequestConfirm}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Sending..." : "Reset Password"}
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

export default ResetPasswordConfirm;
