from flask import Flask, request, jsonify
import time

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    # Your ML logic here
    result = {"prediction": "positive", "confidence": 0.92}
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

# curl -X POST -H "Content-Type: application/json" -d '{"text":"I love this product!"}' http://localhost:8000/predict