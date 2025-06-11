import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const About = ({ navigation }) => {
  const [state] = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <TouchableOpacity
        style={{ marginLeft: 20, marginTop: 65 }}
        onPress={() => navigation.navigate("Account")}
      >
        <Icon name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={styles.logo}
      />
      <ScrollView>
        <Text
          style={{
            margin: 20,
            marginTop: 50,
            textAlign: "justify",
            fontSize: 17,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Cry-Care: </Text>
          <Text style={{ fontWeight: "bold" }}>
            Intelligent Baby Cry Recognition and Healthcare Assistant
          </Text>{" "}
          is an innovative project designed to bridge the communication gap
          between infants and their caregivers by accurately interpreting baby
          cries using advanced machine learning and audio processing techniques.
          Understanding a baby's needs based on their cry patterns is a
          persistent challenge for parents and caregivers, leading to potential
          delays in responding to a baby's{" "}
          <Text style={{ fontWeight: "bold" }}>
            discomfort, hunger, pain, or need for sleep.
          </Text>
        </Text>
        <Text
          style={{
            margin: 20,
            textAlign: "justify",
            fontSize: 17,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Cry-Care</Text> addresses this
          issue by developing a sophisticated web application capable of
          analyzing audio recordings of baby cries, classifying them into
          specific categories such as hunger, discomfort, belly pain, burping,
          and tiredness. The early years of a child’s life are critical for
          their development, and effective communication between a baby and
          their caregivers is essential for ensuring their well-being. However,
          one of the most common challenges new parents and caregivers face is
          interpreting a baby's cries, which are often the primary form of
          communication for infants. Babies cry for various reasons, such as
          hunger, discomfort, pain, or tiredness.
        </Text>
      </ScrollView>
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
    height: 200,
  },
  logo: {
    width: 200,
    height: 53,
    alignSelf: "center",
  },
});

export default About;
