import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import BackToHome from "../../components/BackToHome";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PainCry = ({ navigation }) => {
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
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={require("../../assets/Pains.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Pain Cry</Text>
        <Text style={styles.subtitle}>
          Understand your baby's pain cues and remedies.
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentSection}>
        {/* Indicators */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleSection("indicators")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Indicators</Text>
            <Icon
              name={showIndicators ? "chevron-up" : "chevron-down"}
              size={20}
              color="#0062cc"
            />
          </View>
          {showIndicators && (
            <View style={styles.cardContent}>
              <Text style={styles.textItem}>
                • High-pitched, intense, and sharp crying.
              </Text>
              <Text style={styles.textItem}>
                • Baby might arch their back or pull their legs toward their
                tummy.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Remedies */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleSection("remedies")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Remedies</Text>
            <Icon
              name={showRemedies ? "chevron-up" : "chevron-down"}
              size={20}
              color="#0062cc"
            />
          </View>
          {showRemedies && (
            <View style={styles.cardContent}>
              <Text style={styles.textItem}>
                1. Identify the Source of Pain:
              </Text>
              <Text style={styles.subItem}>
                • Check for tight clothing, diaper rashes, or skin irritation.
              </Text>
              <Text style={styles.subItem}>
                • Look for signs of teething (red gums, drooling).
              </Text>
              <Text style={styles.textItem}>2. Soothing Techniques:</Text>
              <Text style={styles.subItem}>
                • Gently massage the baby’s tummy if they seem gassy.
              </Text>
              <Text style={styles.subItem}>
                • Use a cool teething ring for gum pain.
              </Text>
              <Text style={styles.textItem}>
                3. Adjust the Baby’s Position:
              </Text>
              <Text style={styles.subItem}>
                • Hold the baby upright or in a comfortable position to reduce
                discomfort.
              </Text>
              <Text style={styles.textItem}>4. Check Temperature:</Text>
              <Text style={styles.subItem}>
                • Ensure the baby isn’t too hot or cold. Adjust clothing and
                room temperature as needed.
              </Text>
              <Text style={styles.textItem}>
                5. Use Doctor-Approved Medication:
              </Text>
              <Text style={styles.subItem}>
                • For teething or mild discomfort, consult a pediatrician for
                safe pain relief options (e.g., teething gels, baby
                acetaminophen).
              </Text>
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
    padding: 40,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",

    top: 50,
  },
  backIcon: {
    color: "#032757",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
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
    marginTop: 5,
  },
  contentSection: {
    margin: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
  subItem: {
    fontSize: 14,
    color: "#4c4c4c",
    marginLeft: 10,
  },
});

export default PainCry;
