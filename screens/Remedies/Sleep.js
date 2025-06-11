import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // For arrow icons
import Sleep from "../../assets/Sleep.png";
import BackToHome from "../../components/BackToHome";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SleepCry = ({ navigation }) => {
  const [showIndicators, setShowIndicators] = useState(false);
  const [showRemedies, setShowRemedies] = useState(false);

  const toggleSection = (section) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (section === "indicators") {
      setShowIndicators(!showIndicators);
    } else if (section === "remedies") {
      setShowRemedies(!showRemedies);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#e1eefd", "#f9fcff"]}
        style={styles.background}
      />
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={Sleep} style={styles.headerImage} />
        </View>
        <Text style={styles.title}>Sleep</Text>
        <Text style={styles.subtitle}>
          Understanding and soothing your baby's sleep cries
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Indicators Section */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleSection("indicators")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Indicators</Text>
            <Ionicons
              name={showIndicators ? "chevron-up" : "chevron-down"}
              size={24}
              color="#032757"
            />
          </View>
          {showIndicators && (
            <View style={styles.cardContent}>
              <Text style={styles.textItem}>
                • Whining or moaning cries, often escalating if the baby becomes
                overtired.
              </Text>
              <Text style={styles.textItem}>• Rubbing eyes or yawning.</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Remedies Section */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleSection("remedies")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Remedies</Text>
            <Ionicons
              name={showRemedies ? "chevron-up" : "chevron-down"}
              size={24}
              color="#032757"
            />
          </View>

          {showRemedies && (
            <View style={styles.cardContent}>
              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  1. Create a Calm Environment:
                </Text>
                <Text style={styles.remedyDescription}>
                  Dim the lights and reduce noise to signal bedtime.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>2. Swaddling:</Text>
                <Text style={styles.remedyDescription}>
                  Wrap the baby snugly in a swaddle to mimic the womb’s
                  security.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  3. Establish a Bedtime Routine:
                </Text>
                <Text style={styles.remedyDescription}>
                  Bath, storytime, or lullabies can help signal it’s time to
                  sleep.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>4. Use White Noise:</Text>
                <Text style={styles.remedyDescription}>
                  Play calming sounds like a heartbeat or gentle rain to help
                  the baby settle.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  5. Rock or Soothe the Baby:
                </Text>
                <Text style={styles.remedyDescription}>
                  Hold the baby close and gently rock them or pat their back
                  rhythmically.
                </Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        <BackToHome />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fcff",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerImage: {
    width: 60,
    height: 60,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#032757",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4c4c4c",
    textAlign: "center",
    marginTop: 5,
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#032757",
  },
  cardContent: {
    marginTop: 10,
  },
  textItem: {
    fontSize: 16,
    color: "#032757",
    marginVertical: 5,
  },
  remedyItem: {
    marginBottom: 15,
  },
  remedyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c709e",
  },
  remedyDescription: {
    fontSize: 16,
    color: "#4c5d77",
    marginLeft: 10,
    marginTop: 5,
  },
});

export default SleepCry;
