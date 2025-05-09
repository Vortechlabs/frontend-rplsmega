import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import apiClient from '../../../../services/GlobalApi';
import Swal from 'sweetalert2';
import Navbar from '../../../../components/Navbar';
import { useAuth } from '../../../../auth/AuthContext';
import Footer from '../../../../components/Footer';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaUsers,
  FaImages,
  FaClipboardList,
  FaEdit,
  FaTrash,
  FaYoutube,
  FaGithub,
  FaSearch,
  FaPlus,
  FaCode
} from 'react-icons/fa';
import { FiUpload, FiX } from 'react-icons/fi';
import Loader from '../../../../components/Loader';

const UpdateProject = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    repository: '',
    videoUrl: '',
    technology: '',
    categoryId: '',
    images: [],
    imageNames: [],
    existingImages: [],
    existingImageNames: [],
    imagesToDelete: [],
    teamMembers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectResponse = await apiClient.get(`/projects/${slug}`);
        const projectData = projectResponse.data;
        
        const categoriesResponse = await apiClient.get('/categories');
        
        setCategories(categoriesResponse.data);
        
        setFormData({
          title: projectData.title,
          description: projectData.description,
          repository: projectData.repository,
          videoUrl: projectData.videoUrl,
          technology: projectData.technology,
          categoryId: projectData.categoryId,
          images: [],
          imageNames: [],
          existingImages: projectData.project_image || [],
          existingImageNames: projectData.project_image?.map(img => img.name_image) || [],
          imagesToDelete: [],
          teamMembers: projectData.team?.length > 0 ? projectData.team : []
        });

      if (projectData.technology) {
        const techs = projectData.technology.split(',').map(t => t.trim()).filter(t => t);
        setTechnologies(techs);
      }

        // Set initial category search value
        const selectedCategory = categoriesResponse.data.find(c => c.id === projectData.categoryId);
        if (selectedCategory) {
          setCategorySearch(selectedCategory.name);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to load project data', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [slug]);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const isValidYouTubeUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11;
  };

  const extractYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const YouTubePreview = ({ videoUrl }) => {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) return <p className="text-red-500">Tautan Youtube tidak valid</p>;

    return (
      <div className="mt-4 rounded-xl overflow-hidden shadow-md">
        <div className="aspect-w-16 aspect-h-9 w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-64 rounded-lg"
          ></iframe>
        </div>
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
  
  const removeTech = (index) => {
    const newTechs = [...technologies];
    newTechs.splice(index, 1);
    setTechnologies(newTechs);
    setFormData(prev => ({
      ...prev,
      technology: newTechs.join(', ')
    }));
  };

  const handleCategorySelect = (category) => {
    setFormData(prev => ({ ...prev, categoryId: category.id }));
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const handleClearCategory = () => {
    setFormData(prev => ({ ...prev, categoryId: '' }));
    setCategorySearch('');
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 2048 * 1024; // 2MB
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        Swal.fire('Gagal', `${file.name} terlalu besar. Maksimal ukuran 2MB.`, 'error');
        return false;
      }
      return true;
    });

    if (formData.existingImages.length - formData.imagesToDelete.length + formData.images.length + validFiles.length > 2) {
      Swal.fire('Error', 'Kamu hanya bisa mengunggah maksimal 2 gambar.', 'error');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles],
      imageNames: [...prev.imageNames, ...validFiles.map(file => file.name.split('.')[0])]
    }));
  };

  const handleExistingImageNameChange = (index, value) => {
    const updatedNames = [...formData.existingImageNames];
    updatedNames[index] = value;
    setFormData(prev => ({ ...prev, existingImageNames: updatedNames }));
  };
  
  const handleNewImageNameChange = (index, value) => {
    const updatedNames = [...formData.imageNames];
    updatedNames[index] = value;
    setFormData(prev => ({ ...prev, imageNames: updatedNames }));
  };

  const handleTeamMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTeamMembers = [...formData.teamMembers];
    updatedTeamMembers[index][name] = value;
    setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { memberName: '', class: '', position: '' }]
    }));
  };

  const removeTeamMember = (index) => {
    const updatedTeamMembers = formData.teamMembers.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, teamMembers: updatedTeamMembers }));
  };

  const removeExistingImage = (index) => {
    const imageToDelete = formData.existingImages[index];
    setFormData(prev => ({
      ...prev,
      imagesToDelete: [...prev.imagesToDelete, imageToDelete.id]
    }));
  };

  const removeNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageNames: prev.imageNames.filter((_, i) => i !== index)
    }));
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (!formData.title || !formData.description || !formData.videoUrl || !formData.technology || !formData.categoryId) {
        Swal.fire('Gagal', 'Tolong isi semua kolom input.', 'error');
        return;
      }
      if (!isValidYouTubeUrl(formData.videoUrl)) {
        Swal.fire('Gagal', 'Tolong masukan tautan Youtube yang valid.', 'error');
        return;
      }
    } else if (activeStep === 1) {
      const totalImages = (formData.existingImages.length - formData.imagesToDelete.length) + formData.images.length;
      if (totalImages < 1) {
        Swal.fire('Gagal', 'Proyek harus punya setidaknya 1 gambar.', 'error');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('_method', 'PUT');
      
      // Add basic project info
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('repository', formData.repository);
      formDataToSend.append('videoUrl', formData.videoUrl);
      formDataToSend.append('technology', formData.technology);
      formDataToSend.append('categoryId', formData.categoryId);

      formData.imagesToDelete.forEach(id => {
        formDataToSend.append('images_to_delete[]', id);
      });

      formData.existingImages.forEach((image, index) => {
        formDataToSend.append(`existing_images[${index}][id]`, image.id);
        formDataToSend.append(`existing_images[${index}][name_image]`, 
          formData.existingImageNames[formData.existingImages.findIndex(img => img.id === image.id)] || image.name_image || '');
      });

      formData.images.forEach((image, index) => {
        formDataToSend.append('images[]', image);
        formDataToSend.append('name_images[]', 
          formData.imageNames[index] || image.name.split('.')[0]);
      });

      formData.teamMembers.forEach((member, index) => {
        formDataToSend.append(`teamMembers[${index}][memberName]`, member.memberName);
        formDataToSend.append(`teamMembers[${index}][class]`, member.class);
        formDataToSend.append(`teamMembers[${index}][position]`, member.position);
        
        if (member.id) {
          formDataToSend.append(`teamMembers[${index}][id]`, member.id);
        }
      });

      Swal.fire({
        title: 'Updating Project',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await apiClient.post(`/projects/${slug}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'edit proyek berhasil',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate(`/project/${slug}`);
      });
    } catch (error) {
      console.error('Error updating project:', error);
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        Swal.fire('Validation Error', errorMessages, 'error');
      } else {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update project', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      label: 'Project Details',
      icon: <FaClipboardList className="text-xl" />,
      content: (
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
                  placeholder="My Awesome Project"
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
                          onClick={() => handleCategorySelect(category)}
                        >
                          <span className="flex-grow">{category.name}</span>
                          {formData.categoryId === category.id && (
                            <FaCheck className="h-5 w-5 text-OxfordBlue" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">Tidak ada kategori ditemukan</div>
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
                      onClick={handleClearCategory}
                      className="ml-2 text-OxfordBlue hover:text-OxfordBlue-Dark"
                    >
                      <FiX className="text-xs" />
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
                  value={techInput}
                  onChange={handleTechInputChange}
                  onKeyDown={handleTechKeyDown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all"
                  placeholder="React, Node.js, MongoDB (tekan koma atau enter untuk menambahkan)"
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
                      <FiX className="text-xs" />
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
              name="deskripsi"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all min-h-[200px]"
              placeholder="Deskripsikan sesuatu tentang proyekmu..."
              required
            />
          </div>

          {/* Repository URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tautan Repositori
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
                <FaYoutube className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
              <p className="mt-1 text-sm text-red-600">Tolong masukan tautan Youtube yang valid</p>
            )}
            {formData.videoUrl && isValidYouTubeUrl(formData.videoUrl) && (
              <YouTubePreview videoUrl={formData.videoUrl} />
            )}
          </div>
        </div>
      )
    },
    {
      label: 'Gambar Proyek',
      icon: <FaImages className="text-xl" />,
      content: (
        <div className="space-y-6">
          {/* Existing Images */}
          {formData.existingImages.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Slot gambar tersisa ({
                    formData.existingImages.filter(img => 
                      !formData.imagesToDelete.includes(img.id)
                    ).length
                  } lagi)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.existingImages
                  .filter(img => !formData.imagesToDelete.includes(img.id))
                  .map((image, index) => (
                    <div key={image.id} className="border rounded-lg p-3 relative group bg-white">
                      <div className="relative pb-[75%] overflow-hidden rounded-md">
                        <img
                          src={`http://127.0.0.1:8000/storage/${image.projectImage}`}
                          alt={`Existing ${index}`}
                          className="absolute h-full w-full object-cover"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.existingImageNames[formData.existingImages.findIndex(img => img.id === image.id)] || ''}
                        onChange={(e) => handleExistingImageNameChange(
                          formData.existingImages.findIndex(img => img.id === image.id), 
                          e.target.value
                        )}
                        placeholder="Nama Gambar"
                        className="mt-2 w-full p-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(
                          formData.existingImages.findIndex(img => img.id === image.id)
                        )}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
    
          {/* New Images Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.existingImages.length > 0 ? 'Unggah Gambar Tambahan' : 'Unggah Gambar Proyek'}
              <span className="text-xs text-gray-500 ml-1">(Max 2 total, 2MB each)</span>
            </label>
            
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center py-8 px-2">
                  <FiUpload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-center text-gray-500">
                    <span className="font-semibold">Klik untuk mengunggah</span> atau seret dan masukan
                  </p>
                  <p className="mt-1 text-sm text-gray-500">PNG, JPG ukuran 2MB (max 2 images)</p>
                  <p className="mt-1 text-sm text-gray-500">Resolusi terbaik minimal 1000x700px</p>
                </div>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="sr-only" 
                />
              </label>
            </div>
            
            <p className="mt-2 text-sm text-gray-500">
              {formData.existingImages.length > 0 
                ? `Kamu bisa mengunggah ${2 - (formData.existingImages.length - formData.imagesToDelete.length + formData.images.length)} gambar lagi.`
                : 'At least one image is required.'}
            </p>
          </div>
    
          {/* Preview of new images */}
          {formData.images.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Gambar baru untuk di upload ({formData.images.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3 relative group">
                    <div className="relative pb-[75%] overflow-hidden rounded-md">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index}`}
                        className="absolute h-full w-full object-cover"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.imageNames[index] || ''}
                      onChange={(e) => handleNewImageNameChange(index, e.target.value)}
                      placeholder={image.name.split('.')[0]}
                      className="mt-2 w-full p-2 border border-gray-300 rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Anggota Grup',
      icon: <FaUsers className="text-xl" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Anggota Grup</h3>
              <button
                type="button"
                onClick={addTeamMember}
                className="inline-flex items-center px-3 py-2 bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white text-sm font-medium rounded-md transition-transform hover:scale-105"
              >
                <FaPlus className="mr-1" />
                Tambah Anggota
              </button>
            </div>

            {formData.teamMembers.map((member, index) => (
              <div key={index} className="grid md:grid-cols-12 grid-cols-1 gap-3 items-end bg-gray-50 p-4 rounded-lg">
                <div className="col-span-5">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Nama</label>
                  <input
                    type="text"
                    name="memberName"
                    value={member.memberName}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-OxfordBlue focus:border-OxfordBlue"
                    placeholder="Nama anggota"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Kelas</label>
                  <select
                    name="class"
                    value={member.class}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-OxfordBlue focus:border-OxfordBlue"
                    required
                  >
                    <option value="">Pilih kelas</option>
                    <option value="XI RPL 1">XI RPL 1</option>
                    <option value="XI RPL 2">XI RPL 2</option>
                    <option value="XII RPL 1">XII RPL 1</option>
                    <option value="XII RPL 2">XII RPL 2</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Posisi</label>
                  <input
                    type="text"
                    name="position"
                    value={member.position}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-OxfordBlue focus:border-OxfordBlue"
                    placeholder="Posisi"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="w-full h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md transition-all"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Edit Proyek <br /><span className="text-OxfordBlue">{formData.title}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Edit detail proyekmu dan tunjukan karyamu
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 transition-all hover:shadow-xl">
            {/* Stepper Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-OxfordBlue to-OxfordBlue-Dark">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        activeStep >= index 
                          ? 'bg-white text-OxfordBlue shadow-md transform scale-110' 
                          : 'bg-gray-400 text-white'
                      } group-hover:shadow-lg`}
                    >
                      {step.icon}
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                      activeStep >= index ? 'text-white font-semibold' : 'text-gray-300'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 sm:p-8">
              {steps[activeStep].content}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={activeStep === 0}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg flex items-center transition-all ${
                  activeStep === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-OxfordBlue'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Sebelumnya
              </button>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white rounded-lg flex items-center transition-all hover:shadow-md"
                >
                  Lanjut
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-GoldenYellow/80 to-GoldenYellow-Dark hover:from-GoldenYellow-Dark hover:to-GoldenYellow/80 text-white rounded-lg flex items-center transition-transform hover:scale-105 hover:shadow-md disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Simpan Perubahan
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdateProject;