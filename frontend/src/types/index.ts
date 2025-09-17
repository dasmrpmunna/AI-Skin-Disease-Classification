export interface PredictionResult {
  id: string;
  timestamp: string;
  imageUrl: string;
  predictedClass: string;
  confidence: number;
  topPredictions: {
    class: string;
    probability: number;
  }[];
  allPredictions: {
    class: string;
    probability: number;
  }[];
}

export interface ModelMetrics {
  accuracy: number;
  loss: number;
  confusionMatrix: number[][];
  accuracyHistory: number[];
  lossHistory: number[];
}

export interface DiseaseClass {
  name: string;
  description: string;
  symptoms: string[];
  treatment: string;
}