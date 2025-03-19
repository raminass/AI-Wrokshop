from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from transformers import pipeline
import time

app = Flask(__name__)

print("Loading sentiment analysis model... This may take a minute.")
start_time = time.time()

# Load pre-trained model and tokenizer
model_name = "distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Create a sentiment analysis pipeline
sentiment_analyzer = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

load_time = time.time() - start_time
print(f"Model loaded in {load_time:.2f} seconds!")

@app.route('/')
def home():
    return '''
    <h1>Sentiment Analysis API</h1>
    <p>Use this API to analyze the sentiment of text.</p>
    <h2>How to use:</h2>
    <p>Send a POST request to <code>/analyze</code> with a JSON body containing a "text" field.</p>
    <p>Example using curl:</p>
    <pre>curl -X POST -H "Content-Type: application/json" -d '{"text":"I love this product!"}' http://localhost:5000/analyze</pre>
    <h2>Try it here:</h2>
    <form id="form">
        <textarea id="text" rows="4" cols="50" placeholder="Enter text to analyze..."></textarea><br>
        <button type="submit">Analyze</button>
    </form>
    <div id="result"></div>
    <script>
        document.getElementById('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = document.getElementById('text').value;
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({text})
            });
            const data = await response.json();
            document.getElementById('result').innerHTML = `
                <h3>Result:</h3>
                <p>Sentiment: <strong>${data.sentiment.label}</strong></p>
                <p>Confidence: <strong>${(data.sentiment.score * 100).toFixed(2)}%</strong></p>
            `;
        });
    </script>
    '''

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = data['text']
    
    # Perform sentiment analysis using HuggingFace
    result = sentiment_analyzer(text)
    
    # Format and return the result
    sentiment = {
        "label": result[0]['label'],
        "score": result[0]['score']
    }
    
    return jsonify({"sentiment": sentiment})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)