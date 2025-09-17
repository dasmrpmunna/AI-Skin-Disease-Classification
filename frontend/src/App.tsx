import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Navigation from './components/Navigation';
import UploadSection from './components/UploadSection';
import PredictionResults from './components/PredictionResults';
import VisualizationCharts from './components/VisualizationCharts';
import ModelMetrics from './components/ModelMetrics';
import PredictionHistory from './components/PredictionHistory';
import DiseaseInfo from './components/DiseaseInfo';
import { PredictionResult, ModelMetrics as ModelMetricsType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Model metrics with actual training data
  const modelMetrics: ModelMetricsType = {
    accuracy: 86.8,
    loss: 0.025,
    confusionMatrix: [
      [88, 0, 3, 0, 0, 2, 6, 1, 0], // Actinic Keratosis
      [0, 88, 4, 1, 0, 2, 1, 3, 1], // Pigmented Benign Keratosis
      [0, 0, 94, 0, 0, 2, 1, 0, 3], // Melanoma
      [0, 2, 1, 96, 0, 0, 0, 1, 0], // Vascular Lesion
      [3, 0, 2, 0, 90, 4, 1, 0, 0], // Squamous Cell Carcinoma
      [3, 1, 1, 0, 3, 85, 0, 3, 3], // Basal Cell Carcinoma
      [4, 2, 5, 0, 3, 3, 78, 2, 2], // Seborrheic Keratosis
      [2, 1, 0, 2, 0, 1, 3, 90, 1], // Dermatofibroma
      [0, 0, 3, 1, 0, 0, 0, 2, 94]  // Nevus
    ],
    accuracyHistory: [0.52, 0.73, 0.81, 0.86, 0.89, 0.93, 0.95, 0.97, 0.98, 0.99, 0.99, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.94, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    lossHistory: [1.61, 0.87, 0.58, 0.43, 0.32, 0.25, 0.18, 0.14, 0.11, 0.09, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.015, 0.01, 0.008, 0.006, 0.005, 0.004, 0.003, 0.002, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.015, 0.012, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001]
  };

  const handlePredictionComplete = (result: PredictionResult) => {
    setPredictionResult(result);
    setPredictionHistory(prev => {
      const updated = [result, ...prev.slice(0, 4)];
      return updated;
    });
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'upload' && (
            <UploadSection
              onPredictionComplete={handlePredictionComplete}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          )}
          
          {activeTab === 'results' && predictionResult && (
            <div className="space-y-8">
              <PredictionResults result={predictionResult} />
              <VisualizationCharts predictions={predictionResult.allPredictions} />
            </div>
          )}
          
          {activeTab === 'metrics' && (
            <ModelMetrics metrics={modelMetrics} />
          )}
          
          {activeTab === 'history' && (
            <PredictionHistory history={predictionHistory} />
          )}
          
          {activeTab === 'info' && <DiseaseInfo />}
        </motion.div>
      </main>
    </div>
  );
}

export default App;