#!/usr/bin/env python
# coding: utf-8

import os
import librosa
import numpy as np
import pandas as pd
from joblib import load
from collections import Counter

# --- Configuration ---
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
EXPECTED_SR = 16000
SEGMENT_DURATION = 7.0 # Process audio in 7-second segments as per notebook
# -------------------

# --- Load Models and Preprocessing Tools ---
try:
    rf_model = load(os.path.join(MODEL_DIR, 'random_forest_model.pkl'))
    knn_model = load(os.path.join(MODEL_DIR, 'knn_model.pkl'))
    xgb_model = load(os.path.join(MODEL_DIR, 'xgb_model.pkl'))
    scaler = load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    pca_model = load(os.path.join(MODEL_DIR, 'pca_model.pkl'))
    label_encoder = load(os.path.join(MODEL_DIR, 'label_encoder.pkl'))
    print("Models and preprocessing tools loaded successfully.")
except FileNotFoundError as e:
    print(f"Error loading model or tool: {e}. Ensure all .pkl files are in the ", MODEL_DIR)
    # Depending on deployment strategy, might want to exit or handle differently
    raise e
except Exception as e:
    print(f"An unexpected error occurred loading models: {e}")
    raise e
# -----------------------------------------

# Function to extract features for a segment (from notebook)
def extract_features_segment(y, sr=EXPECTED_SR):
    """Extracts various audio features from a single audio segment."""
    try:
        print(f"Extracting features from segment of length {len(y)} samples")
        
        # Extract features
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=31)
        print(f"MFCCs shape: {mfccs.shape}")
        
        zcr = librosa.feature.zero_crossing_rate(y)
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        rms = librosa.feature.rms(y=y)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(y), sr=sr)

        # Average the features across time
        features = {
            'mfcc_1': np.mean(mfccs[0]), 'mfcc_2': np.mean(mfccs[1]), 'mfcc_3': np.mean(mfccs[2]),
            'mfcc_4': np.mean(mfccs[3]), 'mfcc_5': np.mean(mfccs[4]), 'mfcc_6': np.mean(mfccs[5]),
            'mfcc_7': np.mean(mfccs[6]), 'mfcc_8': np.mean(mfccs[7]), 'mfcc_9': np.mean(mfccs[8]),
            'mfcc_10': np.mean(mfccs[9]), 'mfcc_11': np.mean(mfccs[10]), 'mfcc_12': np.mean(mfccs[11]),
            'mfcc_13': np.mean(mfccs[12]), 'mfcc_14': np.mean(mfccs[13]), 'mfcc_15': np.mean(mfccs[14]),
            'mfcc_16': np.mean(mfccs[15]), 'mfcc_17': np.mean(mfccs[16]), 'mfcc_18': np.mean(mfccs[17]),
            'mfcc_19': np.mean(mfccs[18]), 'mfcc_20': np.mean(mfccs[19]), 'mfcc_21': np.mean(mfccs[20]),
            'mfcc_22': np.mean(mfccs[21]), 'mfcc_23': np.mean(mfccs[22]), 'mfcc_24': np.mean(mfccs[23]),
            'mfcc_25': np.mean(mfccs[24]), 'mfcc_26': np.mean(mfccs[25]),
            'zcr': np.mean(zcr),
            'spectral_centroid': np.mean(spectral_centroid),
            'spectral_bandwidth': np.mean(spectral_bandwidth),
            'rms': np.mean(rms),
        }
        for i in range(12): features[f'chroma_{i+1}'] = np.mean(chroma[i])
        for i in range(7): features[f'spectral_contrast_{i+1}'] = np.mean(spectral_contrast[i])
        for i in range(6): features[f'tonnetz_{i+1}'] = np.mean(tonnetz[i])

        # Print some basic statistics about the features
        print("Feature statistics:")
        print(f"RMS energy: {features['rms']:.4f}")
        print(f"Zero crossing rate: {features['zcr']:.4f}")
        print(f"Spectral centroid: {features['spectral_centroid']:.4f}")
        print(f"First few MFCCs: {[features[f'mfcc_{i+1}'] for i in range(5)]}")

        return features
    except Exception as e:
        print(f"Error extracting features from segment: {e}")
        # Return None or an empty dict to indicate failure for this segment
        return None

