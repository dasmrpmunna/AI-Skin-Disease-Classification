from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import os
from utils.image_preprocessing import preprocess_image
from utils.model_utils import load_model_tf, predict_disease, get_model_info
from config import Config
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration
config = Config()
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = config.UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Disease classes - update these to match your model
DISEASE_CLASSES = [
    'Squamous Cell Carcinoma',
    'Basal Cell Carcinoma',
    'Dermatofibroma',
    'Vascular Lesion',
    'Melanoma',
    'Pigmented Benign Keratosis',
    'Nevus',
    'Seborrheic Keratosis',
    'Actinic Keratosis'
]

# Load your trained model on startup
model = None
try:
    if os.path.exists(config.MODEL_PATH):
        model = load_model_tf(config.MODEL_PATH)
        logger.info("Model loaded successfully")
    else:
        logger.warning(f"Model file not found at {config.MODEL_PATH}")
        logger.info("Please place your trained model file in the models/ directory")
        model = None
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({
                'error': 'Model not loaded', 
                'message': 'Please place your trained model file in the models/ directory',
                'expected_path': config.MODEL_PATH
            }), 500

        # Get the uploaded file
        if 'image' not in request.files and 'file' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files.get('image') or request.files.get('file')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Read and process the image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess image for your model with correct size
        processed_image = preprocess_image(image, target_size=config.IMAGE_SIZE)
        
        # Make prediction using your model
        predictions = predict_disease(model, processed_image)
        
        # Create prediction results
        all_predictions = []
        for i, class_name in enumerate(DISEASE_CLASSES):
            all_predictions.append({
                'class': class_name,
                'probability': float(predictions[i]) * 100,  # Convert to percentage
                'confidence': float(predictions[i]) * 100
            })
        
        # Sort by probability
        all_predictions.sort(key=lambda x: x['probability'], reverse=True)
        
        # Get top prediction
        top_prediction = all_predictions[0]
        
        # Get top 3 predictions
        top_3_predictions = all_predictions[:3]
        
        response = {
            'predicted_class': top_prediction['class'],
            'prediction': top_prediction['class'],
            'confidence': top_prediction['probability'] / 100,  # Keep as decimal for compatibility
            'max_probability': top_prediction['probability'] / 100,
            'predictions': all_predictions,
            'all_predictions': all_predictions,
            'top_predictions': top_3_predictions,
            'status': 'success'
        }
        
        logger.info(f"Prediction successful: {top_prediction['class']} ({top_prediction['probability']:.2f}%)")
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return jsonify({
            'error': str(e),
            'message': 'Prediction failed. Please check your model file and try again.',
            'status': 'error'
        }), 500

@app.route('/metrics', methods=['GET'])
def get_metrics():
    """Return your model metrics"""
    metrics = {
        'accuracy': 86.8,
        'loss': 0.025,
        'status': 'success'
    }
    return jsonify(metrics)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    model_info = {}
    if model is not None:
        model_info = get_model_info(model)
    
    return jsonify({
        'status': 'healthy', 
        'message': 'Flask backend is running',
        'model_loaded': model is not None,
        'model_info': model_info,
        'image_size': config.IMAGE_SIZE,
        'batch_size': config.BATCH_SIZE,
        'model_path': config.MODEL_PATH
    })

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Maximum size is 16MB.'}), 413

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)