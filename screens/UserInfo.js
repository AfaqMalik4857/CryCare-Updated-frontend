import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const UserInfo = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const { name, gender, email } = state?.user || {};

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#ffffff"]}
        style={styles.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Account")}
        >
          <Icon name="arrow-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Image
          source={require("../assets/crycarelogo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>User Information</Text>

        {/* Descriptive Text */}
        <Text style={styles.description}>
          Here you can view your personal information.
        </Text>
        <Text style={styles.description}>
          Make sure your details are up to date for a better experience.
        </Text>

        {/* User Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Name: {name}</Text>
          <Text style={styles.infoText}>Gender: {gender}</Text>
          <Text style={styles.infoText}>Email: {email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(20),
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(50),
  },
  backButton: {
    marginRight: moderateScale(10),
  },
  logo: {
    width: moderateScale(150),
    height: moderateScale(40),
    marginLeft: moderateScale(40),
  },
  content: {
    alignItems: "left",
    marginLeft: moderateScale(30),
    marginTop: verticalScale(40),
  },
  title: {
    fontSize: moderateScale(25),
    fontWeight: "bold",
    marginBottom: verticalScale(10),
  },
  description: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(10),
    paddingHorizontal: moderateScale(3),
    marginRight: moderateScale(30),
    color: "#555",
  },
  placeholderText: {
    color: "#888",
  },
  infoCard: {
    marginTop: moderateScale(20),
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  infoText: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(10),
    fontWeight: "600",
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});

export default UserInfo;
