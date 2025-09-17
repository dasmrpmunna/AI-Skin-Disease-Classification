import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiseaseClass } from '../types';

const DiseaseInfo: React.FC = () => {
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null);

  const diseases: DiseaseClass[] = [
    {
      name: 'Squamous Cell Carcinoma',
      description: 'A type of skin cancer that begins in the squamous cells of the epidermis.',
      symptoms: ['Scaly red patches', 'Open sores', 'Elevated growths', 'Wart-like growths'],
      treatment: 'Surgical excision, Mohs surgery, radiation therapy, or topical treatments.',
    },
    {
      name: 'Basal Cell Carcinoma',
      description: 'The most common type of skin cancer, arising from basal cells in the epidermis.',
      symptoms: ['Pearly or waxy bumps', 'Flat, flesh-colored lesions', 'Bleeding or scabbing sores'],
      treatment: 'Surgical excision, Mohs surgery, electrodesiccation, or topical treatments.',
    },
    {
      name: 'Dermatofibroma',
      description: 'A common benign skin growth composed of fibrous tissue.',
      symptoms: ['Small, firm nodules', 'Brown or reddish color', 'Dimpling when pinched'],
      treatment: 'Usually no treatment needed; surgical removal if bothersome.',
    },
    {
      name: 'Vascular Lesion',
      description: 'Abnormal blood vessel formations in the skin, including hemangiomas.',
      symptoms: ['Red or purple discoloration', 'Raised or flat lesions', 'May blanch with pressure'],
      treatment: 'Laser therapy, sclerotherapy, or surgical removal depending on type.',
    },
    {
      name: 'Melanoma',
      description: 'The most serious type of skin cancer, developing from melanocytes.',
      symptoms: ['Asymmetrical moles', 'Irregular borders', 'Color variation', 'Diameter >6mm'],
      treatment: 'Wide surgical excision, sentinel lymph node biopsy, immunotherapy, targeted therapy.',
    },
    {
      name: 'Pigmented Benign Keratosis',
      description: 'Benign skin growths with pigmentation, including seborrheic keratoses.',
      symptoms: ['Brown or black patches', 'Waxy, stuck-on appearance', 'Well-defined borders'],
      treatment: 'Usually no treatment needed; cryotherapy or shave excision if desired.',
    },
    {
      name: 'Nevus',
      description: 'Common benign skin growths, also known as moles.',
      symptoms: ['Brown or black spots', 'Uniform color', 'Regular borders', 'Stable over time'],
      treatment: 'Monitoring for changes; surgical removal if suspicious changes occur.',
    },
    {
      name: 'Seborrheic Keratosis',
      description: 'Common benign skin growths that appear with aging.',
      symptoms: ['Brown, black, or tan growths', 'Waxy, scaly texture', 'Stuck-on appearance'],
      treatment: 'Usually no treatment needed; cryotherapy, curettage, or shave excision if bothersome.',
    },
    {
      name: 'Actinic Keratosis',
      description: 'Precancerous skin lesions caused by sun damage.',
      symptoms: ['Rough, scaly patches', 'Pink or red coloration', 'Sandpaper-like texture'],
      treatment: 'Cryotherapy, topical medications, photodynamic therapy, or curettage.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Disease Information</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Learn about the different skin disease classes our AI model can identify. 
          This information is for educational purposes only and should not replace professional medical advice.
        </p>
      </div>

      <div className="grid gap-4">
        {diseases.map((disease, index) => (
          <motion.div
            key={disease.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <button
              onClick={() => setExpandedDisease(
                expandedDisease === disease.name ? null : disease.name
              )}
              className="w-full p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    disease.name === 'Normal' 
                      ? 'bg-green-100' 
                      : disease.name.includes('Cancer')
                        ? 'bg-red-100'
                        : 'bg-blue-100'
                  }`}>
                    <Info className={`h-6 w-6 ${
                      disease.name === 'Normal' 
                        ? 'text-green-600' 
                        : disease.name.includes('Cancer')
                          ? 'text-red-600'
                          : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{disease.name}</h3>
                    <p className="text-gray-600">{disease.description}</p>
                  </div>
                </div>
                {expandedDisease === disease.name ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {expandedDisease === disease.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-100"
                >
                  <div className="p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          Common Symptoms
                        </h4>
                        <ul className="space-y-2">
                          {disease.symptoms.map((symptom, symptomIndex) => (
                            <li key={symptomIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Treatment Approach
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {disease.treatment}
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Disclaimer:</strong> This information is for educational purposes only. 
                        Always consult with healthcare professionals for accurate diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DiseaseInfo;