import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PredictionResult } from '../types';
import { predictDisease, checkBackendHealth } from '../services/api';

interface UploadSectionProps {
  onPredictionComplete: (result: PredictionResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  onPredictionComplete,
  isLoading,
  setIsLoading,
}) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Check backend health on component mount
  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkBackendHealth();
        setBackendStatus('connected');
      } catch (err) {
        setBackendStatus('error');
        setError('Cannot connect to backend server. Please make sure the Flask backend is running on port 5001.');
      }
    };
    checkHealth();
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setError(null);
      setIsLoading(true);

      try {
        const result = await predictDisease(file);
        onPredictionComplete(result);
      } catch (err: any) {
        console.error('Prediction error:', err);
        setError(err.message || 'Failed to predict disease. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [onPredictionComplete, setIsLoading]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
    disabled: isLoading || backendStatus === 'error',
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Skin Disease Classification Analysis
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a dermatology image to get instant AI-powered skin disease classification
          with confidence scores and detailed analysis.
        </p>
      </div>

      {/* Backend Status Indicator */}
      <div className="flex justify-center">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
          backendStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : backendStatus === 'error'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
        }`}>
          {backendStatus === 'connected' && <CheckCircle className="h-4 w-4" />}
          {backendStatus === 'error' && <AlertCircle className="h-4 w-4" />}
          {backendStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>
            {backendStatus === 'connected' && 'Backend Connected'}
            {backendStatus === 'error' && 'Backend Disconnected'}
            {backendStatus === 'checking' && 'Checking Backend...'}
          </span>
        </div>
      </div>

      <motion.div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : backendStatus === 'error'
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        } ${isLoading || backendStatus === 'error' ? 'pointer-events-none opacity-50' : ''}`}
        whileHover={{ scale: backendStatus === 'connected' ? 1.01 : 1 }}
        whileTap={{ scale: backendStatus === 'connected' ? 0.99 : 1 }}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Image...
              </h3>
              <p className="text-gray-600">
                Our AI model is processing your image
              </p>
            </div>
          </div>
        ) : uploadedImage ? (
          <div className="space-y-4">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="mx-auto max-h-64 rounded-lg shadow-md"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Image Ready for Analysis
              </h3>
              <p className="text-gray-600">
                Click to upload a different image or wait for results
              </p>
            </div>
          </div>
        ) : backendStatus === 'error' ? (
          <div className="space-y-4">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Backend Connection Error
              </h3>
              <p className="text-gray-600 mb-4">
                Cannot connect to the prediction server
              </p>
              <p className="text-sm text-gray-500">
                Please ensure the Flask backend is running on port 5001
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-16 w-16 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Dermatology Image
              </h3>
              <p className="text-gray-600 mb-4">
                Drag & drop your image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports JPG, PNG files up to 10MB
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="text-red-700 font-medium">Prediction Failed</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">High Accuracy</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Our VGG19 model achieves 86.8% accuracy across 9 skin disease classes.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Fast Processing</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Get instant results with detailed confidence scores and analysis.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Secure & Private</h3>
          </div>
          <p className="text-gray-600 text-sm">
            Your medical data is processed securely and never stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;