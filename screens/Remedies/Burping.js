import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackToHome from "../../components/BackToHome";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Burping = () => {
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
          <Image
            source={require("../../assets/burping.png")}
            style={styles.headerImage}
          />
        </View>
        <Text style={styles.title}>Burping</Text>
        <Text style={styles.subtitle}>
          Understanding and soothing your baby's burping cries
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
                • Short, repetitive cries that start after feeding.
              </Text>
              <Text style={styles.textItem}>
                • Baby appears restless, arches their back, or pulls their legs
                up.
              </Text>
              <Text style={styles.textItem}>
                • Signs of discomfort (e.g., clenched fists, bloated tummy).
              </Text>
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
                <Text style={styles.remedyTitle}>1. Burp the Baby:</Text>
                <Text style={styles.remedyDescription}>
                  o Hold the baby upright over your shoulder and gently pat or
                  rub their back to release trapped gas.
                </Text>
                <Text style={styles.remedyDescription}>
                  o Alternative position: Sit the baby on your lap, support
                  their chest and head, and pat their back.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  2. Change Feeding Position:
                </Text>
                <Text style={styles.remedyDescription}>
                  o Feed the baby in a more upright position to minimize air
                  intake.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  3. Use Anti-Colic Bottles:
                </Text>
                <Text style={styles.remedyDescription}>
                  o These bottles are designed to reduce the amount of air
                  swallowed during feeding.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>
                  4. Frequent Burping During Feeding:
                </Text>
                <Text style={styles.remedyDescription}>
                  o Burp the baby midway through the feeding session, especially
                  if they’re bottle-fed.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>5. Gentle Tummy Time:</Text>
                <Text style={styles.remedyDescription}>
                  o After feeding, place the baby on their tummy for a few
                  minutes (supervised) to help release gas.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>6. Avoid Overfeeding:</Text>
                <Text style={styles.remedyDescription}>
                  o Ensure you’re feeding the baby appropriate portions to
                  prevent discomfort.
                </Text>
              </View>

              <View style={styles.remedyItem}>
                <Text style={styles.remedyTitle}>7. Massage the Tummy:</Text>
                <Text style={styles.remedyDescription}>
                  o Use gentle, clockwise motions to help ease any gas buildup.
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

export default Burping;
