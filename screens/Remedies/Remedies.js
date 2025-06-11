import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const Remedies = () => {
  const navigation = useNavigation();

  const handleHungry = () => {
    navigation.navigate("Hungry");
  };

  const handleSleep = () => {
    navigation.navigate("Sleep");
  };

  const handlePain = () => {
    navigation.navigate("Pain");
  };

  const handleBurping = () => {
    navigation.navigate("Burping");
  };

  return (
    <View>
      <Text style={styles.featureText}>Remedies</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleHungry}
        >
          <Image
            source={require("../../assets/HungryBaby.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Hungry</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handlePain}
        >
          <Image
            source={require("../../assets/Pains.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Pain</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleSleep}
        >
          <Image
            source={require("../../assets/Sleep.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Sleep</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleBurping}
        >
          <Image
            source={require("../../assets/burping.png")}
            style={{
              width: moderateScale(40),
              height: moderateScale(40),
              marginBottom: verticalScale(8),
            }}
          />
          <Text>Burping</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  featureText: {
    color: "rgb(86, 85, 85)",
    marginLeft: moderateScale(20),
    marginTop: verticalScale(15),
    fontSize: moderateScale(22),
    fontWeight: "500",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(10),
  },
  GuideTabsoptionButton: {
    width: moderateScale(90),
    height: moderateScale(90),
    marginTop: moderateScale(20),
    marginBottom: moderateScale(20),
    marginRight: moderateScale(10),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(10),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d7e8f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  babyGuideLogo: {
    width: moderateScale(45),
    height: moderateScale(40),
    marginBottom: verticalScale(8),
  },
});

export default Remedies;
