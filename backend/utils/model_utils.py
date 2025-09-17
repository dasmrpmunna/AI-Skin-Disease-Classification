import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import logging

logger = logging.getLogger(__name__)

def load_model_tf(model_path):
    """
    Load the trained model
    
    Args:
        model_path: Path to the saved model file
    
    Returns:
        Loaded Keras model
    """
    try:
        model = load_model(model_path, compile=False)
        logger.info(f"Model loaded successfully from {model_path}")
        return model
    except Exception as e:
        logger.error(f"Error loading model from {model_path}: {e}")
        raise Exception(f"Failed to load model: {str(e)}")

def predict_disease(model, processed_image):
    """
    Make prediction using the loaded model
    
    Args:
        model: Loaded Keras model
        processed_image: Preprocessed image array
    
    Returns:
        Prediction probabilities array
    """
    try:
        predictions = model.predict(processed_image, verbose=0)
        probabilities = predictions[0]  # Remove batch dimension
        probabilities = probabilities / np.sum(probabilities)  # Normalize
        return probabilities
    except Exception as e:
        logger.error(f"Error making prediction: {e}")
        raise Exception(f"Prediction failed: {str(e)}")

def get_model_info(model):
    """
    Get information about the loaded model
    
    Args:
        model: Loaded Keras model
    
    Returns:
        Dictionary with model information
    """
    try:
        info = {
            'input_shape': str(model.input_shape),
            'output_shape': str(model.output_shape),
            'total_params': int(model.count_params()),
            'layers': len(model.layers),
            'expected_input_size': '128x128x3',
            'batch_size': 32
        }
        return info
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return {}

def validate_prediction(predictions, threshold=0.1):
    """
    Validate prediction results
    
    Args:
        predictions: Prediction probabilities
        threshold: Minimum confidence threshold
    
    Returns:
        bool: True if prediction is valid
    """
    try:
        max_prob = np.max(predictions)
        return max_prob >= threshold
    except Exception:
        return False