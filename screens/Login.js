import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import InputBox from "../components/InputBox";
import SubmitButton from "../components/SubmitButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Login = ({ navigation }) => {
  //global state
  const [state, setState] = useContext(AuthContext);

  //States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  //Functions
  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (!email || !password) {
        Alert.alert("Required", "Please Fill All Fields");
        setLoading(false);
        return;
      }
      const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailPattern.test(email)) {
        Alert.alert("Error", "Please enter a valid email address.");
        return false;
      }
      console.log("Login Data", { email, password });

      const loginData = { email, password };
      setPassword("");
      setLoading(false);

      const { data } = await axios.post("login", {
        email,
        password,
      });
      setState(data);
      await AsyncStorage.setItem("@auth", JSON.stringify(data));

      navigation.navigate("Home");
    } catch (error) {
      alert(error.response.data.message);
      setLoading(false);
      console.log(error);
    }
  };
  //temp function to check local storage data
  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
    console.log("Local Storage", data);
  };
  getLocalStorageData();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={{ width: 285, height: 75, alignSelf: "center", marginTop: 80 }}
      />
      <Text style={styles.pageTitle}>Welcome back!</Text>
      <Text style={styles.pageTitleText}>Enter Your Details to Login</Text>
      <ScrollView
        style={{
          backgroundColor: "#d7e8f4",
          height: 700,
          width: "100%",
          borderTopRightRadius: 80,
          borderTopLeftRadius: 80,
        }}
      >
        <View
          style={{ marginHorizontal: 70, fontWeight: "bold", marginTop: 20 }}
        >
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
          <TouchableOpacity
            onPress={() => navigation.navigate("ForgetPassword")}
          >
            <Text
              style={{
                marginLeft: 120,
                marginTop: 15,
                color: "#2308d1",
                fontWeight: "bold",
              }}
            >
              Forget Password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Text>{JSON.stringify({name, email, password}, null, 4)} </Text> */}
        <SubmitButton
          btnTitle="Login"
          loading={loading}
          handleSubmit={handleSubmit}
        />

        <Text style={styles.linkText}>
          Don't have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
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

export default Login;
