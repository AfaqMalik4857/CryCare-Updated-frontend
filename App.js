import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ScreenMenu from "./components/ScreenMenu";
import { AuthProvider } from "./context/authContext";
import Welcome from "./screens/Welcome";
import Home from "./screens/Home";
import History from "./screens/History";
import Login from "./screens/Login";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <ScreenMenu />
      </NavigationContainer>
    </AuthProvider>
  );
}
