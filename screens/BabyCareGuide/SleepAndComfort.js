import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import BackToHome from "../../components/BackToHome";

const SleepAndComfort = ({ navigation }) => {
  const [showSleepTraining, setShowSleepTraining] = useState(false);
  const [showComfortTechniques, setShowComfortTechniques] = useState(false);
  const [showSleepSafety, setShowSleepSafety] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        ></TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/sleepingbaby.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Sleep & Comfort</Text>
        </View>
        <Text style={styles.subtitle}>
          Essential tips for your baby's sleep
        </Text>
      </View>

      <ScrollView style={styles.contentSection}>
        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Sleep Training</Text>
            <Text style={styles.description}>
              - Tips for getting your baby to sleep on a schedule.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowSleepTraining(!showSleepTraining)}
            >
              <Text style={styles.readMoreText}>
                {showSleepTraining ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showSleepTraining && (
              <View style={styles.details}>
                <Text>
                  • Create a bedtime routine: Bath, storytime, lullabies.
                </Text>
                <Text>• Gradually reduce night feeding.</Text>
                <Text>• Use a consistent sleep schedule.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Comfort Techniques</Text>
            <Text style={styles.description}>
              - Techniques to comfort your baby and promote relaxation.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowComfortTechniques(!showComfortTechniques)}
            >
              <Text style={styles.readMoreText}>
                {showComfortTechniques ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showComfortTechniques && (
              <View style={styles.details}>
                <Text>• Swaddling: Wrap baby snugly but not too tight.</Text>
                <Text>
                  • White Noise: Mimics sounds from the womb, calms baby.
                </Text>
                <Text>• Recognizing Sleep Cues:</Text>
                <Text style={styles.subSectionTitle}>o Rubbing eyes.</Text>
                <Text style={styles.subSectionTitle}>o Reduced activity.</Text>
                <Text style={styles.subSectionTitle}>o Yawning.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Sleep Safety</Text>
            <Text style={styles.description}>
              - Ensure a safe sleep environment for your baby.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowSleepSafety(!showSleepSafety)}
            >
              <Text style={styles.readMoreText}>
                {showSleepSafety ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showSleepSafety && (
              <View style={styles.details}>
                <Text>• Always place baby on their back to sleep.</Text>
                <Text>
                  • Use a firm mattress with no loose bedding or toys.
                </Text>
                <Text>• Room temperature should be between 68-72°F.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Related Topics:</Text>
          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => navigation.navigate("HealthAndWellness")}
          >
            <Text style={styles.footerLinkText}>Health & Wellness</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerLink}
            onPress={() => console.log("Milestones clicked")}
          ></TouchableOpacity>
          <BackToHome />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#f4f7fc",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  logo: {
    width: 50,
    height: 53,
    alignSelf: "flex-start",
    marginLeft: 5,
    marginRight: 10,
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#032757",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#032757",
    marginTop: 5,
  },
  contentSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  contentItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#032757",
  },
  description: {
    fontSize: 16,
    color: "#032757",
    marginTop: 5,
  },
  readMoreButton: {
    marginTop: 10,
    backgroundColor: "#2c709e",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  readMoreText: {
    color: "#fff",
    fontSize: 14,
  },
  details: {
    marginTop: 10,
  },
  subSectionTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#032757",
    marginBottom: 10,
  },
  footerLink: {
    marginBottom: 10,
  },
  footerLinkText: {
    fontSize: 16,
    color: "#2c709e",
    textDecorationLine: "underline",
  },
});

export default SleepAndComfort;
