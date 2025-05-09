import { useState } from 'react';
import { FaBolt, FaTimes } from 'react-icons/fa';

const TechnologyInput = ({ technology, setTechnology }) => {
  const [techInput, setTechInput] = useState('');

  const handleTechInput = (e) => {
    const value = e.target.value;
    
    if (value.includes(',')) {
      const newTechs = value.split(',')
        .map(tech => tech.trim())
        .filter(tech => tech !== '');
      
      setTechnology(prev => [...new Set([...prev, ...newTechs])]);
      setTechInput('');
    } else {
      setTechInput(value);
    }
  };

  const removeTech = (indexToRemove) => {
    setTechnology(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Technology <span className="text-red-500">*</span>
      </label>

      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={techInput}
          onChange={handleTechInput}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
          placeholder="React, Node.js, MongoDB"
          required
          onKeyDown={(e) => {
            if (e.key === 'Enter' && techInput.trim()) {
              e.preventDefault();
              setTechnology(prev => [...prev, techInput.trim()]);
              setTechInput('');
            }
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FaBolt className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Badge teknologi */}
      <div className="flex flex-wrap gap-2 mt-2">
        {technology.map((tech, index) => (
          <span 
            key={index}
            className="px-3 py-1 text-xs bg-OxfordBlue/10 text-OxfordBlue rounded-full 
                      flex items-center gap-2"
          >
            {tech}
            <button 
              type="button" 
              onClick={() => removeTech(index)}
              className="hover:text-OxfordBlue-Dark"
            >
              <FaTimes className="text-xs" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TechnologyInput;