import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../../../services/GlobalApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../../components/Sidebar';
import { FiEdit2, FiUpload, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiCheck, FiX } from 'react-icons/fi';
import { FaYoutube, FaGithub, FaImage, FaCode } from 'react-icons/fa';
import { MdCategory, MdGroup } from 'react-icons/md';
import Loader from '../../../../components/Loader';

function AdminEditProject() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    teamMembers: [{ memberName: '', class: '', position: '' }]
  });

  // Step 1: Fetch project data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const projectResponse = await apiClient.get(`/projects/${slug}`);
        const projectData = projectResponse.data;
        
        const categoriesResponse = await apiClient.get('/categories');
        
        setProject(projectData);
        setCategories(categoriesResponse.data);
        
      const projectTechs = projectData.technology ? projectData.technology.split(',').map(t => t.trim()) : [];
      setTechnologies(projectTechs);
        
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
          teamMembers: projectData.team?.length > 0 ? projectData.team : [{ memberName: '', class: '', position: '' }]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal untuk memuat data proyek', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [slug]);

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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 2048 * 1024; 
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} terlalu besar. Maksimal ukuran gambar 2MB.`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return false;
      }
      return true;
    });

    if (formData.existingImages.length - formData.imagesToDelete.length + formData.images.length + validFiles.length > 2) {
      toast.error('Kamu hanya bisa mengunggah maksimal 2 gambar.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
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

  const isValidYouTubeUrl = (url) => {
    if (!url) return false;
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
    if (!videoId) return <p className="text-red-500 flex items-center"><FiX className="mr-1" /> Invalid YouTube URL</p>;

    return (
      <div className="mt-4">
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-md"
        ></iframe>
      </div>
    );
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      if (!formData.title || !formData.description || !formData.videoUrl || !formData.technology || !formData.categoryId) {
        toast.error('Tolong isi semua kolom input.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      if (!isValidYouTubeUrl(formData.videoUrl)) {
        toast.error('Tolong masukan tautan Youtube yang valid.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    } else if (activeStep === 1) {
      const totalImages = (formData.existingImages.length - formData.imagesToDelete.length) + formData.images.length;
      if (totalImages < 1) {
        toast.error('Proyek harus memiliki setidaknya 1 gambar. Mohon pertahankan gambar sebelumnya atau gunakan gambar baru.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
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
          formData.existingImageNames[index] || image.name_image || '');
      });

      formData.images.forEach((image, index) => {
        formDataToSend.append('images[]', image);
        formDataToSend.append('name_images[]', 
          formData.imageNames[index] || image.name.split('.')[0]);
      });

      const remainingExisting = formData.existingImages.filter(
        img => !formData.imagesToDelete.includes(img.id)
      ).length;
      const totalImages = remainingExisting + formData.images.length;
      
      if (totalImages < 1) {
        toast.error('Proyek harus memiliki setidaknya 1 gambar. Mohon pertahankan gambar sebelumnya atau gunakan gambar baru.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      formData.teamMembers.forEach((member, index) => {
        formDataToSend.append(`teamMembers[${index}][memberName]`, member.memberName);
        formDataToSend.append(`teamMembers[${index}][class]`, member.class);
        formDataToSend.append(`teamMembers[${index}][position]`, member.position);
        
        if (member.id) {
          formDataToSend.append(`teamMembers[${index}][id]`, member.id);
        }
      });

      const toastId = toast.loading("Mengupdate proyek...", {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });

      const response = await apiClient.post(`/admin/projects/${slug}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.update(toastId, {
        render: "Proyek berhasil diperbarui!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate('/admin/manage-projects');
      }, 3000); 
      
    } catch (error) {
      console.error('Error updating project:', error);
      
      toast.dismiss();
      
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach(msg => {
          toast.error(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
      } else {
        toast.error(error.response?.data?.message || 'Failed to update project', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      label: 'Detail Proyek',
      icon: <FiEdit2 className="mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiEdit2 className="mr-2" /> Judul <span className='text-red-700'>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Project title"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiEdit2 className="mr-2" /> Deskripsi <span className='text-red-700'>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-32"
              required
              placeholder="Detailed project description"
            />
          </div>

          <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
          <div className="bg-gray-50 p-4 rounded-lg ">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <MdCategory className="mr-2" /> Kategori <span className='text-red-700'>*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaGithub className="mr-2" /> Tautan Repositori <span className='text-red-700'>*</span>
            </label>
            <input
              type="url"
              name="repository"
              value={formData.repository}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FaYoutube className="mr-2" /> Tautan Video Demo  <span className='text-red-700'>*</span>
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl) && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <FiX className="mr-1" /> Tolong masukan tautan Youtube yang valid
              </p>
            )}
            {formData.videoUrl && isValidYouTubeUrl(formData.videoUrl) && (
              <YouTubePreview videoUrl={formData.videoUrl} />
            )}
          </div>
        </div>
      )
    },
    {
      label: 'Project Images',
      icon: <FaImage className="mr-2" />,
      content: (
        <div className="space-y-6">
          {/* Existing Images */}
          {formData.existingImages.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <FaImage className="mr-2" /> Slot gambar tersisa ({
                  formData.existingImages.filter(img => 
                    !formData.imagesToDelete.includes(img.id)
                  ).length
                } lagi)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.existingImages
                  .filter(img => !formData.imagesToDelete.includes(img.id))
                  .map((image, index) => (
                    <div key={image.id} className="border rounded-lg p-3 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative pb-3/4 h-40">
                        <img
                          src={`http://127.0.0.1:8000/storage/${image.projectImage}`}
                          alt={`Existing ${index}`}
                          className="absolute w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                      </div>
                      <div className="mt-3">
                        <input
                          type="text"
                          value={formData.existingImageNames[formData.existingImages.findIndex(img => img.id === image.id)] || ''}
                          onChange={(e) => handleExistingImageNameChange(
                            formData.existingImages.findIndex(img => img.id === image.id), 
                            e.target.value
                          )}
                          placeholder="Nama gambar"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-OxfordBlue focus:border-OxfordBlue"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(
                          formData.existingImages.findIndex(img => img.id === image.id)
                        )}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="Hapus gambar"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
    
          {/* New Images Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FiUpload className="mr-2" /> 
              {formData.existingImages.length > 0 ? 'Upload Additional Images' : 'Upload Project Images'}
              <span className="ml-auto text-xs text-gray-500">Max 2 total, 2MB each</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-OxfordBlue hover:text-OxfordBlue-Dark focus-within:outline-none"
                  >
                    <span>Unggah file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">atau seret dan masukkan</p>
                </div>
                <p className="text-xs text-gray-500">
                  {formData.existingImages.length > 0 
                    ? `Kamu bisa mengunggah ${2 - (formData.existingImages.length - formData.imagesToDelete.length + formData.images.length)} gambar lagi.`
                    : 'At least one image is required.'}
                </p>
              </div>
            </div>
          </div>
    
          {/* Preview of new images */}
          {formData.images.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <FiPlus className="mr-2" /> New Images to Upload ({formData.images.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative pb-3/4 h-40">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index}`}
                        className="absolute w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="mt-3">
                      <input
                        type="text"
                        value={formData.imageNames[index] || ''}
                        onChange={(e) => handleNewImageNameChange(index, e.target.value)}
                        placeholder={image.name.split('.')[0]}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-OxfordBlue focus:border-OxfordBlue"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
    
          {/* Empty state */}
          {formData.existingImages.length === 0 && formData.images.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50">
              <FaImage className="text-gray-400 text-4xl mb-3" />
              <p className="text-gray-500 text-center">
                {formData.existingImages.length > 0
                  ? 'No new images selected'
                  : 'No images uploaded yet. Please upload at least one image.'}
              </p>
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Anggota Grup',
      icon: <MdGroup className="mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center">
              <MdGroup className="mr-2" /> Anggota Grup
            </label>
            
            {formData.teamMembers.map((member, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end mb-4 last:mb-0">
                <div className="col-span-5">
                  <label className="block text-xs text-gray-500 mb-1">Nama</label>
                  <input
                    type="text"
                    name="memberName"
                    value={member.memberName}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Nama Anggota"
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">Kelas</label>
                  <select
                    name="class"
                    value={member.class}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                  <label className="block text-xs text-gray-500 mb-1">Posisi</label>
                  <input
                    type="text"
                    name="position"
                    value={member.position}
                    onChange={(e) => handleTeamMemberChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Posisi"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeTeamMember(index)}
                    className="w-full h-10 hover:scale-105 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-transform"
                    title="Hapus anggota"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addTeamMember}
              className="mt-4 px-4 py-2 hover:scale-105 bg-OxfordBlue text-white rounded-md hover:bg-OxfordBlue-Dark transition-transform flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Tambah anggota
            </button>
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

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl flex items-center">
          <FiX className="mr-2" /> Proyek tidak ditemukan
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className="flex-1 md:ml-[290px]">
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 *:after:content-['/'] *:after:ml-1 mb-6">
            <Link to="/admin" className="hover:text-OxfordBlue">Dashboard</Link>
            <Link to="/admin/manage-projects" className="hover:text-OxfordBlue">Kelola proyek</Link>
            <span className="font-semibold text-OxfordBlue">edit : {project.title}</span>
          </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">Edit proyek <br />
                <span className='text-OxfordBlue'>{project.title}</span>
                </h1>
            </div>

            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              {/* Stepper */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${activeStep >= index ? 'bg-OxfordBlue text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}
                      >
                        {activeStep > index ? (
                          <FiCheck size={20} />
                        ) : (
                          <span className="font-medium">{index + 1}</span>
                        )}
                      </div>
                      <span className={`mt-2 text-xs font-medium ${activeStep >= index ? 'text-OxfordBlue' : 'text-gray-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form content */}
              <div className="p-6">
                {steps[activeStep].content}
              </div>

              {/* Navigation buttons */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeStep === 0}
                  className={`px-4 py-2 hover:scale-105 rounded-md flex items-center ${activeStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white transition-transform'}`}
                >
                  <FiChevronLeft className="mr-1" /> Sebelumnya
                </button>

                {activeStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 hover:scale-105 bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white rounded-md flex items-center transition-transform"
                  >
                    Lanjut <FiChevronRight className="ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 hover:scale-105 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center transition-transform disabled:bg-green-300"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memperbarui...
                      </>
                    ) : (
                      <>
                        <FiCheck className="mr-1" /> Perbarui Proyek
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminEditProject;