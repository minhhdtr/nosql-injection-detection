from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import logging
from datetime import datetime
import re

from feature_extractor import FeatureExtractor

feature_name = [
    '1. Contains Empty String',
    '2. Contains Injection Payload',
    '3. Contains Comparison',
    '4. Contains Logical Operator',
    '5. Contains Evaluation Query Operation',
    '6. Presence of return',
    '7. New Query',
    '8. Contains Always True Expression',
    '10. Contains Null Comparison',
    '12. Drop Database',
    '13. Update Query',
    '16. Infinite Loop'
 ]

with open('payload.txt', 'r') as f:
    payload_list = [line.strip() for line in f.readlines()]

extractor = FeatureExtractor(payload_list)
loaded = joblib.load('best_model.pkl')
model = loaded['model']

logging.basicConfig(
    filename='injection.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
)

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print('Received request from Node.js:', data)
    query = data.get('query', '')

    full_features = extractor.extract_features(query)
    
    selected_indices = [0, 1, 2, 3, 4, 5, 6, 7, 9, 11, 12, 15]
    selected_features = [full_features[i] for i in selected_indices]
    
    df = pd.DataFrame([selected_features], columns=feature_name)

    prediction = model.predict(df)
    label = 'injection' if prediction == 1 else 'benign'
    
    if label == 'injection':
        logging.info(f'🚨 Detected injection query: {query}')

    return jsonify({'prediction': label})

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)