import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

const SplashScreens = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigateToWelcome = () => {
    navigation.navigate("Welcome");
  };

  let loadingTimeout = () => {
    setIsLoading(true);
    setTimeout(navigateToWelcome, 1000);
  };

  useEffect(() => {
    setTimeout(loadingTimeout, 1000);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.body}>
        <Image
          source={require("../assets/crycarelogoSplash.png")}
          style={styles.logostyle}
        />
        <Text></Text>
      </View>
      <View style={styles.footer}>
        {isLoading ? (
          <>
            <ActivityIndicator size={moderateScale(48)} color={"#093f91"} />
            <Text style={styles.LoadingText}>Loading...</Text>
          </>
        ) : (
          <>
            <Text style={styles.fromText}>From</Text>
            <Text style={styles.crycareText}>CryCare</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(70),
  },
  header: {
    // height: 40,
    // width: 40,
    // backgroundColor: "red",
  },
  body: {
    // height: 40,
    // width: 40,
    // backgroundColor: "blue",
  },
  footer: {
    alignItems: "center",
    height: verticalScale(80),
    justifyContent: "flex-end",
  },
  fromText: {
    fontSize: moderateScale(12),
    color: "#867373",
  },
  crycareText: {
    fontSize: moderateScale(15),
    color: "#000000",
  },
  logostyle: {
    width: moderateScale(180),
    height: moderateScale(160),
  },
  LoadingText: {
    fontSize: moderateScale(15),
    color: "#093f91",
    fontWeight: "bold",
    marginTop: verticalScale(10),
  },
});

export default SplashScreens;
