import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseIP } from "../const";

const AuthContext = createContext();

//provider
const AuthProvider = ({ children }) => {
  const [state, setState] = useState({
    isAuthenticated: false,
  });

  const [user, setUser] = useState({ email: "user@example.com", name: "User" });

  //default axios setting
  axios.defaults.baseURL = `http://${baseIP}:8080`;

  //initial local storage data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      let data = await AsyncStorage.getItem("@auth");
      if (data) {
        console.log("Local Storage", data);
        let loginData = JSON.parse(data);
        setState({ user: loginData?.user, token: loginData?.token });
      }
    };
    loadLocalStorageData();
  }, []);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
