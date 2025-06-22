import numpy as np
import joblib
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load models and encoders
xgb_model = joblib.load("models/xgb_model.joblib")
scaler = joblib.load("models/scaler.joblib")
label_encoder = joblib.load("models/label_encoder.joblib")
autoencoder = load_model("models/autoencoder_model.keras")
with open("models/autoencoder_threshold.txt") as f:
    threshold = float(f.read())

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json  # expects a dict of features
    features = np.array([list(data.values())], dtype=float)
    features_scaled = scaler.transform(features)
    xgb_pred = xgb_model.predict(features_scaled)[0]
    class_name = label_encoder.inverse_transform([xgb_pred])[0]

    if class_name != "BENIGN":
        result = {"prediction": f"Known Attack: {class_name}"}
    else:
        recon = autoencoder.predict(features_scaled)
        recon_error = float(np.mean((features_scaled - recon) ** 2))
        if recon_error > threshold:
            result = {"prediction": "Unknown Anomaly", "reconstruction_error": recon_error}
        else:
            result = {"prediction": "Normal", "reconstruction_error": recon_error}
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)