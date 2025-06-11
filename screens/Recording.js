import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { baseIP } from "../const";

// --- Configuration ---
// Replace with your actual API server IP address and port
// For Android emulator, use 10.0.2.2
// For physical device, use your computer's local network IP
const API_URL = `http://${baseIP}:5000/predict`;
// -------------------

const Recording = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [amplitude, setAmplitude] = useState(new Animated.Value(0.1));
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [durationTimer, setDurationTimer] = useState(null);
  const [loading, setLoading] = useState(false);

  // Use refs to track recording state
  const recordingRef = useRef(null);
  const amplitudeIntervalRef = useRef(null);

  // Cleanup function
  const cleanupRecording = async () => {
    try {
      console.log("Starting cleanup...");

      // Clear any existing timers
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }

      // Clear amplitude interval
      if (amplitudeIntervalRef.current) {
        clearInterval(amplitudeIntervalRef.current);
        amplitudeIntervalRef.current = null;
      }

      // Reset states
      setIsRecordingActive(false);
      setRecordingDuration(0);
      amplitude.setValue(0.1);

      // Handle recording cleanup
      if (recordingRef.current) {
        try {
          const status = await recordingRef.current.getStatusAsync();
          if (status.isLoaded) {
            if (status.isRecording) {
              await recordingRef.current.stopAndUnloadAsync();
            } else {
              await recordingRef.current.unloadAsync();
            }
          }
        } catch (error) {
          console.log("Error during recording cleanup:", error);
        } finally {
          recordingRef.current = null;
          setRecording(null);
        }
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      // Force cleanup of any existing recording
      try {
        const { Recording } = Audio;
        const existingRecording = new Recording();
        const status = await existingRecording.getStatusAsync();
        if (status.isLoaded) {
          if (status.isRecording) {
            await existingRecording.stopAndUnloadAsync();
          } else {
            await existingRecording.unloadAsync();
          }
        }
      } catch (error) {
        console.log("Error force unloading recording:", error);
      }

      // Wait a moment to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Cleanup completed");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupRecording();
    };
  }, []);

  // Reset Audio system
  const resetAudioSystem = async () => {
    try {
      console.log("Resetting Audio system...");
      
      // First cleanup any existing recording
      if (recordingRef.current) {
        try {
          const status = await recordingRef.current.getStatusAsync();
          if (status.isLoaded) {
            if (status.isRecording) {
              await recordingRef.current.stopAndUnloadAsync();
            } else {
              await recordingRef.current.unloadAsync();
            }
          }
        } catch (error) {
          console.log("Error during recording cleanup:", error);
        } finally {
          recordingRef.current = null;
          setRecording(null);
        }
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      // Wait for system to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log("Audio system reset completed");
    } catch (error) {
      console.error("Error resetting Audio system:", error);
    }
  };

  // Check for any active recording
  const checkForActiveRecording = async () => {
    try {
      const { Recording } = Audio;
      const recording = new Recording();
      const status = await recording.getStatusAsync();
      if (status.isLoaded) {
        if (status.isRecording) {
          await recording.stopAndUnloadAsync();
        } else {
          await recording.unloadAsync();
        }
      }
      return true;
    } catch (error) {
      console.log("No active recording found:", error);
      return false;
    }
  };

  // Start recording
  const startRecording = async () => {
    let newRecording = null;
    try {
      console.log("Starting new recording process...");
      
      // Check for any active recording
      await checkForActiveRecording();

      // Request permissions
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permissions to record audio."
        );
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });

      // Wait for audio mode to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create and start recording
      console.log("Creating new recording...");
      
      // Create recording with basic options
      const newRecording = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        isMeteringEnabled: true,
      }, (status) => {
        if (status.isLoaded && status.isRecording && status.metering) {
          const normalized = Math.max(0.1, Math.min(2, (status.metering / -20) + 1));
          amplitude.setValue(normalized);
        }
      }, true);

      console.log("Recording started successfully");

      // Update state
      setRecording(newRecording);
      recordingRef.current = newRecording;
      setIsRecordingActive(true);
      setRecordingDuration(0);
      amplitude.setValue(0.1);

      // Start duration timer
      const timer = setInterval(() => {
        setRecordingDuration(prevDuration => prevDuration + 1);
      }, 1000);
      setDurationTimer(timer);

      // Start amplitude polling
      amplitudeIntervalRef.current = setInterval(async () => {
        if (recordingRef.current) {
          try {
            const status = await recordingRef.current.getStatusAsync();
            if (status.isLoaded && status.isRecording && status.metering) {
              const normalized = Math.max(0.1, Math.min(2, (status.metering / -20) + 1));
              amplitude.setValue(normalized);
            }
          } catch (error) {
            console.log("Error getting recording status:", error);
          }
        }
      }, 100);

    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert(
        "Error",
        "Failed to start recording. Please try again."
      );
      // Reset states
      setRecording(null);
      recordingRef.current = null;
      setIsRecordingActive(false);
      setRecordingDuration(0);
      amplitude.setValue(0.1);
    }
  };

  // Stop recording and process
  const stopRecording = async () => {
    try {
      if (!recordingRef.current) {
        console.log("No recording to stop");
        return;
      }

      console.log("Stopping recording...");
      
      // Clear the duration timer first
      if (durationTimer) {
        clearInterval(durationTimer);
        setDurationTimer(null);
      }

      // Clear amplitude interval
      if (amplitudeIntervalRef.current) {
        clearInterval(amplitudeIntervalRef.current);
        amplitudeIntervalRef.current = null;
      }

      try {
        const status = await recordingRef.current.getStatusAsync();
        if (status.isLoaded && status.isRecording) {
          await recordingRef.current.stopAndUnloadAsync();
          const uri = recordingRef.current.getURI();
          console.log("Recording stopped and saved at:", uri);
          console.log("Final recording duration:", recordingDuration);

          // Reset recording state
          setRecording(null);
          setIsRecordingActive(false);

          // Show loading state
          setLoading(true);

          try {
            // Create form data
            const formData = new FormData();
            const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');
            console.log("File URI for upload:", fileUri);

            formData.append("file", {
              uri: fileUri,
              type: "audio/m4a",
              name: "recording.m4a",
            });

            console.log("Sending audio to API...");
            console.log("API URL:", API_URL);

            // Send to API
            const response = await fetch(API_URL, {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            console.log("API Response status:", response.status);
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error("API Error Response:", errorText);
              throw new Error(`API request failed with status ${response.status}: ${errorText}`);
            }

            const responseText = await response.text();
            console.log("Raw API response:", responseText);

            if (!responseText) {
              throw new Error("Empty response from API");
            }

            let predictions;
            try {
              predictions = JSON.parse(responseText);
              console.log("Parsed predictions:", predictions);
            } catch (e) {
              console.error("Error parsing API response:", e);
              throw new Error("Invalid API response format");
            }

            if (!predictions || typeof predictions !== 'object') {
              console.error("Invalid predictions format:", predictions);
              throw new Error("Invalid predictions format");
            }

            // Get the XGBoost prediction
            const xgboostPrediction = predictions.XGBoost;
            console.log("XGBoost prediction:", xgboostPrediction);

            let prediction;
            if (Array.isArray(xgboostPrediction)) {
              if (xgboostPrediction.length === 0) {
                console.error("Empty XGBoost prediction array");
                throw new Error("Empty XGBoost prediction");
              }
              prediction = xgboostPrediction[0];
            } else if (typeof xgboostPrediction === 'string') {
              prediction = xgboostPrediction;
            } else {
              console.error("Invalid XGBoost prediction format:", xgboostPrediction);
              throw new Error("Invalid XGBoost prediction format");
            }

            console.log("Final prediction value:", prediction);

            // Get the full prediction name
            const fullPredictionName = getFullPredictionName(prediction);
            console.log("Full prediction name:", fullPredictionName);

            // Navigate to HistoryDetail with the recording data
            navigation.navigate("HistoryDetail", {
              recordingUri: uri,
              duration: formatDuration(recordingDuration),
              predictions: predictions,
              timestamp: new Date().toISOString(),
              prediction: fullPredictionName,
            });
          } catch (error) {
            console.error("Error processing recording:", error);
            Alert.alert(
              "Error",
              `Failed to process recording: ${error.message}. Please try again.`
            );
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error stopping recording:", error);
        Alert.alert(
          "Error",
          "Failed to stop recording. Please try again."
        );
      } finally {
        recordingRef.current = null;
        setRecording(null);
        setIsRecordingActive(false);
      }
    } catch (error) {
      console.error("Error in stopRecording:", error);
      Alert.alert(
        "Error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  // Helper function to get the full name of the prediction
  const getFullPredictionName = (prediction) => {
    if (!prediction || typeof prediction !== 'string') {
      console.log("Invalid prediction value:", prediction);
      return "Unknown";
    }

    const lowerCasePrediction = prediction.toLowerCase().trim();
    console.log("Processing prediction:", lowerCasePrediction);
    
    // Map of prediction values to their full names
    const predictionMap = {
      'hungry': 'Hungry',
      'pain': 'Pain',
      'belly_pain': 'Pain',
      'discomfort': 'Discomfort',
      'burping': 'Burping',
      'tired': 'Tired'
    };

    const fullName = predictionMap[lowerCasePrediction];
    if (!fullName) {
      console.log("Unknown prediction type:", lowerCasePrediction);
      return "Unknown";
    }
    
    return fullName;
  };

  // Format duration
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0:00";
    const minutes = Math.floor(milliseconds / 1000 / 60);
    const seconds = Math.round((milliseconds / 1000) % 60);
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  // PanResponder for press-and-hold recording
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isPredicting,
    onPanResponderGrant: startRecording,
    onPanResponderRelease: stopRecording,
    onPanResponderTerminate: stopRecording,
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#d7e8f5", "#d7e8f5", "transparent"]}
        style={styles.background}
      />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isPredicting}
        >
          <Icon name="arrow-back-outline" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.recordingText}>Record Cry</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          Press and hold the microphone button to record.
        </Text>
        <Text style={styles.instructionText}>
          Release to stop and analyze the cry.
        </Text>
        {isRecordingActive && (
          <Text style={styles.durationText}>
            Recording: {formatDuration(recordingDuration)}
          </Text>
        )}
      </View>

      <View style={styles.amplitudeContainer}>
        {isRecordingActive && (
          <Animated.View
            style={[
              styles.amplitudeBar,
              { transform: [{ scaleY: amplitude }] },
            ]}
          />
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#032757" />
          <Text style={styles.loadingText}>Analyzing cry...</Text>
        </View>
      )}

      <View style={styles.recordButtonContainer} {...panResponder.panHandlers}>
        <View
          style={[
            styles.recordButton,
            isRecordingActive && styles.recordingActive,
            isPredicting && styles.predicting,
          ]}
        >
          <Icon
            name={isRecordingActive ? "stop-circle" : "mic-circle"}
            style={styles.recordIcon}
          />
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  recordingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#032757",
    textAlign: "center",
  },
  instructionContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  durationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff3b30",
    marginTop: 10,
  },
  amplitudeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    minHeight: 150,
  },
  amplitudeBar: {
    width: "100%",
    height: 100,
    backgroundColor: "#2c709e",
    borderRadius: 5,
    transformOrigin: "bottom",
  },
  recordButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  recordButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#2c709e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recordingActive: {
    backgroundColor: "#ff3b30",
  },
  predicting: {
    backgroundColor: "#cccccc",
  },
  backIcon: {
    color: "#032757",
    fontSize: 30,
  },
  recordIcon: {
    color: "#ffffff",
    fontSize: 45,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#032757",
  },
});

export default Recording;
