from flask import Flask, jsonify, request
from tensorflow.keras.models import load_model
import numpy as np
import cv2
import requests
from io import BytesIO
from flask_cors import CORS
import os
from dotenv import load_dotenv
from groq import Groq

app = Flask(__name__)
CORS(app)
load_dotenv()

API_KEY_LLAMA = os.getenv("API_KEY_LLAMA")
model = load_model(r"models\ecg_model (1).h5")

# Image settings
img_size = 224
class_labels = ["Myocardial Infarction", "History of MI", "Abnormal Heartbeat", "Normal Person"]

# Function to generate Llama response
def generate_llama_response(result, file_path):
    predefined_prompt = f"""
    You are an expert cardiologist analyzing ECG readings.
    Keep the response within 5-6 lines
    
    Context:
    - ECG Analysis Result: {result}
    - Patient ECG: {file_path}
    
    Provide a concise analysis including:
    - Diagnosis summary
    - Key findings
    - Immediate actions (if critical)
    - Follow-up recommendations
    """
    client = Groq(api_key=API_KEY_LLAMA)
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": predefined_prompt}],
        model="llama3-8b-8192",
    )
    return response.choices[0].message.content

# Function to process and predict ECG image
def predict_ecg(image_source):
    # Check if the input is a URL
    if image_source.startswith("http"):
        response = requests.get(image_source)
        if response.status_code != 200:
            raise ValueError("Failed to fetch image from URL")

        image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    else:
        img = cv2.imread(image_source)
        if img is None:
            raise ValueError("Image not found or invalid file path")

    # Preprocess the image
    img = cv2.resize(img, (img_size, img_size))
    img = img / 255.0
    img = img.reshape(1, img_size, img_size, 3)

    # Make a prediction
    prediction = model.predict(img)
    class_index = np.argmax(prediction)
    result = class_labels[class_index]

    print(f"✅ Prediction: {result}")
    return result

# Flask API route
@app.route('/ecg', methods=['POST'])
def model_predict():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "No file path or URL provided"}), 400
    
    file_path = data['file_path']

    try:
        result = predict_ecg(file_path)
        response = generate_llama_response(result, file_path)
        return jsonify({"prediction": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(port=8001, host="0.0.0.0")