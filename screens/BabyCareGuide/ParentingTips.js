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
import parentingTipsImage from "../../assets/ParentingTips.png";
import BackToHome from "../../components/BackToHome";

const ParentingTips = ({ navigation }) => {
  const [showTantrums, setShowTantrums] = useState(false);
  const [showSiblingBonding, setShowSiblingBonding] = useState(false);
  const [showSelfCare, setShowSelfCare] = useState(false);

  const handleReadMore = (section) => {
    switch (section) {
      case "Tantrums":
        setShowTantrums(!showTantrums);
        break;
      case "Sibling Bonding":
        setShowSiblingBonding(!showSiblingBonding);
        break;
      case "Self-Care":
        setShowSelfCare(!showSelfCare);
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
        <View style={{ flexDirection: "row" }}>
          <Image
            source={parentingTipsImage}
            style={{
              width: 45,
              height: 50,
              alignSelf: "flex-start",
              marginLeft: 5,
              marginRight: 10,
            }}
          />
          <Text style={styles.title}>Parenting Tips</Text>
        </View>
        <Text style={styles.subtitle}>
          Guidance for every stage of parenting
        </Text>
      </View>

      <ScrollView style={styles.contentSection}>
        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Managing Tantrums</Text>
            <Text style={styles.description}>
              - Stay calm and avoid yelling.
            </Text>
            <Text style={styles.description}>
              - Distract with toys or activities.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Tantrums")}
            >
              <Text style={styles.readMoreText}>
                {showTantrums ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showTantrums && (
              <View style={styles.expandedContent}>
                <Text>• Distract with soft toys.</Text>
                <Text>• Use a calm and soothing voice.</Text>
                <Text>• Set clear and consistent boundaries.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Sibling Bonding</Text>
            <Text style={styles.description}>
              - Encourage older siblings to help with baby tasks.
            </Text>
            <Text style={styles.description}>
              - Spend one-on-one time with each child.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Sibling Bonding")}
            >
              <Text style={styles.readMoreText}>
                {showSiblingBonding ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showSiblingBonding && (
              <View style={styles.expandedContent}>
                <Text>• Praise positive interactions.</Text>
                <Text>• Share caregiving tasks with the older child.</Text>
                <Text>• Ensure equal attention for both siblings.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentItem}>
          <Icon size={24} color="#4c8bf5" />
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Self-Care for Parents</Text>
            <Text style={styles.description}>
              - Rest whenever the baby sleeps.
            </Text>
            <Text style={styles.description}>
              - Share responsibilities with your partner.
            </Text>
            <Text style={styles.description}>
              - Join parenting support groups for advice.
            </Text>
            <TouchableOpacity
              style={styles.readMoreButton}
              onPress={() => handleReadMore("Self-Care")}
            >
              <Text style={styles.readMoreText}>
                {showSelfCare ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
            {showSelfCare && (
              <View style={styles.expandedContent}>
                <Text>• Find moments for personal relaxation.</Text>
                <Text>• Ask for help when needed.</Text>
                <Text>• Prioritize sleep and healthy habits.</Text>
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

export default ParentingTips;
