import React from 'react';
import { Clock, Eye, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionResult } from '../types';

interface PredictionHistoryProps {
  history: PredictionResult[];
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Predictions Yet</h3>
          <p className="text-gray-600">
            Upload and analyze your first medical image to see results here.
          </p>
        </div>
      </div>
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Prediction History</h2>
        <p className="text-lg text-gray-600">
          Your last {history.length} analysis results
        </p>
      </div>

      <div className="space-y-6">
        {history.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {result.predictedClass}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}% confidence
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Analyzed Image</h4>
                  <img
                    src={result.imageUrl}
                    alt="Analyzed"
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Top Predictions</h4>
                  <div className="space-y-2">
                    {result.topPredictions.slice(0, 3).map((pred, predIndex) => (
                      <div key={predIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{pred.class}</span>
                        <span className="font-semibold text-gray-900">
                          {pred.probability.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Confidence Distribution</h4>
                  <div className="space-y-2">
                    {result.topPredictions.slice(0, 3).map((pred, predIndex) => (
                      <div key={predIndex} className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>{pred.class}</span>
                          <span>{pred.probability.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${pred.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {history.length >= 5 && (
        <div className="text-center">
          <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3 inline-block">
            Showing your last 5 predictions. Older results are automatically archived.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictionHistory;