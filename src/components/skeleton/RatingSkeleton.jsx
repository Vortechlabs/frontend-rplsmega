// RatingSkeleton.js
import React from 'react';

const RatingSkeleton = () => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex space-x-1 mb-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default RatingSkeleton;