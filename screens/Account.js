import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import Icon from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "react-native-size-matters";

const Account = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);
  const [profileImage, setProfileImage] = useState(null);

  // Load the profile image from AsyncStorage
  useEffect(() => {
    const loadProfileImage = async () => {
      const savedImage = await AsyncStorage.getItem("profileImage");
      if (savedImage) {
        setProfileImage(savedImage);
      } else {
        setProfileImage(require("../assets/profileimage.png"));
      }
    };

    loadProfileImage();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("Login");
        },
      },
    ]);
  };

  const handleImagePicker = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your media library to update your profile picture."
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      setProfileImage(newImageUri);

      // Save the profile image URI in AsyncStorage
      await AsyncStorage.setItem("profileImage", newImageUri);

      // Optionally update the user state
      const updatedUser = { ...state.user, profileImage: newImageUri };
      setState({ ...state, user: updatedUser });

      console.log("Profile image updated:", newImageUri);
    }
  };

  const navigateTo = (route) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePicker}>
          <Image
            source={
              typeof profileImage === "string"
                ? { uri: profileImage }
                : profileImage
            }
            style={styles.profileImage}
          />
          <View style={styles.cameraIconContainer}>
            <Icon name="camera-outline" size={moderateScale(20)} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{state?.user?.name || "User Name"}</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        {[
          {
            icon: "create-outline",
            label: "Update Profile",
            route: "UpdateProfile",
          },
          {
            icon: "information-circle-outline",
            label: "User Info",
            route: "UserInfo",
          },
          {
            icon: "clipboard-outline",
            label: "Terms of Use",
            route: "TermOfUse",
          },
          {
            icon: "lock-closed-outline",
            label: "Privacy Policy",
            route: "PrivacyPolicy",
          },
          {
            icon: "information-outline",
            label: "About",
            route: "About",
          },
          {
            icon: "person-circle-outline",
            label: "Contact Us",
            route: "ContactUs",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => navigateTo(item.route)}
          >
            <Icon name={item.icon} size={moderateScale(24)} color="#4c8bf5" />
            <Text style={styles.optionText}>{item.label}</Text>
            <Icon
              name="chevron-forward-outline"
              size={moderateScale(24)}
              color="#ccc"
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.2.1</Text>
      </View>
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    alignItems: "center",
    paddingVertical: verticalScale(35),
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImage: {
    width: moderateScale(90),
    height: moderateScale(90),
    borderRadius: moderateScale(45),
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(15),
    padding: 5,
  },
  userName: {
    fontSize: moderateScale(20),
    color: "#333",
    fontWeight: "bold",
    marginTop: verticalScale(10),
  },
  buttonsContainer: {
    marginTop: verticalScale(20),
    paddingHorizontal: moderateScale(20),
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(15),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    marginLeft: moderateScale(10),
    fontSize: moderateScale(16),
    color: "#333",
  },
  logoutButton: {
    marginTop: verticalScale(15),
    alignSelf: "center",
    backgroundColor: "#2c709e",
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(20),
    borderRadius: moderateScale(20),
  },
  logoutText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    alignItems: "center",
    paddingVertical: verticalScale(5),
  },
  footerText: {
    marginBottom: moderateScale(12),
    fontSize: moderateScale(14),
    color: "#888",
  },
});

export default Account;
