import axios from 'axios';
import { PredictionResult } from '../types';

// Configure your backend API endpoint - Updated to match backend port
const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictDisease = async (imageFile: File): Promise<PredictionResult> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Make API call to Flask backend
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Transform the response to match our PredictionResult interface
    const { data } = response;
    
    // Handle different response formats
    const predictedClass = data.predicted_class || data.prediction;
    const confidence = data.confidence ? Math.round(data.confidence * 100) : 0;
    const allPredictions = data.predictions || data.all_predictions || [];
    const topPredictions = data.top_predictions || allPredictions.slice(0, 3);
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      imageUrl: URL.createObjectURL(imageFile),
      predictedClass: predictedClass,
      confidence: confidence,
      topPredictions: topPredictions.map((pred: any) => ({
        class: pred.class,
        probability: pred.probability,
      })),
      allPredictions: allPredictions.map((pred: any) => ({
        class: pred.class,
        probability: pred.probability,
      })),
    };
  } catch (error: any) {
    console.error('Prediction API error:', error);
    
    // More detailed error handling
    if (error.response) {
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Server error occurred';
      throw new Error(`Server Error: ${errorMessage}`);
    } else if (error.request) {
      throw new Error('Cannot connect to server. Make sure your Flask backend is running on http://localhost:5001');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
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

export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw new Error('Backend health check failed');
  }
};