import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageCarousel from "../components/Slider";
import history from "../assets/history.jpg";
import voice from "../assets/voice.jpeg";
import use from "../assets/use.jpg";
import { moderateScale, verticalScale } from "react-native-size-matters";

const Welcome = ({ navigation }) => {
  //global state
  const [state, setState] = useContext(AuthContext);

  //temp function to check local storage data
  const getLocalStorageData = async () => {
    let data = await AsyncStorage.getItem("@auth");
    console.log("Local Storage", data);
  };
  const carousalImages = [
    { source: voice, text: "Recognize Child Voice" },
    { source: history, text: "To Maintain History" },
    { source: use, text: "Easy To Use" },
  ];
  getLocalStorageData();
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={{
          width: moderateScale(283),
          height: moderateScale(75),
          alignSelf: "center",
          marginTop: verticalScale(70),
        }}
      />

      <View
        style={{
          marginTop: verticalScale(80),
          backgroundColor: "#d7e8f4",
          height: moderateScale(700),
          width: "100%",
          borderTopEndRadius: moderateScale(80),
          borderTopLeftRadius: moderateScale(80),
        }}
      >
        <Text style={styles.pageTitle}>Welcome to CryCare</Text>
        <Text style={styles.pageTitleText}>
          We're excited to support you in effortlessly managing your baby's
          information.
        </Text>
        <View>
          <ImageCarousel images={carousalImages} />
        </View>

        <View
          style={{
            marginTop: verticalScale(10),
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/* <Text>{JSON.stringify({name, email, password}, null, 4)} </Text> */}

          <TouchableOpacity
            style={{
              backgroundColor: "#2c709e",
              marginLeft: moderateScale(25),
              marginTop: verticalScale(20),
              height: moderateScale(45),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: moderateScale(25),
              color: "white",
              width: moderateScale(150),
            }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#2c709e",

              marginRight: moderateScale(20),
              marginTop: verticalScale(20),
              height: moderateScale(45),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: moderateScale(25),
              color: "white",
              width: moderateScale(150),
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
    marginTop: verticalScale(25),
    marginBottom: verticalScale(5),
    textAlign: "center",
    color: "#174684",
  },
  pageTitleText: {
    fontSize: moderateScale(15),
    fontWeight: "bold",
    marginBottom: verticalScale(20),
    textAlign: "center",
    color: "#174684",
    padding: moderateScale(10),
  },
});

export default Welcome;
