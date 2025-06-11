import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";

const BabyCareGuide = () => {
  const navigation = useNavigation();

  const handleHealthAndWellness = () => {
    navigation.navigate("HealthAndWellness");
  };

  const handleFeedingAndNutrition = () => {
    navigation.navigate("FeedingAndNutrition");
  };

  const handleSleepAndComfort = () => {
    navigation.navigate("SleepAndComfort");
  };

  const handleParentingTips = () => {
    navigation.navigate("ParentingTips");
  };

  return (
    <View>
      <Text style={styles.featureText}>Baby Care Guides</Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleHealthAndWellness}
        >
          <Image
            source={require("../../assets/healthwellness.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Health and Wellness</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleFeedingAndNutrition}
        >
          <Image
            source={require("../../assets/feedingbaby.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Feeding and Nutrition</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleSleepAndComfort}
        >
          <Image
            source={require("../../assets/sleepingbaby.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Sleep and Comfort</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.GuideTabsoptionButton}
          onPress={handleParentingTips}
        >
          <Image
            source={require("../../assets/ParentingTips.png")}
            style={styles.babyGuideLogo}
          />
          <Text>Parenting Tips</Text>
        </TouchableOpacity>
      </View>
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
    flexWrap: "wrap",
    marginTop: verticalScale(20),
  },
  GuideTabsoptionButton: {
    width: "40%",
    height: moderateScale(90),
    padding: moderateScale(15),
    marginBottom: verticalScale(20),
    marginLeft: moderateScale(22),
    borderRadius: moderateScale(15),
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

export default BabyCareGuide;
