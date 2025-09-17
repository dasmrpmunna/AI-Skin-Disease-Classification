# Flask Backend for Skin Disease Classification

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Add Your Trained Model
**IMPORTANT**: You need to add your trained model file before the backend will work.

- Place your trained model file (`.h5` format) in the `backend/models/` directory
- Default expected filename: `skin-cancer-isic-9-classes_VGG19_V1_ph1_model.h5`
- Full expected path: `backend/models/skin-cancer-isic-9-classes_VGG19_V1_ph1_model.h5`
- If your model has a different name, update `MODEL_PATH` in `config.py`

**Model Requirements:**
- Input shape: (batch_size, 128, 128, 3)
- Output: 9 classes (softmax probabilities)
- Training batch size: 32
- Expected classes in order:
  1. Actinic Keratosis
  2. Pigmented Benign Keratosis  
  3. Melanoma
  4. Vascular Lesion
  5. Squamous Cell Carcinoma
  6. Basal Cell Carcinoma
  7. Seborrheic Keratosis
  8. Dermatofibroma
  9. Nevus

### 4. Configure Environment (Optional)
Create a `.env` file in the backend directory:
```
FLASK_DEBUG=True
MODEL_PATH=models/skin-cancer-isic-9-classes_VGG19_V1_ph1_model.h5
SECRET_KEY=your-secret-key
UPLOAD_FOLDER=uploads
IMAGE_SIZE=128,128
BATCH_SIZE=32
```

### 5. Run the Backend
```bash
python app.py
```

The backend will run on `http://localhost:5000`

**Note**: If you haven't added your model file yet, the backend will start but predictions will return an error until you place your trained model in the `models/` directory.

## API Endpoints

### POST /predict
Upload an image for disease classification
- **Body**: Form data with 'image' or 'file' field
- **Response**: JSON with prediction results

### GET /metrics
Get model performance metrics
- **Response**: JSON with accuracy and loss

### GET /health
Health check endpoint
- **Response**: JSON with service status

## File Structure
```
backend/
├── app.py                 # Main Flask application
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── models/              # Your trained models
├── utils/               # Utility functions
│   ├── image_preprocessing.py
│   └── model_utils.py
├── uploads/             # Temporary uploads
└── README.md           # This file
```

## Customization

### Update Disease Classes
Edit the `DISEASE_CLASSES` list in `app.py` to match your model's output classes.

### Update Image Size
If you trained with a different image size, update `IMAGE_SIZE` in `config.py`.

### Modify Image Preprocessing
Update `utils/image_preprocessing.py` to match your model's preprocessing requirements. 
Current configuration:
- Input size: 128x128x3
- Normalization: [0, 1] range
- ImageNet preprocessing: commented out (uncomment if used during training)

### Add Authentication
Implement authentication in `app.py` if needed for production use.

## Testing

Test the API endpoints:
```bash
# Health check
curl http://localhost:5000/health

# Upload image for prediction
curl -X POST -F "image=@path/to/your/image.jpg" http://localhost:5000/predict
```

## Production Deployment

For production, use a WSGI server like Gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```