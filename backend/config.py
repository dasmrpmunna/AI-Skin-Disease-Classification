import os
from dotenv import load_dotenv
from tensorflow.keras.models import load_model

# Load environment variables from .env
load_dotenv()

class Config:
    """Base configuration class"""

    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    DEBUG = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'

    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

    # Model settings
    MODEL_PATH = os.environ.get(
        'MODEL_PATH',
        os.path.join("models", "Skill_disease_classification_model.keras")
    )
    IMAGE_SIZE = (128, 128)  # Input size for your trained model
    BATCH_SIZE = 32          # Batch size used during training

    # API settings
    API_RATE_LIMIT = os.environ.get('API_RATE_LIMIT', '100 per hour')

    # CORS settings
    CORS_ORIGINS = os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:3000,http://localhost:5173'
    ).split(',')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


# ✅ Load model once here so that whole app can reuse it
try:
    model = load_model(Config.MODEL_PATH, compile=False)
    print(f"✅ Model loaded successfully from {Config.MODEL_PATH}")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None
