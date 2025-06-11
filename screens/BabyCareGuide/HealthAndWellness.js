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

const HealthAndWellness = ({ navigation }) => {
  const [showVaccination, setShowVaccination] = useState(false);
  const [showFever, setShowFever] = useState(false);
  const [showHygiene, setShowHygiene] = useState(false);

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
            source={require("../../assets/healthwellness.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Health & Wellness</Text>
        </View>
        <Text style={styles.subtitle}>Essential care tips for your baby</Text>
      </View>

      <ScrollView style={styles.contentSection}>
        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Vaccination Schedules</Text>
            <Text style={styles.description}>
              - Learn about recommended vaccines for your baby.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowVaccination(!showVaccination)}
            >
              <Text style={styles.readMoreText}>
                {showVaccination ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showVaccination && (
              <View style={styles.details}>
                <Text>• 0-2 Months: BCG, Hepatitis B, Polio.</Text>
                <Text>• 2-4 Months: DTP, Hib, Rotavirus.</Text>
                <Text>• 6 Months: Influenza, Hepatitis B booster.</Text>
                <Text>• 12 Months: MMR, Varicella, Hepatitis A.</Text>
                <Text>• 18 Months: DTP booster, IPV, MMR booster.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Managing Fever</Text>
            <Text style={styles.description}>
              - How to manage fever in your baby.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowFever(!showFever)}
            >
              <Text style={styles.readMoreText}>
                {showFever ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showFever && (
              <View style={styles.details}>
                <Text style={styles.subSectionTitle}>Symptoms:</Text>
                <Text>• High temperature, irritability, poor feeding.</Text>
                <Text style={styles.subSectionTitle}>Home Care:</Text>
                <Text>• Dress baby in light clothing.</Text>
                <Text>• Use lukewarm sponge baths.</Text>
                <Text>
                  • Administer acetaminophen (as per doctor’s advice).
                </Text>
                <Text style={styles.subSectionTitle}>
                  When to Consult a Doctor:
                </Text>
                <Text>• Fever lasts more than 3 days.</Text>
                <Text>• Baby under 3 months with a high fever.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Hygiene</Text>
            <Text style={styles.description}>
              - Basic hygiene practices for your baby.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => setShowHygiene(!showHygiene)}
            >
              <Text style={styles.readMoreText}>
                {showHygiene ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showHygiene && (
              <View style={styles.details}>
                <Text>• Sterilize bottles and pacifiers after every use.</Text>
                <Text style={styles.subSectionTitle}>Bathing Tips:</Text>
                <Text>• Use lukewarm water.</Text>
                <Text>• Clean creases and folds gently.</Text>
                <Text>• Pat dry thoroughly to prevent rashes.</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Related Topics:</Text>
        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => navigation.navigate("FeedingAndNutrition")}
        >
          <Text style={styles.footerLinkText}>Feeding & Nutrition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => console.log("Milestones clicked")}
        ></TouchableOpacity>
        <BackToHome />
      </View>
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
    width: 45,
    height: 50,
    alignSelf: "flex-start",
    marginLeft: 5,
    marginRight: 10,
    marginTop: 3,
  },
  header: {
    marginTop: 50,
    alignItems: "center",
  },
  backIcon: {
    color: "#032757",
    fontSize: 28,
    position: "absolute",
    left: 15,
    top: 10,
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

export default HealthAndWellness;
