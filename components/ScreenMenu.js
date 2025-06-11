import React, { useContext, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/authContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

// Screens
import Register from "../screens/Register";
import Home from "../screens/Home";
import Login from "../screens/Login";
import About from "../screens/About";
import Account from "../screens/Account";
import History from "../screens/History";
import UpdateProfile from "../screens/UpdateProfile";
import UserInfo from "../screens/UserInfo";
import ForgetPassword from "../screens/ForgetPassword";
import Welcome from "../screens/Welcome";
import TermOfUse from "../screens/TermOfUse";
import ResetPasswordConfirm from "../screens/ResetPasswordConfirm";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import PR from "../screens/PR";
import Recording from "../screens/Recording";
import SplashScreens from "../screens/SplashScreens";
import ContactUs from "../screens/ContactUs";
import Search from "../screens/Search";
import HealthAndWellness from "../screens/BabyCareGuide/HealthAndWellness";
import FeedingAndNutrition from "../screens/BabyCareGuide/FeedingAndNutrition";
import SleepAndComfort from "../screens/BabyCareGuide/SleepAndComfort";
import ParentingTips from "../screens/BabyCareGuide/ParentingTips";
import Pain from "../screens/Remedies/Pain";
import Burping from "../screens/Remedies/Burping";
import Sleep from "../screens/Remedies/Sleep";
import Hungry from "../screens/Remedies/Hungry";
import HistoryDetail from "../screens/HistoryDetail";

const Stack = createNativeStackNavigator();

const ScreenMenu = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state] = useContext(AuthContext); // Destructure state from AuthContext

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Check for authentication token in AsyncStorage
        const token = await AsyncStorage.getItem("@auth");

        // If a token exists or user is authenticated from context, set isAuthenticated to true
        if (token || (state?.authenticateUser && state?.token)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Ensure the state is defined before checking
    if (state) {
      checkAuthentication();
    }
  }, [state]); // Add state as a dependency to recheck when it changes

  // Show a loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={SplashScreens}>
      {/* Splash Screen for initial loading */}
      <Stack.Screen
        name="SplashScreens"
        component={SplashScreens}
        options={{ headerShown: false }}
      />

      {/* Login screen for unauthenticated users */}
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      {/* Register and Forget Password screens */}
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        options={{ headerShown: false }}
      />

      {/* Home and other screens for authenticated users */}
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpdateProfile"
        component={UpdateProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordConfirm"
        component={ResetPasswordConfirm}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermOfUse"
        component={TermOfUse}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PR" component={PR} options={{ headerShown: false }} />
      <Stack.Screen
        name="Recording"
        component={Recording}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HealthAndWellness"
        component={HealthAndWellness}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedingAndNutrition"
        component={FeedingAndNutrition}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SleepAndComfort"
        component={SleepAndComfort}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ParentingTips"
        component={ParentingTips}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pain"
        component={Pain}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Burping"
        component={Burping}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Sleep"
        component={Sleep}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Hungry"
        component={Hungry}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ScreenMenu;
