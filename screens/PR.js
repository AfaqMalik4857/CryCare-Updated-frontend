import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";

const PR = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["transparent", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <TouchableOpacity
        style={{ marginLeft: 20, marginTop: 65 }}
        onPress={() => navigation.navigate("Register")}
      >
        <Icon name="arrow-back-outline" size={28} color="black" />
      </TouchableOpacity>
      <Image
        source={require("../assets/crycarelogo.png")}
        style={styles.logo}
      />
      <ScrollView>
        <Text
          style={{
            marginTop: 50,
            marginLeft: 10,
            marginBottom: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            Privacy Policy{" "}
          </Text>
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          This Privacy Policy outlines how Cry-Care collects, uses, and protects
          your personal information when you use our application.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          1. Information We Collect{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Personal Information:</Text> We
          may collect personal information such as your name, email address, and
          any other details you provide during registration.
          <Text style={{ fontWeight: "bold" }}>Usage Data:</Text> We collect
          information about how you use the application, including your
          interactions with features and services.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          2. How We Use Your Information{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          We use the information we collect for the following purposes:{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 3,
          }}
        >
          1. To provide and maintain our application.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
          }}
        >
          2. To notify you about changes to our application.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
          }}
        >
          3. To allow you to participate in interactive features when you choose
          to do so.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
          }}
        >
          4. To provide customer support.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
          }}
        >
          5. To monitor the usage of our application.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
            margin: 10,
          }}
        >
          6. To detect, prevent, and address technical issues.{" "}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          3. Data Security{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          We value your data security and take appropriate measures to protect
          your personal information. However, no method of transmission over the
          internet or electronic storage is 100% secure.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          4. Sharing Your Information{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          We do not share your personal information with third parties without
          your consent, except as required by law or to protect our rights.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          5. Your Rights{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          You have the right to:{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 3,
          }}
        >
          1. Access and request copies of your personal information.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
          }}
        >
          2. Request corrections to any inaccurate information.{" "}
        </Text>
        <Text
          style={{
            fontSize: 18,
            marginLeft: 10,
            marginTop: 1,
            margin: 10,
          }}
        >
          3. Withdraw your consent at any time.{" "}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          6. Children’s Privacy{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          Cry-Care does not knowingly collect personal information from children
          under 2 years. If you are a parent or guardian and believe your child
          has provided us with personal information, please contact us.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          7. Changes to This Privacy Policy{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", marginLeft: 10 }}>
          8. Contact Information{" "}
        </Text>
        <Text
          style={{
            margin: 10,
            textAlign: "justify",
            fontSize: 18,
          }}
        >
          For any questions regarding these Privacy Policy, please contact us at
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
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 800,
  },
  logo: {
    width: 200,
    height: 53,
    alignSelf: "center",
    marginTop: 5,
  },
});

export default PR;
