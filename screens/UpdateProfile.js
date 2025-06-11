import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const UpdateProfile = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const [name, setName] = useState(state?.user.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState(state?.user.email);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const payload = { name, email };
      if (oldPassword && newPassword) {
        payload.oldPassword = oldPassword;
        payload.newPassword = newPassword;
      }
      const { data } = await axios.put(`http://localhost:8080/update`, payload);
      if (data.success) {
        Alert.alert(
          "Profile Updated",
          oldPassword ? "Please log in again." : "Your profile was updated!"
        );
        if (oldPassword) navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "Something went wrong!");
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerIcon}
          >
            <Icon name="arrow-back" size={28} color="#ffffff" />
          </TouchableOpacity> */}
          <Image
            source={require("../assets/crycarelogo.png")}
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Update Profile</Text>
          <Text style={styles.subtitle}>
            Keep your profile up-to-date to ensure a personalized experience.
          </Text>
        </View>
        <View style={styles.separator} />

        {/* Input Section */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Enter New Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Old Password (optional)"
            secureTextEntry={true}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="New Password (optional)"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#888"
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={20} color="#fff" />
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Icon name="checkmark" size={20} color="#fff" />
                <Text style={styles.buttonText}>Update</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  background: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(60),
    paddingHorizontal: moderateScale(20),
  },
  headerIcon: {
    backgroundColor: "#2c709e",
    padding: 10,
    borderRadius: 30,
  },
  logo: {
    width: moderateScale(150),
    height: moderateScale(40),
    marginLeft: moderateScale(70),
  },
  titleContainer: {
    marginLeft: moderateScale(25),
    marginTop: verticalScale(30),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: verticalScale(5),
    lineHeight: moderateScale(20),
  },
  separator: {
    height: 2,
    backgroundColor: "#2c709e",
    width: "86%",
    marginTop: verticalScale(10),
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: moderateScale(20),
    padding: moderateScale(15),
    borderRadius: scale(15),
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    marginTop: verticalScale(20),
  },
  input: {
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: scale(10),
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(10),
    backgroundColor: "#f9f9f9",
    fontSize: moderateScale(14),
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: moderateScale(20),
    marginTop: verticalScale(30),
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(25),
    borderRadius: scale(25),
    elevation: 2,
  },
  backButton: {
    backgroundColor: "#999",
  },
  updateButton: {
    backgroundColor: "#2c709e",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: moderateScale(8),
  },
});

export default UpdateProfile;
