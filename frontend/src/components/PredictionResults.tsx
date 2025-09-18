import React from 'react';
import { CheckCircle, AlertTriangle, TrendingUp, Target, Activity, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionResult } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface PredictionResultsProps {
  result: PredictionResult;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100';
    if (confidence >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Prepare chart data for all 9 disease classes
  const chartData = result.allPredictions.map((pred, index) => ({
    class: pred.class.length > 15 ? pred.class.substring(0, 15) + '...' : pred.class,
    fullClass: pred.class,
    probability: pred.probability,
    isTop: index === 0,
  }));

  // Mock training data for the metrics cards
  const trainingAccuracyData = [
    { epoch: 1, accuracy: 52 }, { epoch: 5, accuracy: 73 }, { epoch: 10, accuracy: 89 },
    { epoch: 15, accuracy: 95 }, { epoch: 20, accuracy: 98 }, { epoch: 25, accuracy: 99 },
    { epoch: 30, accuracy: 99.5 }, { epoch: 35, accuracy: 99.8 }, { epoch: 40, accuracy: 100 },
    { epoch: 45, accuracy: 100 }, { epoch: 50, accuracy: 100 }
  ];

  const trainingLossData = [
    { epoch: 1, loss: 1.61 }, { epoch: 5, loss: 0.87 }, { epoch: 10, loss: 0.32 },
    { epoch: 15, loss: 0.18 }, { epoch: 20, loss: 0.08 }, { epoch: 25, loss: 0.04 },
    { epoch: 30, loss: 0.02 }, { epoch: 35, loss: 0.01 }, { epoch: 40, loss: 0.005 },
    { epoch: 45, loss: 0.002 }, { epoch: 50, loss: 0.001 }
  ];

  const confusionMatrix = [
    [88, 0, 3, 0, 0, 2, 6, 1, 0],
    [0, 88, 4, 1, 0, 2, 1, 3, 1],
    [0, 0, 94, 0, 0, 2, 1, 0, 3],
    [0, 2, 1, 96, 0, 0, 0, 1, 0],
    [3, 0, 2, 0, 90, 4, 1, 0, 0],
    [3, 1, 1, 0, 3, 85, 0, 3, 3],
    [4, 2, 5, 0, 3, 3, 78, 2, 2],
    [2, 1, 0, 2, 0, 1, 3, 90, 1],
    [0, 0, 3, 1, 0, 0, 0, 2, 94]
  ];

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
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Prediction Results</h2>
              <p className="text-blue-100">
                Analysis completed at {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Prediction Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Prediction</h3>
          <div className={`inline-block rounded-2xl p-6 ${getConfidenceBgColor(result.confidence)}`}>
            <h4 className="text-3xl font-bold text-gray-900 mb-2">
              {result.predictedClass}
            </h4>
            <span className={`text-4xl font-bold ${getConfidenceColor(result.confidence)}`}>
              {result.confidence}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bar Chart of All Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Prediction Probabilities for All Disease Classes
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="class" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `${value.toFixed(2)}%`, 
                props.payload.fullClass
              ]}
              labelFormatter={(label: string, payload: any) => 
                payload?.[0]?.payload?.fullClass || label
              }
              contentStyle={{
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="probability" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Image and Results Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Analysis Details</h3>
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Image</h4>
            <img
              src={result.imageUrl}
              alt="Analyzed skin lesion"
              className="w-full max-w-md rounded-lg shadow-md mx-auto"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Predictions</h4>
              <div className="space-y-3">
                {result.topPredictions.slice(0, 3).map((pred, index) => (
                  <motion.div
                    key={pred.class}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-900">{pred.class}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-700">
                        {pred.probability.toFixed(1)}%
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Confidence</div>
                <div className={`text-lg font-bold ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence >= 80 ? 'High' : result.confidence >= 60 ? 'Medium' : 'Low'}
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-lg font-bold text-green-600">Complete</div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Action</div>
                <div className="text-lg font-bold text-purple-600">Consult MD</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Model Metrics Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Training Accuracy Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Training Accuracy</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trainingAccuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Accuracy']}
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
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-blue-600">86.8%</span>
            <p className="text-sm text-gray-600">Final Accuracy</p>
          </div>
        </motion.div>

        {/* Training Loss Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="h-8 w-8 text-red-600" />
            <h3 className="text-lg font-bold text-gray-900">Training Loss</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trainingLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="epoch" fontSize={12} />
              <YAxis fontSize={12} />
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
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-red-600">0.025</span>
            <p className="text-sm text-gray-600">Final Loss</p>
          </div>
        </motion.div>

        {/* Confusion Matrix Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Confusion Matrix</h3>
          </div>
          <div className="overflow-hidden">
            <div className="grid grid-cols-9 gap-0.5 text-xs">
              {confusionMatrix.map((row, rowIndex) => (
                row.map((value, colIndex) => {
                  const isCorrect = rowIndex === colIndex;
                  const intensity = value / 100;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square flex items-center justify-center text-xs font-semibold rounded ${
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
                })
              ))}
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-2xl font-bold text-green-600">9x9</span>
            <p className="text-sm text-gray-600">Disease Classes</p>
          </div>
        </motion.div>
      </div>

      {/* Recommendation Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Medical Disclaimer</h3>
            <p className="text-yellow-700 text-sm leading-relaxed">
              This AI prediction is for educational and research purposes only. It should not be used as a substitute 
              for professional medical diagnosis or treatment. Always consult with qualified healthcare professionals 
              for proper medical evaluation and care.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PredictionResults;