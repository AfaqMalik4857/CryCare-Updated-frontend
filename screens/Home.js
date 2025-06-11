import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import { LinearGradient } from "expo-linear-gradient";
import { moderateScale, verticalScale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BabyCareGuide from "./BabyCareGuide/BabyCareGuide";
import Remedies from "./Remedies/Remedies";

const Home = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(true);

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleRecording = () => {
    navigation.navigate("Recording");
  };

  const handleSearch = () => {
    navigation.navigate("Search");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#d7e8f4",
          height: moderateScale(250),
          width: moderateScale("100%"),
          borderBottomRightRadius: moderateScale(70),
          borderBottomLeftRadius: moderateScale(70),
        }}
      >
        <LinearGradient
          colors={["transparent", "#d7e8f5", "transparent"]}
          style={styles.background}
        />

        <View style={styles.headerContainer}>
          <Image
            source={require("../assets/crycarelogo.png")}
            style={styles.logo}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.searchContainer}
            onPress={handleSearch}
          >
            <Icon name="search" size={20} color="#aaa" />
            <Text style={styles.searchBar}>Search...</Text>
          </TouchableOpacity>

          <Text style={styles.userName}>Hello, {state?.user.name}!</Text>
          <Text style={styles.userText}>We are here to help you!</Text>
        </View>
      </View>

      <ScrollView>
        <Text style={styles.featureText}>Features</Text>
        <View style={styles.tabs}>
          <View style={styles.InerTabsOptions}>
            {/* <TouchableOpacity style={styles.InerTabsoptionButton}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="cloud-upload-outline"
                  size={20}
                  color="#000"
                  style={styles.icon}
                />
                <Text style={styles.InerTabsNamesFile}>Upload File</Text>
              </View>
              <Text style={styles.donationText}>You Can Upload Your File</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={styles.InerTabsoptionButton}
              onPress={handleRecording}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                  name="mic-outline"
                  size={20}
                  color="#000"
                  style={styles.icon}
                />
                <Text style={styles.InerTabsNamesRecording}>Recording</Text>
              </View>
              <Text style={styles.donationText}>
                You Can Manage Your Recording
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <HomeSlider images={carousalImages} /> */}
        {/* <TouchableOpacity>
          <Image
            source={require("../assets/chat.png")}
            style={{
              marginLeft: moderateScale(300),
              marginBottom: verticalScale(8),
              width: moderateScale(60),
              height: moderateScale(60),
              borderRadius: moderateScale(80),
            }}
          />
        </TouchableOpacity> */}
        <BabyCareGuide />
        <Remedies />
      </ScrollView>

      <View style={styles.footerContainer}>
        <FooterMenu />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Welcome to CryCare! {state?.user.name}
          </Text>
          <Button title="Close" onPress={handleCloseModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#fff",
  },
  featureText: {
    color: "rgb(86, 85, 85)",
    marginLeft: moderateScale(20),
    marginTop: verticalScale(15),
    fontSize: moderateScale(22),
    fontWeight: "500",
  },
  InerTabsNamesFile: {
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    fontWeight: "900",
    justifyContent: "space-between",
    marginRight: 10,
  },
  InerTabsNamesRecording: {
    marginTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    fontWeight: "900",
    justifyContent: "space-between",
    marginRight: moderateScale(27),
  },
  InerTabsOptions: {
    flexDirection: "row",
  },
  InerTabsoptionButton: {
    width: "70%",
    height: moderateScale(100),
    padding: moderateScale(15),
    backgroundColor: "#d7e8f4",
    borderRadius: moderateScale(15),
    marginVertical: verticalScale(10),
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: verticalScale(20),
  },
  GuideTabsoptionButton: {
    width: "40%",
    height: moderateScale(90),
    padding: moderateScale(15),
    marginBottom: verticalScale(20),
    marginLeft: moderateScale(22),
    borderRadius: moderateScale(15),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d7e8f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  babyGuideLogo: {
    width: moderateScale(45),
    height: moderateScale(40),
    marginBottom: verticalScale(8),
  },
  submitButton: {
    height: moderateScale(40),
    backgroundColor: "#2c709e",
    borderRadius: moderateScale(10),
    marginTop: moderateScale(90),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: moderateScale(120),
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: moderateScale("100%"),
  },
  logo: {
    width: moderateScale(188),
    height: moderateScale(50),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: moderateScale(10),
    marginTop: verticalScale(50),
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: moderateScale(10),
    backgroundColor: "#fff",
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(12),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBar: {
    height: moderateScale(38),
    borderRadius: moderateScale(25),
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(8),
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  tabs: {
    height: moderateScale("20%"),
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: moderateScale(20),
    width: moderateScale("100%"),
    paddingTop: verticalScale(5),
    borderRadius: moderateScale(20),
    color: "#d7e8f4",
  },
  userName: {
    marginLeft: moderateScale(20),
    fontSize: moderateScale(25),
    flex: 1,
    color: "#032757",
    fontWeight: "bold",
  },
  userText: {
    marginLeft: moderateScale(20),
    fontSize: moderateScale(15),
    flex: 1,
    color: "#032757",
    fontWeight: "bold",
  },
  fileInfo: {
    marginTop: verticalScale(20),
    fontSize: moderateScale(16),
  },
  footerContainer: {
    marginTop: verticalScale(10),
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: "100%",
  },
  modalText: {
    textAlign: "center",
    fontSize: moderateScale(20),
    color: "#174684",
  },
  icon: {
    marginRight: moderateScale(8),
  },
});

export default Home;
