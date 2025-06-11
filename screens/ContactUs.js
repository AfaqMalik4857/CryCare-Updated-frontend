import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const ContactUs = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [name, setName] = useState(state?.user.name || "");
  const [email, setEmail] = useState(state?.user.email || "");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name || !email || !comment) {
      Alert.alert("Validation Error", "All fields are required.");
      return false;
    }
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailPattern.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (!validateInputs()) return;

    try {
      setLoading(true);
      // Send comment to your backend
      const response = await axios.post(`http://${baseIP}:8080/comments`, {
        name,
        email,
        comment,
      });
      Alert.alert("Success", response.data.message);
      // Clear inputs
      setName("");
      setEmail("");
      setComment("");
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an issue sending your message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#d7e8f5", "#f2f8fc", "transparent"]}
        style={styles.background}
      />
      <View style={styles.header}>
        {/* <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.navigate("Account")}
        >
          <Icon name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity> */}

        <Image
          source={require("../assets/crycarelogo.png")}
          style={styles.logo}
        />
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>
            If you have any questions or queries, feel free to contact us.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, styles.commentInput]}
            placeholder="Write a comment here"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.SubmitButton}
            onPress={() => navigation.navigate("Account")}
            disabled={loading}
          >
            <Icon name="arrow-back-outline" size={24} color="#fff" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.SubmitButton, styles.submitButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Icon name="reload-circle-outline" size={24} color="#fff" />
            ) : (
              <Text style={styles.SubmitText}>
                {loading ? "Submitting..." : "Submit"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(50),
  },
  backButtonContainer: {
    padding: moderateScale(10),
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(30),
  },
  logo: {
    width: moderateScale(150),
    height: moderateScale(40),
    marginLeft: moderateScale(70),
  },
  titleContainer: {
    alignItems: "flex-start",
    marginLeft: moderateScale(20),
    marginTop: verticalScale(50),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: "bold",
  },
  subtitle: {
    marginTop: verticalScale(5),
    fontSize: moderateScale(16),
    marginRight: moderateScale(5),
    color: "gray",
  },
  inputContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: moderateScale(15),
  },
  input: {
    height: moderateScale(45),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: scale(10),
    paddingHorizontal: moderateScale(10),
    marginBottom: verticalScale(15),
    backgroundColor: "#fff",
    fontWeight: "bold",
  },
  commentInput: {
    height: verticalScale(100),
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(40),
  },
  SubmitButton: {
    flexDirection: "row",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(25),
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(25),
    alignItems: "center",
    justifyContent: "center",
  },
  SubmitText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
  },
  backButtonText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
    marginLeft: moderateScale(5),
  },
  submitButton: {
    marginLeft: moderateScale(20),
  },
});

export default ContactUs;
