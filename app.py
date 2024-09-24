from flask import Flask, request, jsonify, render_template
from flask_cors import CORS  # Import CORS
import joblib
import numpy as np
import pandas as pd  # Import pandas

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pre-trained model
model = joblib.load('DeliveryPrice.pkl')

@app.route('/favicon.ico')
def favicon():
    return '', 204  # Empty response with HTTP 204 status

@app.route('/')
def home():
    return render_template('wt-SignUp.html')

# Route to render the login page
@app.route('/wt-LogIn.html')
def login():
    return render_template('wt-LogIn.html')

# Route to render the form page
@app.route('/wt-form.html')
def form():
    return render_template('wt-form.html')

# API route to handle the price prediction
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Extract features
        distance = data.get('distance')
        weight = data.get('weight')
        cargo = data.get('cargo')
        urgency = data.get('urgency')
        fragile = data.get('fragile')

        # Validate numeric features
        if distance is None or weight is None:
            return jsonify({"error": "Missing numeric values for distance or weight"}), 400

        # Create a feature dictionary
        feature_dict = {
            'Distance': [distance],
            'Cargo': [cargo],
            'Urgency': [urgency],
            'Fragile': [fragile],
            'Weight': [weight]
        }

        # Convert it into a DataFrame to match the model's expectations
        features_df = pd.DataFrame(feature_dict)

        # Perform prediction
        predicted_price = model.predict(features_df)[0]

        # Return the predicted price as JSON
        return jsonify({"predicted_price": predicted_price})

    except Exception as e:
        print(f"Error: {e}")  # Log the error to the console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
