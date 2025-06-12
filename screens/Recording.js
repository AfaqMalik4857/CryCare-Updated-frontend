import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { baseIP } from "../const";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const scale = width / 375; // base iPhone width

// --- Configuration ---
const API_URL = `http://${baseIP}:5000/predict`;
const HISTORY_KEY = "@CryCare_History";
// -------------------

// Recording states
const RECORDING_STATE = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  RECORDING: 'recording',
  STOPPING: 'stopping',
  PROCESSING: 'processing',
  ERROR: 'error'
};

const Recording = ({ navigation }) => {
  // UI States
  const [amplitude, setAmplitude] = useState(new Animated.Value(0.1));
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  
  // Core recording state - single source of truth
  const [recordingState, setRecordingState] = useState(RECORDING_STATE.IDLE);
  
  // Refs
  const recorderRef = useRef(null);
  const recordingUriRef = useRef(null);
  const timerRef = useRef(null);
  const amplitudeTimerRef = useRef(null);
  const recordingStartTimeRef = useRef(null);
  
  // Cleanup function for timers
  const cleanupTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (amplitudeTimerRef.current) {
      clearInterval(amplitudeTimerRef.current);
      amplitudeTimerRef.current = null;
    }
  };
  
  // Reset all states to initial values
  const resetStates = () => {
    setRecordingDuration(0);
    amplitude.setValue(0.1);
    recordingUriRef.current = null;
    recordingStartTimeRef.current = null;
  };
  
  // Initialize recording system
  const initializeRecording = async () => {
    try {
      console.log("Initializing recording system...");
      
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permissions to record audio."
        );
        setRecordingState(RECORDING_STATE.ERROR);
        return false;
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: false,
      });
      
      console.log("Recording system initialized successfully");
      return true;
    } catch (error) {
      console.error("Error initializing recording:", error);
      setRecordingState(RECORDING_STATE.ERROR);
      return false;
    }
  };
  
  // Start recording
  const startRecording = async () => {
    // Prevent action if not in IDLE state
    if (recordingState !== RECORDING_STATE.IDLE) {
      console.log("Cannot start recording - not in IDLE state");
      return;
    }
    
    setButtonDisabled(true);
    setRecordingState(RECORDING_STATE.INITIALIZING);
    
    try {
      // Reset states
      resetStates();
      
      // Initialize recording system
      const initialized = await initializeRecording();
      if (!initialized) {
        throw new Error("Failed to initialize recording system");
      }
      
      // Create recording options
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 64000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        isMeteringEnabled: true,
      };
      
      // Create a new recording
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recorderRef.current = recording;
      
      // Store start time
      recordingStartTimeRef.current = Date.now();
      
      // Start duration timer
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      // Start amplitude polling
      amplitudeTimerRef.current = setInterval(async () => {
        try {
          if (recorderRef.current) {
            const status = await recorderRef.current.getStatusAsync();
            if (status.isRecording && typeof status.metering === 'number') {
              const normalized = Math.max(0.1, Math.min(2, (status.metering / -20) + 1));
              amplitude.setValue(normalized);
            }
          }
        } catch (error) {
          // Ignore metering errors
        }
      }, 100);

      // Update state to recording
      setRecordingState(RECORDING_STATE.RECORDING);
      console.log("Recording started successfully");
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Error", `Failed to start recording: ${error.message}`);
      setRecordingState(RECORDING_STATE.ERROR);
      
      // Clean up any partial recording
      if (recorderRef.current) {
        try {
          await recorderRef.current.stopAndUnloadAsync();
        } catch (cleanupError) {
          console.log("Error cleaning up recording:", cleanupError);
        }
        recorderRef.current = null;
      }
      
      // Reset audio mode
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
        });
      } catch (audioError) {
        console.log("Error resetting audio mode:", audioError);
      }
    } finally {
      setButtonDisabled(false);
    }
  };
  
  // Stop recording
  const stopRecording = async () => {
    // Prevent action if not in RECORDING state
    if (recordingState !== RECORDING_STATE.RECORDING) {
      console.log("Cannot stop recording - not in RECORDING state");
      return;
    }
    
    setButtonDisabled(true);
    setRecordingState(RECORDING_STATE.STOPPING);
    
    try {
      // Clean up timers
      cleanupTimers();
      
      // Calculate final duration
      const finalDuration = recordingStartTimeRef.current 
        ? Math.round((Date.now() - recordingStartTimeRef.current) / 1000)
        : recordingDuration;
      
      // Update duration state with final value
      setRecordingDuration(finalDuration);
      
      console.log("Final recording duration:", finalDuration);
      
      // Check if recording is too short
      if (finalDuration < 1) {
        Alert.alert("Recording Too Short", "Please record for at least 1 second.");
        
        // Clean up recording
        if (recorderRef.current) {
          try {
            await recorderRef.current.stopAndUnloadAsync();
          } catch (error) {
            console.log("Error stopping short recording:", error);
          }
          recorderRef.current = null;
        }
        
        // Reset audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: false,
        });
        
        setRecordingState(RECORDING_STATE.IDLE);
        return;
      }
      
      // Get URI before stopping
      let uri = null;
      if (recorderRef.current) {
        try {
          uri = recorderRef.current.getURI();
          recordingUriRef.current = uri;
          
          console.log("Recording URI before stopping:", uri);
          
          // Stop recording
          await recorderRef.current.stopAndUnloadAsync();
          // Add a small delay to ensure durationMillis is set
          await new Promise(resolve => setTimeout(resolve, 300));
          const status = await recorderRef.current.getStatusAsync();
          const durationInSeconds = Math.floor((status.durationMillis || 0) / 1000);
          console.log("Recording status after stop:", status);
          console.log("Calculated durationInSeconds:", durationInSeconds);
          
          // Reset recorder ref
          recorderRef.current = null;
          
          // Reset audio mode
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
          });
          
          // Process the recording
          await processRecording(uri, durationInSeconds);
        } catch (error) {
          console.error("Error stopping recording:", error);
          Alert.alert("Error", `Failed to stop recording: ${error.message}`);
          setRecordingState(RECORDING_STATE.ERROR);
        }
      } else {
        console.error("No active recording to stop");
        setRecordingState(RECORDING_STATE.ERROR);
      }
    } finally {
      setButtonDisabled(false);
    }
  };
  
  // Process recording and send to API
  const processRecording = async (uri, durationInSeconds) => {
    if (!uri) {
      console.error("No URI provided for processing");
      setRecordingState(RECORDING_STATE.ERROR);
      return;
    }
    
    setRecordingState(RECORDING_STATE.PROCESSING);
    setLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');

      formData.append("file", {
        uri: fileUri,
        type: "audio/m4a",
        name: "recording.m4a",
      });
      
      console.log("Sending audio to API:", API_URL);
      console.log("Audio URI:", fileUri);
      console.log("Audio duration:", durationInSeconds);

      // Send to API
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
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
        throw new Error("Invalid API response format");
      }
      if (!predictions || typeof predictions !== 'object') {
        throw new Error("Invalid predictions format");
      }
      // Get the XGBoost prediction
      const xgboostPrediction = predictions.XGBoost;
      console.log("XGBoost prediction:", xgboostPrediction);
      let prediction;
      if (Array.isArray(xgboostPrediction) && xgboostPrediction.length > 0) {
        prediction = xgboostPrediction[0];
      } else if (typeof xgboostPrediction === 'string') {
        prediction = xgboostPrediction;
      } else {
        prediction = "Unknown";
      }
      console.log("Final prediction value:", prediction);

      // Get full prediction name
      const fullPredictionName = getFullPredictionName(prediction);
      console.log("Full prediction name:", fullPredictionName);

      // Format duration for display
      const formattedDuration = formatDuration(durationInSeconds);
      console.log("Formatted duration:", formattedDuration);
      
      // Create history item
      const timestamp = new Date().toISOString();
      const historyItem = {
        id: `history-${Date.now()}`,
        recordingUri: uri,
        duration: formattedDuration,
        recordingDuration: durationInSeconds,
        predictions: predictions,
        prediction: fullPredictionName,
        timestamp: timestamp,
      };
      
      // Save to history
      await saveToHistory(historyItem);
      
      // Navigate to results screen
      navigation.navigate("HistoryDetail", historyItem);
      
      // Reset state to idle
      setRecordingState(RECORDING_STATE.IDLE);
    } catch (error) {
      console.error("Error processing recording:", error);
      Alert.alert("Error", `Failed to process recording: ${error.message}`);
      setRecordingState(RECORDING_STATE.ERROR);
    } finally {
      setLoading(false);
    }
  };
  
  // Save history item to AsyncStorage
  const saveToHistory = async (historyItem) => {
    try {
      // Get existing history
      const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
      let history = historyJson ? JSON.parse(historyJson) : [];
      
      // Add new item
      history.unshift(historyItem);
      
      // Limit history size
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      console.log("History saved successfully");
    } catch (error) {
      console.error("Error saving history:", error);
    }
  };
  
  // Reset recording system on error
  useEffect(() => {
    if (recordingState === RECORDING_STATE.ERROR) {
      const resetSystem = async () => {
        // Clean up timers
        cleanupTimers();
        
        // Clean up recording
        if (recorderRef.current) {
          try {
            const status = await recorderRef.current.getStatusAsync().catch(() => null);
            if (status && status.isLoaded) {
              if (status.isRecording) {
                await recorderRef.current.stopAndUnloadAsync();
              } else {
                await recorderRef.current.unloadAsync();
              }
            }
          } catch (error) {
            console.log("Error cleaning up recording:", error);
          }
          recorderRef.current = null;
        }
        
        // Reset audio mode
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
          });
        } catch (error) {
          console.log("Error resetting audio mode:", error);
        }
        
        // Reset states
        resetStates();
        
        // Return to idle state after a delay
        setTimeout(() => {
          setRecordingState(RECORDING_STATE.IDLE);
        }, 1000);
      };
      
      resetSystem();
    }
  }, [recordingState]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      const cleanup = async () => {
        // Clean up timers
        cleanupTimers();
        
        // Clean up recording
        if (recorderRef.current) {
          try {
            const status = await recorderRef.current.getStatusAsync().catch(() => null);
            if (status && status.isLoaded) {
              if (status.isRecording) {
                await recorderRef.current.stopAndUnloadAsync();
              } else {
                await recorderRef.current.unloadAsync();
              }
            }
          } catch (error) {
            console.log("Error cleaning up recording:", error);
          }
        }
        
        // Reset audio mode
        try {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
          });
        } catch (error) {
          console.log("Error resetting audio mode:", error);
        }
      };
      
      cleanup();
    };
  }, []);

  // Helper function to get the full name of the prediction
  const getFullPredictionName = (prediction) => {
    if (!prediction || typeof prediction !== 'string') {
      return "Unknown";
    }

    const lowerCasePrediction = prediction.toLowerCase().trim();
    
    // Map of prediction values to their full names
    const predictionMap = {
      'h': 'Hungry',
      'hungry': 'Hungry',
      'p': 'Pain',
      'pain': 'Pain',
      'belly_pain': 'Pain',
      'd': 'Discomfort',
      'discomfort': 'Discomfort',
      'b': 'Burping',
      'burping': 'Burping',
      't': 'Tired',
      'tired': 'Tired'
    };

    return predictionMap[lowerCasePrediction] || prediction.charAt(0).toUpperCase() + prediction.slice(1);
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // Handle button press
  const handleButtonPress = () => {
    if (recordingState === RECORDING_STATE.RECORDING) {
      stopRecording();
    } else if (recordingState === RECORDING_STATE.IDLE) {
      startRecording();
    }
  };
  
  // Determine if button should be disabled
  const isButtonDisabled = buttonDisabled || 
    recordingState === RECORDING_STATE.INITIALIZING || 
    recordingState === RECORDING_STATE.STOPPING || 
    recordingState === RECORDING_STATE.PROCESSING;
  
  // Determine if recording is active
  const isRecordingActive = recordingState === RECORDING_STATE.RECORDING;
  
  // Determine if loading overlay should be shown
  const showLoading = recordingState === RECORDING_STATE.PROCESSING || loading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#4c669f", "#3b5999", "#192f6a"]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Record Baby's Cry</Text>
            <View style={styles.recordingContainer}>
              <TouchableOpacity
                style={[
                  styles.recordingButton,
                  isButtonDisabled && styles.disabledButton
                ]}
                onPress={handleButtonPress}
                disabled={isButtonDisabled}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: amplitude.interpolate({
                          inputRange: [0.1, 2],
                          outputRange: [1, 1.2],
                        }),
                      },
                    ],
                  }}
                >
                  <Icon
                    name={isRecordingActive ? "stop" : "mic"}
                    size={scale * 40}
                    color="#fff"
                  />
                </Animated.View>
              </TouchableOpacity>
              
              <Text style={styles.recordingText}>
                {isRecordingActive
                  ? `Recording... ${formatDuration(recordingDuration)}`
                  : "Tap to Record"}
              </Text>
              
              <Text style={styles.instructionText}>
                {isRecordingActive
                  ? "Tap again to stop recording"
                  : "Hold your phone close to the baby"}
              </Text>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>How to use:</Text>
              <View style={styles.infoItem}>
                <Icon name="mic-outline" size={scale * 20} color="#fff" />
                <Text style={styles.infoText}>
                  Tap the button to start recording
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="stop-outline" size={scale * 20} color="#fff" />
                <Text style={styles.infoText}>
                  Tap again to stop and analyze
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Icon name="analytics-outline" size={scale * 20} color="#fff" />
                <Text style={styles.infoText}>
                  View the analysis results
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        
        {/* State indicator for debugging */}
        {/* <View style={styles.stateIndicator}>
          <Text style={styles.stateText}>{recordingState}</Text>
        </View>
        */}

        {/* Loading overlay */}
        {showLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Analyzing cry...</Text>
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: scale * 20,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: scale * 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: scale * 40,
    textAlign: "center",
  },
  recordingContainer: {
    alignItems: "center",
    marginBottom: scale * 40,
  },
  recordingButton: {
    width: scale * 120,
    height: scale * 120,
    borderRadius: scale * 60,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: scale * 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  recordingText: {
    fontSize: scale * 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: scale * 10,
  },
  instructionText: {
    fontSize: scale * 14,
    color: "#ddd",
    textAlign: "center",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: scale * 10,
    padding: scale * 20,
  },
  infoTitle: {
    fontSize: scale * 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: scale * 15,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scale * 10,
  },
  infoText: {
    fontSize: scale * 14,
    color: "#fff",
    marginLeft: scale * 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: scale * 18,
    marginTop: scale * 10,
  },
  stateIndicator: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  stateText: {
    color: "#fff",
    fontSize: 10,
  },
});

export default Recording;
