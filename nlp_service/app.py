from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import string

app = Flask(__name__)
CORS(app)
analyzer = SentimentIntensityAnalyzer()

def get_dominant_emotion(text):
    text_lower = text.lower()
    
    # Simple keyword-based heuristic for basic emotions
    emotions = {
        'joy': ['happy', 'joy', 'glad', 'smile', 'great', 'awesome', 'good', 'excited', 'love', 'wonderful', 'blessed', 'calm', 'peace'],
        'sadness': ['sad', 'depressed', 'cry', 'down', 'blue', 'lonely', 'miss', 'heartbreak', 'grief', 'tears', 'hopeless'],
        'fear': ['afraid', 'scared', 'fear', 'anxious', 'nervous', 'panic', 'worry', 'worried', 'dread', 'terrified'],
        'anger': ['angry', 'mad', 'furious', 'hate', 'annoyed', 'frustrated', 'rage', 'pissed', 'resent'],
        'surprise': ['wow', 'surprise', 'shocked', 'unexpected', 'amazed', 'astonished']
    }
    
    scores = {e: 0 for e in emotions}
    words = text_lower.split()
    
    for word in words:
        clean_word = word.strip(string.punctuation)
        for emotion, keywords in emotions.items():
            if clean_word in keywords:
                scores[emotion] += 1
                
    # If no keywords matched, rely on VADER compound score
    if sum(scores.values()) == 0:
        vs = analyzer.polarity_scores(text)
        if vs['compound'] > 0.3:
            return 'joy'
        elif vs['compound'] < -0.3:
            return 'sadness'
        else:
            return 'neutral'
            
    return max(scores, key=scores.get)

def extract_themes(text):
    blob = TextBlob(text)
    # Extract noun phrases as simple themes
    themes = list(set(blob.noun_phrases))
    return themes[:3]  # Return top 3 themes

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
        
    text = data['text']
    
    if not text.strip():
        return jsonify({
            'sentiment': 'neutral',
            'dominantEmotion': 'neutral',
            'keyThemes': []
        })
    
    # 1. Sentiment using VADER
    vs = analyzer.polarity_scores(text)
    compound = vs['compound']
    
    if compound >= 0.05:
        sentiment = 'positive'
    elif compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
        
    # 2. Dominant Emotion
    emotion = get_dominant_emotion(text)
    
    # 3. Key Themes using TextBlob
    themes = extract_themes(text)
    
    return jsonify({
        'sentiment': sentiment,
        'dominantEmotion': emotion,
        'keyThemes': themes,
        'vaderScores': vs
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
