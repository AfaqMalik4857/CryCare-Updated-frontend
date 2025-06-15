import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import FooterMenu from "../components/FooterMenu";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { baseIP } from "../const";
import AsyncStorage from "@react-native-async-storage/async-storage";

// API URL - Must match the one in Recording.js
const API_HISTORY_URL = `http://${baseIP}:5000/history`;

// Helper function to get appropriate icon based on prediction
const getPredictionIcon = (prediction) => {
  const lowerCasePrediction = prediction ? prediction.toLowerCase() : "";
  switch (lowerCasePrediction) {
    case "hungry":
      return "fast-food-outline";
    case "pain":
    case "belly_pain":
      return "bandage-outline";
    case "discomfort":
      return "sad-outline";
    case "burping":
      return "cloud-outline";
    case "tired":
      return "moon-outline";
    default:
      return "help-circle-outline"; // Default icon
  }
};

// Helper function to format date
const formatDate = (isoString) => {
  if (!isoString) return { date: "Unknown", time: "" };

  const date = new Date(isoString);

  // Format date: "Oct 8, 2024"
  const options = { year: "numeric", month: "short", day: "numeric" };
  const dateStr = date.toLocaleDateString(undefined, options);

  // Format time: "4:47 PM"
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
  const timeStr = date.toLocaleTimeString(undefined, timeOptions);

  return { date: dateStr, time: timeStr };
};

// Helper function to get the full name of the prediction
const getFullPredictionName = (prediction) => {
  if (!prediction || typeof prediction !== "string") return "Unknown";
  const lower = prediction.toLowerCase().trim();
  const map = {
    h: "Hungry",
    hungry: "Hungry",
    p: "Pain",
    pain: "Pain",
    belly_pain: "Pain",
    d: "Discomfort",
    discomfort: "Discomfort",
    b: "Burping",
    burping: "Burping",
    t: "Tired",
    tired: "Tired",
  };
  return map[lower] || "Unknown";
};

// Helper function to get the correct image based on prediction
const getPredictionImage = (prediction) => {
  if (!prediction || typeof prediction !== "string")
    return require("../assets/icon.png");
  const lower = prediction.toLowerCase().trim();
  const map = {
    h: require("../assets/HungryBaby.png"),
    hungry: require("../assets/HungryBaby.png"),
    p: require("../assets/Pains.png"),
    pain: require("../assets/Pains.png"),
    belly_pain: require("../assets/Pains.png"),
    d: require("../assets/discomfort.jpg"),
    discomfort: require("../assets/discomfort.jpg"),
    b: require("../assets/burping.png"),
    burping: require("../assets/burping.png"),
    t: require("../assets/Sleep.png"),
    tired: require("../assets/Sleep.png"),
  };
  return map[lower] || require("../assets/icon.png");
};

// Format duration for display
const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

