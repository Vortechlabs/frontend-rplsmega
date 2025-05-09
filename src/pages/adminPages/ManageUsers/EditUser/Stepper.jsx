import React from 'react';
import { FaIdBadge, FaUserGraduate, FaLock } from 'react-icons/fa';

const Stepper = ({ steps, currentStep, setStep }) => {
  const icons = {
    1: <FaIdBadge className="text-lg" />,
    2: <FaUserGraduate className="text-lg" />,
    3: <FaLock className="text-lg" />
  };

  return (
    <div className="space-y-3">
      {steps.map((s) => (
        <div
          key={s.number}
          className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            currentStep === s.number 
              ? 'bg-indigo-50 border border-indigo-100 text-OxfordBlue-Dark shadow-sm' 
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
          }`}
          onClick={() => setStep(s.number)}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep === s.number 
              ? 'bg-OxfordBlue text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {icons[s.number]}
          </div>
          <span className="font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;