# Function to process audio file (adapted from notebook)
def process_audio_file(file_path, sr=EXPECTED_SR, duration=SEGMENT_DURATION):
    """Loads an audio file, segments it, and extracts features from each segment."""
    segment_features_list = []
    try:
        # Load the audio file using librosa
        # Librosa attempts to handle various formats if backend libs (like ffmpeg) are available
        print(f"Loading audio file: {file_path} with target sr={sr}")
        y, loaded_sr = librosa.load(file_path, sr=sr)
        print(f"Audio loaded successfully. Duration: {len(y)/loaded_sr:.2f}s, Sample Rate: {loaded_sr}")

        segment_length = int(loaded_sr * duration)
        if segment_length == 0:
             print("Warning: Calculated segment length is zero. Audio might be too short.")
             return [] # Return empty list if segment length is invalid

        num_segments = len(y) // segment_length
        print(f"Processing {num_segments} full segments of {duration}s...")

        # Process full segments
        for i in range(num_segments):
            start = i * segment_length
            end = start + segment_length
            segment = y[start:end]
            features = extract_features_segment(segment, loaded_sr)
            if features:
                segment_features_list.append(features)
            else:
                 print(f"Warning: Failed to extract features for segment {i}")

        # Process any remaining audio (padding if necessary)
        remaining_samples = len(y) % segment_length
        if remaining_samples > 0:
            print(f"Processing remaining {remaining_samples/loaded_sr:.2f}s segment (padding to {duration}s)..." )
            last_segment_y = y[num_segments * segment_length:]
            # Pad the last segment to the required duration
            padded_segment = librosa.util.fix_length(last_segment_y, size=segment_length)
            last_features = extract_features_segment(padded_segment, loaded_sr)
            if last_features:
                segment_features_list.append(last_features)
            else:
                 print(f"Warning: Failed to extract features for the final padded segment")

        if not segment_features_list:
             print("Warning: No features were extracted from the audio file.")

        return segment_features_list

    except Exception as e:
        print(f"Error processing audio file {file_path}: {e}")
        # This might include librosa load errors if ffmpeg/backend is missing for the format
        if "audioread.exceptions.NoBackendError" in str(e):
             print("Hint: Librosa backend error. Is FFmpeg installed and accessible?")
        return None # Indicate failure

# Function to predict from features (adapted from notebook)
def predict_from_features(features_list):
    """Takes a list of feature dictionaries, preprocesses, and predicts using loaded models."""
    if not features_list:
        print("Prediction function received no features.")
        return {"error": "No features extracted from audio"}

    try:
        # Create DataFrame matching the structure expected by scaler/pca
        # Ensure columns are in the same order as during training
        feature_df = pd.DataFrame(features_list)
        # Reindex to ensure all expected columns are present, fill missing with 0 (or mean if appropriate)
        # This step is crucial if extract_features_segment might fail and return partial data
        # Load the expected columns from the scaler if possible, otherwise define manually
        expected_columns = scaler.feature_names_in_ if hasattr(scaler, 'feature_names_in_') else None
        if expected_columns is not None:
             feature_df = feature_df.reindex(columns=expected_columns, fill_value=0)
        else:
             print("Warning: Could not get expected columns from scaler. Prediction might fail if columns mismatch.")
             # Manually define columns based on notebook if needed as a fallback

        print(f"Feature DataFrame shape for prediction: {feature_df.shape}")
        if feature_df.isnull().values.any():
            print("Warning: Feature DataFrame contains NaN values. Filling with 0.")
            feature_df = feature_df.fillna(0)

        # Preprocess: Scale and apply PCA
        scaled_features = scaler.transform(feature_df)
        pca_features = pca_model.transform(scaled_features)
        print(f"PCA features shape: {pca_features.shape}")

        # Predict using each model
        pred_rf = rf_model.predict(pca_features)
        pred_knn = knn_model.predict(pca_features)
        pred_xgb = xgb_model.predict(pca_features)

        # Decode predictions
        pred_rf_labels = label_encoder.inverse_transform(pred_rf)
        pred_knn_labels = label_encoder.inverse_transform(pred_knn)
        pred_xgb_labels = label_encoder.inverse_transform(pred_xgb)

        # Aggregate results using majority voting across segments
        if len(pred_rf_labels) > 0:
            # Get majority prediction for each model
            rf_majority = Counter(pred_rf_labels).most_common(1)[0][0]
            knn_majority = Counter(pred_knn_labels).most_common(1)[0][0]
            xgb_majority = Counter(pred_xgb_labels).most_common(1)[0][0]
            
            # Get overall majority across all models
            all_predictions = pred_rf_labels.tolist() + pred_knn_labels.tolist() + pred_xgb_labels.tolist()
            overall_majority = Counter(all_predictions).most_common(1)[0][0]
            
            predictions = {
                "RandomForest": rf_majority,
                "KNN": knn_majority,
                "XGBoost": xgb_majority,
                "Overall": overall_majority,
                "segments_processed": len(features_list)
            }
            print(f"Returning predictions: {predictions}")
            return predictions
        else:
            print("No predictions generated.")
            return {"error": "Prediction failed after feature extraction"}

    except Exception as e:
        print(f"Error during prediction phase: {e}")
        # Check for specific errors like column mismatch
        if "X has a different number of features than expected" in str(e):
             print("Hint: Feature mismatch error. Check feature extraction and column order.")
        return {"error": f"Prediction failed: {e}"}

# Combined function for API
def process_and_predict_file(file_path):
    """Processes an audio file and returns predictions."""
    print(f"Starting processing for: {file_path}")
    features = process_audio_file(file_path)
    if features is None:
        # Error occurred during loading or feature extraction
        return {"error": "Failed to process audio file. Check server logs."}
    if not features:
        # No features extracted (e.g., file too short or empty)
        return {"error": "No valid audio features could be extracted."}

    # Predict based on the extracted features
    predictions = predict_from_features(features)
    return predictions


