import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const FooterMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Icon
          name="home-outline"
          style={styles.iconStyle}
          color={route.name === "Home" && "#094e7c"}
        />

        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("History")}>
        <Icon
          name="timer-outline"
          style={styles.iconStyle}
          color={route.name === "History" && "#094e7c"}
        />
        <Text>History</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <Icon
          name="person-outline"
          style={styles.iconStyle}
          color={route.name === "Account" && "#094e7c"}
        />
        <Text>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#b5d2e5",
    borderTopRightRadius: moderateScale(18),
    borderTopLeftRadius: moderateScale(18),
    paddingTop: verticalScale(5),
    paddingBottom: verticalScale(8),
  },
  iconStyle: {
    marginBottom: verticalScale(2),
    alignSelf: "center",
    fontSize: moderateScale(25),
  },
});

export default FooterMenu;
