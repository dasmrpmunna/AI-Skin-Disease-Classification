import axios from 'axios';
import { PredictionResult } from '../types';

// Configure your backend API endpoint
const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Disease classes matching your model
const DISEASE_CLASSES = [
  'Actinic Keratosis',
  'Pigmented Benign Keratosis',
  'Melanoma',
  'Vascular Lesion',
  'Squamous Cell Carcinoma',
  'Basal Cell Carcinoma',
  'Seborrheic Keratosis',
  'Dermatofibroma',
  'Nevus',
];

export const predictDisease = async (imageFile: File): Promise<PredictionResult> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('file', imageFile);

    // Make API call to Flask backend
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Transform the response to match our PredictionResult interface
    const { data } = response;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      imageUrl: URL.createObjectURL(imageFile),
      predictedClass: data.predicted_class || data.prediction,
      confidence: Math.round((data.confidence || data.max_probability) * 100),
      topPredictions: (data.top_predictions || data.predictions || []).slice(0, 3).map((pred: any) => ({
        class: pred.class,
        probability: (pred.probability || pred.confidence) * 100,
      })),
      allPredictions: (data.all_predictions || data.predictions || []).map((pred: any) => ({
        class: pred.class,
        probability: (pred.probability || pred.confidence) * 100,
      })),
    };
  } catch (error) {
    console.error('Prediction API error:', error);
    throw new Error('Failed to get prediction from server. Make sure your Flask backend is running on http://localhost:5000');
  }
};

export const getModelMetrics = async () => {
  try {
    const response = await api.get('/metrics');
    return response.data;
  } catch (error) {
    console.error('Metrics API error:', error);
    throw new Error('Failed to get model metrics');
  }
};