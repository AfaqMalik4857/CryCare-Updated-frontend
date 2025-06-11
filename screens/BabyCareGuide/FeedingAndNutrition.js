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
import feedingbaby from "../../assets/feedingbaby.png";
import BackToHome from "../../components/BackToHome";

const FeedingAndNutrition = ({ navigation }) => {
  const [showBreastfeeding, setShowBreastfeeding] = useState(false);
  const [showFormulaFeeding, setShowFormulaFeeding] = useState(false);
  const [showSolids, setShowSolids] = useState(false);

  const handleReadMore = (section) => {
    switch (section) {
      case "Breastfeeding":
        setShowBreastfeeding(!showBreastfeeding);
        break;
      case "Formula Feeding":
        setShowFormulaFeeding(!showFormulaFeeding);
        break;
      case "Introducing Solids":
        setShowSolids(!showSolids);
        break;
      default:
        break;
    }
  };

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
          <Image source={feedingbaby} style={styles.logo} />
          <Text style={styles.title}> Feeding & Nutrition</Text>
        </View>
        <Text style={styles.subtitle}>Essential tips to nourish your baby</Text>
      </View>

      <ScrollView style={styles.contentSection}>
        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Breastfeeding Tips</Text>
            <Text style={styles.description}>
              - Learn about proper latching and positions.
            </Text>
            <Text style={styles.description}>
              - How often to breastfeed your baby.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Breastfeeding")}
            >
              <Text style={styles.readMoreText}>
                {showBreastfeeding ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showBreastfeeding && (
              <View style={styles.expandedContent}>
                <Text>• Positions:</Text>
                <Text> - Cradle hold.</Text>
                <Text> - Football hold.</Text>
                <Text> - Side-lying position.</Text>
                <Text>• Tips:</Text>
                <Text>
                  {" "}
                  - Ensure baby latches properly (chin touching breast, lips
                  flared outward).
                </Text>
                <Text> - Breastfeed every 2-3 hours.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Formula Feeding</Text>
            <Text style={styles.description}>
              - Safe preparation methods and storage tips.
            </Text>
            <Text style={styles.description}>
              - Feeding schedule for newborns.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Formula Feeding")}
            >
              <Text style={styles.readMoreText}>
                {showFormulaFeeding ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showFormulaFeeding && (
              <View style={styles.expandedContent}>
                <Text>
                  • Prepare formula as per manufacturer’s instructions.
                </Text>
                <Text>• Always discard leftover milk after 1 hour.</Text>
                <Text>• Use clean and sterilized feeding equipment.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>
              Introducing Solids (6+ Months)
            </Text>
            <Text style={styles.description}>
              - Start with single-grain cereals (e.g., rice cereal mixed with
              breast milk).
            </Text>
            <Text style={styles.description}>
              - Gradually introduce mashed fruits (e.g., banana, apple).
            </Text>
            <Text style={styles.description}>
              - Avoid honey and cow’s milk before 1 year.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Introducing Solids")}
            >
              <Text style={styles.readMoreText}>
                {showSolids ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showSolids && (
              <View style={styles.expandedContent}>
                <Text>• Sample Feeding Schedule:</Text>
                <Text> - Morning: Baby cereal.</Text>
                <Text> - Noon: Mashed veggies.</Text>
                <Text> - Evening: Breast milk or formula.</Text>
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
  logo: {
    width: 45,
    height: 50,
    alignSelf: "flex-start",
    marginLeft: 5,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
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
  expandedContent: {
    marginTop: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: "#032757",
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

export default FeedingAndNutrition;
