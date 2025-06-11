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

const Hungry = ({ navigation }) => {
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
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={28} style={styles.backIcon} />
        </TouchableOpacity> */}
        <Image
          source={require("../../assets/HungryBaby.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Hunger Cry</Text>
        <Text style={styles.subtitle}>
          Understand your baby's hunger cues and remedies.
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentSection}>
        {/* Indicators Section */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => toggleSection("indicators")}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Indicators</Text>
            <Icon
              name={
                showIndicators ? "chevron-up-outline" : "chevron-down-outline"
              }
              size={20}
              color="#0062cc"
            />
          </View>
          {showIndicators && (
            <View style={styles.cardContent}>
              <Text style={styles.textItem}>
                • Rooting (turning head toward objects near their mouth).
              </Text>
              <Text style={styles.textItem}>
                • Sucking on hands or fingers.
              </Text>
              <Text style={styles.textItem}>
                • Short, low-pitched repetitive cries.
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
            <Icon
              name={
                showRemedies ? "chevron-up-outline" : "chevron-down-outline"
              }
              size={20}
              color="#0062cc"
            />
          </View>
          {showRemedies && (
            <View style={styles.cardContent}>
              <Text style={styles.textItem}>1. Feed the Baby:</Text>
              <Text style={styles.subItem}>
                • Offer breast milk or formula as per the baby’s feeding
                schedule.
              </Text>
              <Text style={styles.subItem}>
                • Ensure proper latch for effective breastfeeding.
              </Text>
              <Text style={styles.textItem}>2. Burp the Baby:</Text>
              <Text style={styles.subItem}>
                • Hold upright and gently pat/rub their back to release gas.
              </Text>
              <Text style={styles.textItem}>3. Check Feeding Gaps:</Text>
              <Text style={styles.subItem}>
                • Ensure feeding every 2-3 hours for newborns.
              </Text>
              <Text style={styles.textItem}>4. Warm Milk for Comfort:</Text>
              <Text style={styles.subItem}>
                • Ensure formula/stored milk is comfortably warm.
              </Text>
              <Text style={styles.textItem}>5. Offer a Pacifier:</Text>
              <Text style={styles.subItem}>
                • Sucking for comfort can help soothe crying.
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
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 50,
  },
  backIcon: {
    color: "#032757",
  },
  logo: {
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
  contentSection: {
    margin: 20,
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
  subItem: {
    fontSize: 14,
    color: "#4c4c4c",
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    padding: 5,
  },
  actionButton: {
    backgroundColor: "#2c709e",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default Hungry;