// Add this helper to delete a history item by id
const deleteHistoryItem = async (id) => {
  try {
    console.log(`Deleting history item with ID: ${id}`);

    // Make sure the URL matches the backend's delete endpoint
    const response = await fetch(
      `${API_HISTORY_URL}/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Delete response status: ${response.status}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Treat 404 as success (item already deleted on server)
        console.log(
          "Item not found on server, treating as successful deletion"
        );
        return true;
      }
      const errorText = await response.text();
      console.error(
        `Failed to delete history item. Status: ${response.status}, Error: ${errorText}`
      );
      throw new Error(
        `Failed to delete history item. Status: ${response.status}`
      );
    }

    const responseData = await response.json();
    console.log("Delete response:", responseData);
    console.log("History item deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting history item:", error);
    return false;
  }
};

const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem("@CryCare_History");
    Alert.alert("Success", "History cleared!");
    fetchHistory();
  } catch (error) {
    Alert.alert("Error", "Failed to clear history: " + error.message);
  }
};

const History = () => {
  const navigation = useNavigation();
  const [state] = useContext(AuthContext);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  // Function to fetch history from backend
  const fetchHistory = async () => {
    try {
      setLoading(true);
      console.log("Fetching history from:", API_HISTORY_URL);

      const response = await fetch(API_HISTORY_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched history:", data);

      // Transform the data for display
      const formattedData = data.map((item) => {
        // Extract XGBoost prediction if available
        let prediction = "Unknown";
        if (
          item.predictions &&
          item.predictions.XGBoost &&
          item.predictions.XGBoost.length > 0
        ) {
          prediction = item.predictions.XGBoost[0];
          // Ensure first letter is capitalized
          prediction = prediction.charAt(0).toUpperCase() + prediction.slice(1);
        }

        const { date, time } = formatDate(item.timestamp);

        // Format duration properly
        let formattedDuration = "0:00";
        if (item.duration && typeof item.duration === "number") {
          formattedDuration = formatDuration(item.duration);
        } else if (item.duration && typeof item.duration === "string") {
          formattedDuration = item.duration;
        } else if (typeof item.recordingDuration === "number") {
          formattedDuration = formatDuration(item.recordingDuration);
        }

        return {
          id: item.id || `history-${Math.random()}`,
          time: time,
          date: date,
          status: prediction,
          icon: getPredictionIcon(prediction),
          // Include any other data needed for HistoryDetail
          timestamp: item.timestamp,
          prediction: prediction,
          predictions: item.predictions,
          recordingUri: item.recordingUri,
          duration: formattedDuration,
          recordingDuration: item.duration || item.recordingDuration || 0,
        };
      });

      // Sort by timestamp (newest first)
      formattedData.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp);
      });

      setHistoryData(formattedData);
    } catch (error) {
      console.error("Error fetching history:", error);
      Alert.alert(
        "Error",
        "Failed to load history. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch history when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchHistory();
      return () => {}; // Cleanup function
    }, [])
  );

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  // Handle item deletion
  const handleDeleteItem = async (id) => {
    if (deleteInProgress) return;
    setDeleteInProgress(true);

    try {
      Alert.alert(
        "Delete History",
        "Are you sure you want to delete this history entry?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setDeleteInProgress(false),
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const success = await deleteHistoryItem(id);

                if (success) {
                  // Remove from AsyncStorage (if used)
                  try {
                    const historyJson = await AsyncStorage.getItem(
                      "@CryCare_History"
                    );
                    let history = historyJson ? JSON.parse(historyJson) : [];
                    history = history.filter((item) => item.id !== id);
                    await AsyncStorage.setItem(
                      "@CryCare_History",
                      JSON.stringify(history)
                    );
                  } catch (e) {
                    // Ignore local storage errors
                  }

                  // Always refresh the list from backend to ensure sync
                  await fetchHistory();
                } else {
                  Alert.alert("Error", "Failed to delete the history item.");
                }
              } catch (error) {
                Alert.alert("Error", "An error occurred while deleting.");
              } finally {
                setDeleteInProgress(false);
              }
            },
          },
        ],
        { cancelable: true, onDismiss: () => setDeleteInProgress(false) }
      );
    } catch (error) {
      setDeleteInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <Image
        source={require("../assets/crycarelogo.png")}
        style={styles.logo}
      />

      <ScrollView
        style={styles.historyContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4c8bf5"]}
          />
        }
      >
        <Text style={styles.title}>History</Text>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4c8bf5" />
            <Text style={styles.loadingText}>Loading history...</Text>
          </View>
        ) : historyData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="document-text-outline" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No history found</Text>
            <Text style={styles.emptySubText}>
              Record a cry to see predictions here
            </Text>
          </View>
        ) : (
          historyData.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate("HistoryDetail", item)}
              onLongPress={() => handleDeleteItem(item.id)}
              delayLongPress={500}
              style={styles.historyItem}
            >
              <View style={styles.iconContainer}>
                <Image
                  source={getPredictionImage(item.status)}
                  style={{ width: 36, height: 36, resizeMode: "contain" }}
                />
              </View>
              <View style={styles.detailsContainer}>
                <Text style={styles.dateText}>
                  {item.date} {item.time}
                </Text>
                <Text style={styles.statusText}>
                  {getFullPredictionName(item.status)}
                </Text>
                <Text style={styles.durationText}>
                  Duration: {item.duration}
                </Text>
              </View>
              <Icon name="chevron-forward-outline" size={24} color="#ccc" />
            </TouchableOpacity>
          ))
        )}

        {/* Add some bottom padding for better scrolling */}
        <View style={{ height: 20 }} />
      </ScrollView>

      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "#f9f9f9",
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
    alignSelf: "flex-start",
    marginTop: 50,
    marginLeft: 10,
  },
  historyContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#d7e8f5",
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
    color: "#888",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4c8bf5",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
  },
  emptySubText: {
    marginTop: 5,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  durationText: {
    fontSize: 14,
    color: "#888",
  },
});

export default History;
