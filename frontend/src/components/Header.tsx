import React from 'react';
import { Brain, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg border-b border-gray-100"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-10 w-10 text-blue-600" />
              <Activity className="h-4 w-4 text-green-500 absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI Skin Disease Classification
              </h1>
              <p className="text-sm text-gray-600">
                Advanced VGG19 Deep Learning Model
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">86.8%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">9</div>
              <div className="text-xs text-gray-500">Classes</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-purple-600">VGG19</div>
              <div className="text-xs text-gray-500">Model</div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;