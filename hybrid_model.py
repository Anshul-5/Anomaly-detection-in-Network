# -------------------- LOAD DATA --------------------
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense
from tensorflow.keras.optimizers import Adam
import xgboost as xgb
import joblib
import os

data = pd.read_csv("Week_filtered.csv")

# Drop rows with NaNs or infinite values
data = data.replace([np.inf, -np.inf], np.nan).dropna()

# Separate features and label
X = data.drop(columns=["Label"])  # assumes "Label" is the target
y = data["Label"]

# Encode target labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Scale numeric features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# -------------------- TRAIN/TEST SPLIT --------------------
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_encoded, test_size=0.2, random_state=42)

# -------------------- XGBOOST --------------------
xgb_model = xgb.XGBClassifier(n_estimators=200, max_depth=6, learning_rate=0.1, verbosity=1)
xgb_model.fit(X_train, y_train)

# Evaluate
y_pred = xgb_model.predict(X_test)
print("----- XGBoost Classification Report -----")
print(classification_report(y_test, y_pred))

# -------------------- AUTOENCODER --------------------
benign_index = list(label_encoder.classes_).index('BENIGN')
normal_data = X_scaled[y_encoded == benign_index]

# Autoencoder architecture
input_dim = normal_data.shape[1]
encoding_dim = 32

input_layer = Input(shape=(input_dim,))
encoded = Dense(encoding_dim, activation='relu')(input_layer)
decoded = Dense(input_dim, activation='linear')(encoded)

autoencoder = Model(inputs=input_layer, outputs=decoded)
autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mse')

autoencoder.fit(normal_data, normal_data,
                epochs=50,
                batch_size=256,
                shuffle=True,
                validation_split=0.1,
                verbose=1)

# -------------------- THRESHOLD --------------------
reconstructions = autoencoder.predict(normal_data)
mse = np.mean(np.square(normal_data - reconstructions), axis=1)
mean_mse = np.mean(mse)
std_mse = np.std(mse)
threshold = mean_mse + 3 * std_mse

print(f"\nAutoencoder Threshold: {threshold:.6f}")

# -------------------- SAVE MODELS AND ENCODERS --------------------
os.makedirs("models", exist_ok=True)
joblib.dump(xgb_model, "models/xgb_model.joblib")
joblib.dump(scaler, "models/scaler.joblib")
joblib.dump(label_encoder, "models/label_encoder.joblib")
autoencoder.save("models/autoencoder_model.keras")
with open("models/autoencoder_threshold.txt", "w") as f:
    f.write(str(threshold))

print("Models and encoders saved to 'models/' directory.")

# -------------------- HYBRID PREDICT FUNCTION --------------------
def hybrid_predict(sample):
    xgb_pred = xgb_model.predict(sample.reshape(1, -1))[0]
    class_name = label_encoder.inverse_transform([xgb_pred])[0]

    if class_name != 'BENIGN':
        return f"Known Attack: {class_name}"

    reconstructed = autoencoder.predict(sample.reshape(1, -1))
    reconstruction_error = np.mean((sample - reconstructed[0]) ** 2)

    if reconstruction_error > threshold:
        return f"Unknown Anomaly Detected (Autoencoder) | Recon Error: {reconstruction_error:.6f}"
    else:
        return f"Normal | Recon Error: {reconstruction_error:.6f}"

# -------------------- TEST HYBRID SYSTEM --------------------
for i in range(5):
    sample = X_test[i]
    result = hybrid_predict(sample)
    print(f"Sample {i+1}: {result}")
    print(f"Actual Label: {label_encoder.inverse_transform([y_test[i]])[0]}\n")