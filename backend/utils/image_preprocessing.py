import numpy as np
from PIL import Image
import cv2

def preprocess_image(image, target_size=(128, 128)):
    """
    Preprocess image for your trained model
    
    Args:
        image: PIL Image object
        target_size: Target size for the model (width, height) - default (128, 128)
    
    Returns:
        Preprocessed image array ready for model prediction
    """
    try:
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize image
        image = image.resize(target_size, Image.Resampling.LANCZOS)
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Normalize pixel values to [0, 1]
        img_array = img_array.astype(np.float32) / 255.0
        
        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)
        
        # Note: If you used ImageNet preprocessing during training, uncomment below:
        # mean = np.array([0.485, 0.456, 0.406])
        # std = np.array([0.229, 0.224, 0.225])
        # img_array = (img_array - mean) / std
        
        return img_array
        
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def augment_image(image):
    """
    Apply data augmentation techniques (optional)
    
    Args:
        image: PIL Image object
    
    Returns:
        Augmented image
    """
    # Add your augmentation logic here if needed
    # For example: rotation, flipping, brightness adjustment
    return image

def validate_image(image):
    """
    Validate if the image is suitable for processing
    
    Args:
        image: PIL Image object
    
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        # Check image dimensions
        width, height = image.size
        if width < 32 or height < 32:
            return False
        
        # Check if image can be converted to RGB
        image.convert('RGB')
        
        return True
        
    except Exception:
        return False