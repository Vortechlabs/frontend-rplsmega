import React from 'react';

const steps = [
  { number: 1, label: 'Basic Information' },
  { number: 2, label: 'Class & Photo' },
  { number: 3, label: 'Password' }
];

const ProfileStepper = ({ step, setStep }) => {
  return (
    <div className="space-y-4">
      {steps.map((item) => (
        <div
          key={item.number}
          className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
            step === item.number 
              ? 'bg-OxfordBlue text-white shadow-md' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setStep(item.number)}
        >
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step === item.number 
              ? 'bg-white text-OxfordBlue' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {item.number}
          </div>
          <span className="font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ProfileStepper;