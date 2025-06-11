import { View, Text, StyleSheet, Image, Alert, ScrollView } from "react-native";
import React, { useState } from "react";
import InputBox from "../components/InputBox";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";

const Register = ({ navigation }) => {
  //States
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //Functions
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!name || !email || !password || !gender) {
        Alert.alert("Please Fill All Fields");
        setLoading(false);
        return;
      }
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return false;
      }

      console.log("Register Data", { name, email, password, gender });
      setLoading(false);
      const { data } = await axios.post("register", {
        name,
        gender,
        email,
        password,
      });

      Alert.alert("Registration Successful!", "You can now log in.");
      navigation.navigate("Login");
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={{ width: 285, height: 75, alignSelf: "center", marginTop: 80 }}
      />
      <Text style={styles.pageTitle}>Register</Text>
      <Text style={styles.pageTitleText}>Enter Your Details to Register</Text>
      <ScrollView
        style={{
          alignSelf: "center",
          backgroundColor: "#d7e8f4",
          width: "100%",
          borderTopRightRadius: 80,
          borderTopLeftRadius: 80,
        }}
      >
        <View style={{ marginHorizontal: 70, fontWeight: "bold" }}>
          <InputBox
            inputTitle={"Name"}
            value={name}
            setValue={setName}
            iconName="account-outline"
            placeholder="Enter Your Name"
          />
          <InputBox
            inputTitle={"Gender"}
            value={gender}
            setValue={setGender}
            iconName="account-multiple-outline"
          />
          <InputBox
            inputTitle={"Email"}
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            setValue={setEmail}
            iconName="email-outline"
          />
          <InputBox
            inputTitle={"Password"}
            secureTextEntry={true}
            autoComplete="password"
            value={password}
            setValue={setPassword}
            iconName="lock-outline"
          />
        </View>
        <Text style={styles.linkText}>
          By clicking register, you agree on our{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("PR")}>
            Privacy Policy
          </Text>
        </Text>
        {/* <Text>{JSON.stringify({name, email, password}, null, 4)} </Text> */}
        <SubmitButton
          btnTitle="Sign Up"
          loading={loading}
          handleSubmit={handleSubmit}
        />
        <Text style={styles.linkText}>
          Already Register?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 5,
    textAlign: "center",
    color: "#174684",
  },
  pageTitleText: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 1,
    marginBottom: 20,
    textAlign: "center",
    color: "#174684",
  },
  linkText: {
    marginTop: 15,
    textAlign: "center",
  },
  link: {
    color: "#2308d1",
    fontWeight: "bold",
  },
});

export default Register;
