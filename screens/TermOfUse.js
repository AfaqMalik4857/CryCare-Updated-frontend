import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import FooterMenu from "../components/FooterMenu";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const TermOfUse = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <TouchableOpacity
        style={{ marginLeft: 20, marginTop: 65 }}
        onPress={() => navigation.navigate("Account")}
      >
        <Icon name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={styles.logo}
      />
      <ScrollView>
        <Text style={styles.innerText}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            Terms of Use{" "}
          </Text>
        </Text>
        <Text style={styles.innerText}>
          Welcome to Cry-Care! By using our application, you agree to the
          following terms and conditions. If you do not agree with these terms,
          please do not use the application.
        </Text>
        <Text style={styles.headingText}>1. Acceptance of Terms </Text>
        <Text style={styles.innerText}>
          By accessing or using Cry-Care, you agree to comply with and be bound
          by these Terms of Use.
        </Text>
        <Text style={styles.headingText}>2. User Responsibilities </Text>
        <Text style={styles.innerText}>
          Users must provide accurate information during registration and update
          their details as necessary. Users agree not to misuse the application
          or access it through unauthorized means.
        </Text>
        <Text style={styles.headingText}>3. License to Use </Text>
        <Text style={styles.innerText}>
          Cry-Care grants you a limited, non-exclusive,non-transferable license
          to use the application for personal, non-commercial purposes.
        </Text>
        <Text style={styles.headingText}>4. Intellectual Property </Text>
        <Text style={styles.innerText}>
          All content, features, and functionalities of Cry-Care, including but
          not limited to software, text, graphics, and logos, are owned by
          Cry-Care or its licensors and are protected by applicable copyright
          and trademark laws.
        </Text>
        <Text style={styles.headingText}>5. Disclaimer of Warranties </Text>
        <Text style={styles.innerText}>
          The application is provided "as is" and "as available" without
          warranties of any kind. We do not guarantee that the application will
          be error-free, secure, or uninterrupted.
        </Text>
        <Text style={styles.headingText}>6. Limitation of Liability </Text>
        <Text style={styles.innerText}>
          In no event shall Cry-Care be liable for any indirect, incidental,
          special, consequential, or punitive damages arising out of your use of
          the application.
        </Text>
        <Text style={styles.headingText}>7. Changes to Terms </Text>
        <Text style={styles.innerText}>
          We reserve the right to modify these Terms of Use at any time. Changes
          will be effective immediately upon posting the revised terms.
        </Text>
        <Text style={styles.headingText}>8. Contact Information </Text>
        <Text style={styles.innerText}>
          For any questions regarding these Terms of Use, please contact us at
          afaqmalik4857@gmail.com
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
  },
  innerText: {
    margin: 10,
    textAlign: "justify",
    fontSize: 16,
  },
  headingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  logo: {
    width: 200,
    height: 53,
    alignSelf: "center",
    marginTop: 5,
  },
});

export default TermOfUse;
