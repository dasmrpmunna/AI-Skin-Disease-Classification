import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { ModelMetrics as ModelMetricsType } from '../types';
import { TrendingUp, Target, Zap } from 'lucide-react';

interface ModelMetricsProps {
  metrics: ModelMetricsType;
}

const ModelMetrics: React.FC<ModelMetricsProps> = ({ metrics }) => {
  const trainingData = metrics.accuracyHistory.map((acc, index) => ({
    epoch: index + 1,
    accuracy: acc * 100,
    loss: metrics.lossHistory[index],
  }));

  const diseaseClasses = [
    'Squamous Cell Carcinoma',
    'Basal Cell Carcinoma',
    'Dermatofibroma',
    'Vascular Lesion',
    'Melanoma',
    'Pigmented Benign Keratosis',
    'Nevus',
    'Seborrheic Keratosis',
    'Actinic Keratosis'
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <Target className="h-12 w-12" />
            <div>
              <h3 className="text-lg font-semibold opacity-90">Model Accuracy</h3>
              <p className="text-3xl font-bold">{metrics.accuracy}%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-12 w-12" />
            <div>
              <h3 className="text-lg font-semibold opacity-90">Final Loss</h3>
              <p className="text-3xl font-bold">{metrics.loss.toFixed(3)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <Zap className="h-12 w-12" />
            <div>
              <h3 className="text-lg font-semibold opacity-90">Architecture</h3>
              <p className="text-3xl font-bold">VGG19</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Training History */}
      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Training Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Accuracy']}
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Training Loss</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" label={{ value: 'Epoch', position: 'insideBottom', offset: -10 }} />
              <YAxis label={{ value: 'Loss', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number) => [value.toFixed(4), 'Loss']}
                contentStyle={{
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="loss" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Confusion Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Confusion Matrix</h3>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-10 gap-1 text-xs">
              {/* Header row */}
              <div className="p-2 font-semibold text-gray-600"></div>
              {diseaseClasses.map((className, index) => (
                <div key={index} className="p-2 font-semibold text-gray-600 text-center transform -rotate-45 origin-left">
                  {className}
                </div>
              ))}
              
              {/* Matrix rows */}
              {metrics.confusionMatrix.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <div className="p-2 font-semibold text-gray-600 text-right">
                    {diseaseClasses[rowIndex]}
                  </div>
                  {row.map((value, colIndex) => {
                    const isCorrect = rowIndex === colIndex;
                    const intensity = value / Math.max(...row);
                    return (
                      <div
                        key={colIndex}
                        className={`p-2 text-center font-semibold rounded ${
                          isCorrect 
                            ? 'bg-green-100 text-green-800' 
                            : value > 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-50 text-gray-400'
                        }`}
                        style={{
                          backgroundColor: isCorrect 
                            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.4})`
                            : value > 0 
                              ? `rgba(239, 68, 68, ${0.1 + intensity * 0.3})`
                              : undefined
                        }}
                      >
                        {value}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Green cells indicate correct predictions, red cells indicate misclassifications.
          The intensity of color represents the frequency of that prediction.
        </p>
      </motion.div>
    </div>
  );
};

export default ModelMetrics;