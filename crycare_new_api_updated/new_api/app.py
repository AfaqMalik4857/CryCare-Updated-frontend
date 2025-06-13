#!/usr/bin/env python
# coding: utf-8

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

# Import the processing function from our new processing script
from processing import process_and_predict_file

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
HISTORY_FOLDER = os.path.join(os.path.dirname(__file__), 'history')
# Ensure both directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(HISTORY_FOLDER, exist_ok=True)

# History file path
HISTORY_FILE = os.path.join(HISTORY_FOLDER, 'history.json')

# Initialize history file if it doesn't exist
if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, 'w') as f:
        json.dump([], f)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["HISTORY_FOLDER"] = HISTORY_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024 # Optional: Limit file size (e.g., 16MB)

# Helper function to save history
def save_to_history(prediction_data):
    """Save prediction data to history file."""
    try:
        # Load existing history
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)
        else:
            history = []
        
        # Add new entry to history
        history.append(prediction_data)
        
        # Save updated history
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
            
        return True
    except Exception as e:
        print(f"Error saving to history: {e}")
        return False

@app.route("/predict", methods=["POST"])
def predict_audio():
    """Endpoint to receive an audio file, process it, and return predictions."""
    if "file" not in request.files:
        print("API Error: No file part in the request")
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files["file"]

    if file.filename == "":
        print("API Error: No selected file")
        return jsonify({"error": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        try:
            file.save(file_path)
            print(f"API: File saved temporarily to {file_path}")

            # Check if the file is too short (less than 1 second)
            # This would require additional audio processing libraries
            # For now, we'll rely on the processing function to handle this

            # Call the main processing function from processing.py
            predictions = process_and_predict_file(file_path)

            # Check if processing returned an error
            if isinstance(predictions, dict) and "error" in predictions:
                print(f"API Error: Processing failed - {predictions['error']}")
                # Return 400 for client errors, 500 for server errors
                return jsonify(predictions), 400 if "too short" in predictions["error"].lower() else 500
            else:
                print(f"API: Successfully processed. Predictions: {predictions}")
                
                # Create history entry
                history_entry = {
                    "id": f"{datetime.now().isoformat()}_{os.path.basename(file_path)}",
                    "timestamp": datetime.now().isoformat(),
                    "filename": os.path.basename(file_path),
                    "predictions": predictions
                }
                
                # Save to history
                save_to_history(history_entry)
                
                return jsonify(predictions), 200

        except Exception as e:
            # Catch any unexpected errors during file save or processing call
            print(f"API Error: Unexpected error in /predict endpoint: {e}")
            return jsonify({"error": f"An unexpected server error occurred: {e}"}), 500
        finally:
            # Clean up the uploaded file
            if os.path.exists(file_path):
                try:
                    os.remove(file_path)
                    print(f"API: Cleaned up file: {file_path}")
                except OSError as e:
                    print(f"API Error: Failed to remove temp file {file_path}: {e}")
    else:
        # If not checking extensions, this part might not be reached unless file is empty
        print(f"API Error: Invalid file received: {file.filename}")
        return jsonify({"error": "Invalid file received"}), 400

@app.route("/history", methods=["GET"])
def get_history():
    """Endpoint to retrieve prediction history."""
    try:
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)
            return jsonify(history)
        else:
            return jsonify([])
    except Exception as e:
        return jsonify({"error": f"Error retrieving history: {str(e)}"}), 500

@app.route("/history/<string:history_id>", methods=["DELETE"])
def delete_history_item(history_id):
    """Endpoint to delete a specific history item by ID."""
    try:
        # Load existing history
        if os.path.exists(HISTORY_FILE):
            with open(HISTORY_FILE, 'r') as f:
                history = json.load(f)
        else:
            return jsonify({"error": "History file not found"}), 404
        
        # Find and remove the item with the matching ID
        initial_length = len(history)
        history = [item for item in history if item.get('id') != history_id]
        
        # Check if any item was removed
        if len(history) == initial_length:
            return jsonify({"error": f"History item with ID {history_id} not found"}), 404
        
        # Save updated history
        with open(HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
        
        return jsonify({"success": True, "message": f"History item {history_id} deleted successfully"}), 200
    
    except Exception as e:
        print(f"API Error: Failed to delete history item: {e}")
        return jsonify({"error": f"Failed to delete history item: {str(e)}"}), 500

@app.route("/history", methods=["DELETE"])
def delete_all_history():
    """Endpoint to delete all history items."""
    try:
        # Create empty history
        with open(HISTORY_FILE, 'w') as f:
            json.dump([], f)
        
        return jsonify({"success": True, "message": "All history items deleted successfully"}), 200
    
    except Exception as e:
        print(f"API Error: Failed to delete all history: {e}")
        return jsonify({"error": f"Failed to delete all history: {str(e)}"}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    # Listen on all interfaces (0.0.0.0) to be accessible externally
    # Debug=True is helpful for development but should be False in production
    app.run(host="0.0.0.0", port=5000, debug=True)
