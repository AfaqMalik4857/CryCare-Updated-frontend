import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image, // Import Image for displaying prediction images
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Audio } from "expo-av";

// Format duration for display
const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

// Helper function to get the XGBoost prediction label safely
const getXGBoostPrediction = (predictions) => {
  console.log("Getting XGBoost prediction from:", predictions);

  if (
    !predictions ||
    !predictions.XGBoost ||
    !Array.isArray(predictions.XGBoost)
  ) {
    console.log("Invalid predictions format");
    return "Unknown";
  }

  const prediction = predictions.XGBoost[0];
  console.log("Raw prediction value:", prediction);

  if (!prediction || typeof prediction !== "string") {
    console.log("Invalid prediction value");
    return "Unknown";
  }

  return prediction.charAt(0).toUpperCase() + prediction.slice(1);
};

// Helper function to get the full name of the prediction
const getFullPredictionName = (prediction) => {
  if (!prediction || typeof prediction !== "string") {
    console.log("Invalid prediction for name:", prediction);
    return "Unknown";
  }

  const lowerCasePrediction = prediction.toLowerCase().trim();
  console.log("Getting full name for prediction:", lowerCasePrediction);

  const nameMap = {
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

  return nameMap[lowerCasePrediction] || "Unknown";
};

// Helper function to get an appropriate image source based on prediction
const getPredictionImage = (prediction) => {
  if (!prediction || typeof prediction !== "string") {
    console.log("Invalid prediction for image:", prediction);
    return require("../assets/icon.png");
  }

  const lowerCasePrediction = prediction.toLowerCase().trim();
  console.log("Getting image for prediction:", lowerCasePrediction);

  const imageMap = {
    h: require("../assets/HungryBaby.png"),
    hungry: require("../assets/HungryBaby.png"),
    p: require("../assets/Pains.png"),
    pain: require("../assets/Pains.png"),
    belly_pain: require("../assets/Pains.png"),
    d: require("../assets/discomfort.jpg"),
    discomfort: require("../assets/discomfort.jpg"),
    b: require("../assets/burping.png"),
    burping: require("../assets/burping.png"),
    t: require("../assets/tired.png"),
    tired: require("../assets/tired.png"),
  };

  return imageMap[lowerCasePrediction] || require("../assets/icon.png");
};

const HistoryDetail = ({ route, navigation }) => {
  // Extract parameters passed from Recording screen or History screen
  const {
    recordingUri,
    duration,
    predictions,
    timestamp,
    prediction,
    recordingDuration: initialRecordingDuration,
  } = route.params;

  console.log("HistoryDetail - Received params:", {
    prediction,
    predictions,
    timestamp,
  });

  // Determine the prediction to display
  let displayPrediction;
  if (prediction && prediction !== "Unknown") {
    displayPrediction = prediction;
  } else if (predictions?.XGBoost) {
    if (Array.isArray(predictions.XGBoost)) {
      displayPrediction = predictions.XGBoost[0];
    } else {
      displayPrediction = predictions.XGBoost;
    }
  } else {
    displayPrediction = "Unknown";
  }
  console.log("HistoryDetail - Display prediction:", displayPrediction);

  const fullPredictionName = getFullPredictionName(displayPrediction);
  console.log("HistoryDetail - Full prediction name:", fullPredictionName);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(
    initialRecordingDuration ||
      (typeof duration === "number" ? duration : 0) ||
      (typeof route.params.recordingDuration === "number"
        ? route.params.recordingDuration
        : 0)
  );
  const [amplitude, setAmplitude] = useState(0);
  const [durationTimer, setDurationTimer] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [newRecordingUri, setNewRecordingUri] = useState(null);
  const recordingRef = useRef(null);
  const timerRef = useRef(null);

  // Function to load the sound
  const loadSound = async () => {
    if (!recordingUri) {
      console.log("No recordingUri provided for playback");
      Alert.alert("Error", "No recording available for playback.");
      return;
    }
    setIsLoadingSound(true);
    console.log("Loading sound from:", recordingUri);
    try {
      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordingUri },
        { shouldPlay: false } // Don't play immediately
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      console.log("Sound loaded successfully");
    } catch (error) {
      console.error("Error loading sound:", error);
      Alert.alert("Error", "Could not load the recording for playback.");
    } finally {
      setIsLoadingSound(false);
    }
  };

  // Function to handle playback status updates
  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) {
      // Handle error or unload state
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
        Alert.alert("Playback Error", "An error occurred during playback.");
      }
      setIsPlaying(false); // Ensure playing state is false if unloaded or error
    } else {
      setIsPlaying(status.isPlaying);
      // Check if the sound just finished playing
      if (status.didJustFinish) {
        console.log("Playback finished");
        sound?.setPositionAsync(0); // Reset position to the beginning
      }
    }
  };

  // Load sound on component mount
  useEffect(() => {
    loadSound();
    // Unload sound on component unmount
    return () => {
      console.log("Unloading sound");
      sound?.unloadAsync();
    };
  }, [recordingUri]); // Re-load if URI changes

  // Function to play or pause the sound
  const togglePlayback = async () => {
    if (!sound) return;
    try {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (isPlaying) {
          await sound.pauseAsync();
          console.log("Playback paused");
        } else {
          // If finished, replay from start
          if (
            status.didJustFinish ||
            status.positionMillis === status.durationMillis
          ) {
            await sound.replayAsync();
            console.log("Playback replayed");
          } else {
            await sound.playAsync();
            console.log("Playback started/resumed");
          }
        }
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      Alert.alert("Playback Error", "Could not play/pause the recording.");
    }
  };

  // Format the timestamp
  const formattedTimestamp = timestamp
    ? new Date(timestamp).toLocaleString()
    : "Unknown Time";

  // Get the image source based on the prediction
  const predictionImageSource = getPredictionImage(displayPrediction);
  console.log(
    "HistoryDetail - Image source:",
    predictionImageSource ? "Found" : "Not found"
  );

  // const startRecording = async () => {
  //   try {
  //     // Clean up any existing recording
  //     if (recordingRef.current) {
  //       try {
  //         const status = await recordingRef.current.getStatusAsync();
  //         if (status.isLoaded) {
  //           if (status.isRecording) {
  //             await recordingRef.current.stopAndUnloadAsync();
  //           } else {
  //             await recordingRef.current.unloadAsync();
  //           }
  //         }
  //       } catch (cleanupError) {
  //         // Ignore cleanup errors
  //       }
  //       recordingRef.current = null;
  //       setRecording(null);
  //     }

  //     const permission = await Audio.requestPermissionsAsync();
  //     if (permission.status !== "granted") {
  //       Alert.alert("Permission Required", "Please grant microphone permissions to record audio.");
  //       return;
  //     }
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });
  //     const { recording } = await Audio.Recording.createAsync({
  //       android: {
  //         extension: '.m4a',
  //         outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
  //         audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
  //         sampleRate: 16000,
  //         numberOfChannels: 1,
  //         bitRate: 64000,
  //       },
  //       ios: {
  //         extension: '.m4a',
  //         outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
  //         audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
  //         sampleRate: 16000,
  //         numberOfChannels: 1,
  //         bitRate: 64000,
  //         linearPCMBitDepth: 16,
  //         linearPCMIsBigEndian: false,
  //         linearPCMIsFloat: false,
  //       },
  //       isMeteringEnabled: true,
  //     });
  //     recordingRef.current = recording;
  //     setRecording(recording);
  //     setIsRecording(true);
  //     setRecordingDuration(0);
  //     timerRef.current = setInterval(async () => {
  //       if (recordingRef.current) {
  //         const status = await recordingRef.current.getStatusAsync();
  //         setRecordingDuration(Math.floor((status.durationMillis || 0) / 1000));
  //       }
  //     }, 1000);
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to start recording.");
  //   }
  // };

  // const stopRecording = async () => {
  //   if (!isRecording || !recordingRef.current) return;
  //   try {
  //     clearInterval(timerRef.current);
  //     timerRef.current = null;
  //     await recordingRef.current.stopAndUnloadAsync();
  //     const uri = recordingRef.current.getURI();
  //     setNewRecordingUri(uri);
  //     setIsRecording(false);
  //     setRecording(null);
  //     Alert.alert("Recording Saved", `Recording saved at: ${uri}`);
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to stop recording.");
  //   }
  //  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />

      {/* Header with Back Button and Title */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIconContainer}
        >
          <Icon name="arrow-back-outline" size={30} color="#032757" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prediction Result</Text>
        {/* Placeholder for balance */}
        <View style={styles.backIconContainer} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.timestampText}>{formattedTimestamp}</Text>
        <Text style={styles.durationText}>
          Duration: {duration || formatDuration(recordingDuration)}
        </Text>

        <View style={styles.predictionSection}>
          <View style={styles.imageWrapper}>
            {predictionImageSource ? (
              <Image
                source={predictionImageSource}
                style={styles.predictionImage}
                resizeMode="contain"
              />
            ) : (
              <Icon name="help-circle-outline" size={50} color="#2c709e" />
            )}
          </View>
          <Text style={styles.statusText}>{fullPredictionName}</Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.playbackContainer}>
          {isLoadingSound ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2c709e" />
              <Text style={styles.loadingText}>Loading audio...</Text>
            </View>
          ) : !recordingUri ? (
            <View style={styles.noAudioContainer}>
              <Icon name="volume-mute-outline" size={60} color="#cccccc" />
              <Text style={styles.noAudioText}>No recording available</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={togglePlayback}
              disabled={!sound}
              style={styles.playButton}
            >
              <Icon
                name={
                  isPlaying ? "pause-circle-outline" : "play-circle-outline"
                }
                size={60}
                color={sound ? "#2c709e" : "#cccccc"} // Grey out if sound not loaded
              />
              <Text style={styles.playButtonText}>
                {isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Display only XGBoost result */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Result</Text>
          <Text style={styles.detailsText}>{fullPredictionName}</Text>
        </View>

        <View
          style={{ height: 10, width: amplitude * 2, backgroundColor: "red" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50, // Adjust as needed for status bar height
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backIconContainer: {
    width: 40, // Ensure consistent spacing
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#032757",
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20, // Add padding from header
    paddingHorizontal: 20,
  },
  timestampText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  durationText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 30,
  },
  predictionSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  // Updated wrapper for Image
  imageWrapper: {
    width: 120, // Larger size for image
    height: 120,
    borderRadius: 60, // Make it circular
    backgroundColor: "#e0eaf3", // Lighter blue background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#c0d4e4",
    overflow: "hidden", // Ensure image stays within bounds
  },
  predictionImage: {
    width: "80%", // Adjust image size within wrapper
    height: "80%",
  },
  statusText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#032757", // Main prediction text color
    textTransform: "capitalize", // Ensure proper capitalization
  },
  playbackContainer: {
    marginVertical: 30,
    height: 70, // Fixed height for the container
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    alignItems: "center",
  },
  playButtonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#2c709e",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  noAudioContainer: {
    alignItems: "center",
  },
  noAudioText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  detailsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailsTitle: {
    fontSize: 18, // Slightly larger
    fontWeight: "bold", // Bold title
    color: "#333",
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 16, // Slightly larger text
    color: "#032757", // Match status text color
    textTransform: "capitalize", // Ensure proper capitalization
  },
});

export default HistoryDetail;
