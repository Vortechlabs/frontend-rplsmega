import React, { useEffect, useState } from 'react';
import YouTubePreview from './YouTubePreview';
import { 
  FaEdit, 
  FaSearch, 
  FaCheck, 
  FaTimes, 
  FaLink,
  FaVideo,
  FaGithub,
  FaCode
} from 'react-icons/fa';

const ProjectDetailsStep = ({ formData, setFormData, categories }) => {
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState('');

  const isValidYouTubeUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleTechInputChange = (e) => {
    const value = e.target.value;
    setTechInput(value);
    
    if (value.endsWith(',')) {
      const tech = value.slice(0, -1).trim();
      if (tech && !technologies.includes(tech)) {
        const newTechs = [...technologies, tech];
        setTechnologies(newTechs);
        setFormData(prev => ({
          ...prev,
          technology: newTechs.join(', ')
        }));
        setTechInput('');
      }
    }
  };

  const removeTech = (index) => {
    const newTechs = [...technologies];
    newTechs.splice(index, 1);
    setTechnologies(newTechs);
    setFormData(prev => ({
      ...prev,
      technology: newTechs.join(', ')
    }));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      if (!technologies.includes(techInput.trim())) {
        const newTechs = [...technologies, techInput.trim()];
        setTechnologies(newTechs);
        setFormData(prev => ({
          ...prev,
          technology: newTechs.join(', ')
        }));
        setTechInput('');
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  useEffect(() => {
    if (formData.technology) {
      const techs = formData.technology.split(',').map(t => t.trim()).filter(t => t);
      setTechnologies(techs);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Project Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Proyek <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
              placeholder="Proyek ajaib saya berbasis..."
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaEdit className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Jelajahi kategori..."
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            
            {showCategoryDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`cursor-pointer hover:bg-blue-50 px-4 py-2 flex items-center ${
                        formData.categoryId === category.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, categoryId: category.id }));
                        setCategorySearch(category.name);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <span className="flex-grow">{category.name}</span>
                      {formData.categoryId === category.id && (
                        <FaCheck className="h-5 w-5 text-OxfordBlue" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">Tidak ada kategori</div>
                )}
              </div>
            )}
          </div>
          
          {formData.categoryId && (
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-OxfordBlue/10 text-OxfordBlue">
                {categories.find(c => c.id === formData.categoryId)?.name}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, categoryId: '' }));
                  setCategorySearch('');
                }}
                className="ml-2 text-OxfordBlue hover:text-OxfordBlue-Dark"
              >
                <FaTimes className="text-xs" />
              </button>
              </span>
            </div>
          )}
        </div>

        {/* Technology */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teknologi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              name="technology"
              value={techInput}
              onChange={handleTechInputChange}
              onKeyDown={handleTechKeyDown}

              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
              placeholder="React, Node.js, MongoDB"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaCode className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Badge teknologi */}
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies.map((tech, index) => (
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
          
          {/* Input tersembunyi untuk menyimpan data teknologi sebagai string */}
          <input
            type="hidden"
            name="technology"
            value={formData.technology}
          />

        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all min-h-[200px]"
          placeholder="Deskripsikan tentang proyek kamu, untuk apa, dan kenapa kamu membangun proyek ini..."
          maxLength={1000}
          required
        />
        <div className={`text-right text-xs mt-1 ${formData.description.length >= 950 ? 'text-red-500' : 'text-gray-500'}`}>
          {formData.description.length}/1000 karakter
        </div>
      </div>

      {/* Repository URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tautan Repository <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="url"
            name="repository"
            value={formData.repository}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
            placeholder="https://github.com/username/project"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaGithub className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Video URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tautan Video Demo <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="url"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <FaVideo className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
          <p className="mt-1 text-sm text-red-600">
            Tolong masukan tautan YouTube yang valid.
          </p>
        )}
        {formData.videoUrl && isValidYouTubeUrl(formData.videoUrl) && (
          <YouTubePreview videoUrl={formData.videoUrl} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsStep;