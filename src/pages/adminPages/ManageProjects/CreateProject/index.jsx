import React, { useState, useEffect } from 'react';
import apiClient from '../../../../services/GlobalApi';
import { useAuth } from '../../../../auth/AuthContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '../../../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiUpload, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiCheck, FiX, FiImage, FiUsers, FiInfo } from 'react-icons/fi';
import { FaYoutube, FaGithub, FaCode, FaTimes } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';

const TambahProject = () => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        repository: '',
        videoUrl: '',
        technology: '',
        categoryId: ''
    });
    const [images, setImages] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [teamMembers, setTeamMembers] = useState([{ memberName: '', class: '', position: '' }]);
    const [includeUploaderInTeam, setIncludeUploaderInTeam] = useState(true);
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState([]);
      const [technologies, setTechnologies] = useState([]);
      const [techInput, setTechInput] = useState('');
    const [categorySearch, setCategorySearch] = useState('');
    const navigate = useNavigate();
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        };
        fetchCategories();
    }, []);

    if (!user) {
        return <Navigate to="/auth/login" />;
    }

    const extractYouTubeVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const isValidYouTubeUrl = (url) => {
        return extractYouTubeVideoId(url) !== null;
    };

    const YouTubePreview = ({ videoUrl }) => {
        const videoId = extractYouTubeVideoId(videoUrl);
        if (!videoId) return (
            <div className="flex items-center text-red-500 mt-2">
                <FiX className="mr-1" /> Tautan Youtube tidak valid
            </div>
        );

        return (
            <div className="mt-4 rounded-lg overflow-hidden shadow-md">
                <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                ></iframe>
            </div>
        );
    };

    const generateSlug = async (title) => {
        const baseSlug = title.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .trim();
        
        let slug = baseSlug;
        let count = 1;

        while (await checkSlugExists(slug)) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        return slug;
    };

    const checkSlugExists = async (slug) => {
        try {
            const response = await apiClient.get(`/projects/slug-exists?slug=${slug}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking slug existence:', error);
            return false;
        }
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

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'title') {
            const slug = await generateSlug(value);
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
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

        if (images.length + validFiles.length > 2) {
            toast.error('YKamu hanya bisa mengunggah 2 gambar.', {
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

        setImages(prev => [...prev, ...validFiles]);
        setImageNames(prev => [...prev, ...Array(validFiles.length).fill('')]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImageNames(prev => prev.filter((_, i) => i !== index));
    };

    const handleTeamMemberChange = (index, field, value) => {
        const newMembers = [...teamMembers];
        newMembers[index][field] = value;
        setTeamMembers(newMembers);
    };

    const handleAddTeamMember = () => {
        setTeamMembers([...teamMembers, { memberName: '', class: '', position: '' }]);
    };

    const handleRemoveTeamMember = (index) => {
        setTeamMembers(prev => prev.filter((_, i) => i !== index));
    };
    
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    const handleNextStep = () => {
        if (activeStep === 0) {
            if (!formData.title || !formData.description || !formData.videoUrl || !formData.technology || !formData.categoryId) {
                toast.error('Mohon isi semua kolom input.', {
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
                toast.error('Mohon masukkan tautan Youtube yang valid.', {
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
            if (images.length === 0) {
                toast.error('Mohon unggah setidaknya 1 gambar.', {
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
        
    const hasEmptyTeamMemberFields = teamMembers.some(member => 
        !member.memberName || !member.class || !member.position
    );
    
    if (hasEmptyTeamMemberFields) {
        toast.error('Harap isi semua field untuk anggota tim', {
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

    if (teamMembers.length === 0) {
        toast.error('Harap tambahkan setidaknya satu anggota tim', {
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

        setIsSubmitting(true);

        const toastId = toast.loading("Mengunggah proyek...", {
            position: "top-right",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });

            images.forEach((image, index) => {
                formDataToSend.append('images[]', image);
                formDataToSend.append(`name_image[${index}]`, imageNames[index] || `image-${index}`);
            });

            const membersToInclude = [...teamMembers];

            membersToInclude.forEach((member, index) => {
                Object.entries(member).forEach(([key, value]) => {
                    formDataToSend.append(`teamMembers[${index}][${key}]`, value);
                });
            });

            await apiClient.post('/projects', formDataToSend, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.update(toastId, {
                render: "Proyek berhasil diunggah!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                draggable: true,
                onClose: () => {
                    setFormData({
                        title: '',
                        slug: '',
                        description: '',
                        repository: '',
                        videoUrl: '',
                        technology: '',
                        categoryId: ''
                    });
                    setImages([]);
                    setImageNames([]);
                    setTeamMembers([{ memberName: '', class: '', position: '' }]);
                    setActiveStep(0);        
                    setTimeout(() => {
                        navigate('/admin/manage-projects');
                    });
                }
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast.update(toastId, {
                render: error.response?.data?.message || 'Failed to upload project',
                type: "error",
                isLoading: false,
                autoClose: 5000,
                closeOnClick: true,
                draggable: true,
            });
            
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors).flat().forEach(msg => {
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
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        {
            label: 'Project Details',
            icon: <FiInfo className="mr-2" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className="\ text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiInfo className="mr-2" /> Judul  <span className='text-red-700'>*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="Judul proyek"
                        />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FiInfo className="mr-2" /> Deskripsi  <span className='text-red-700'>*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-32"
                            maxLength={1000}
                            required
                            placeholder="Detailed project description"
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                            {formData.description.length}/1000 karakter
                        </div>
                    </div>

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                                <MdCategory className="mr-2" /> Kategori  <span className='text-red-700'>*</span>
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type="text"
                                    placeholder="Jelajahi kategori..."
                                    value={categorySearch}
                                    onChange={(e) => {
                                        setCategorySearch(e.target.value);
                                        setShowCategoryDropdown(true);
                                    }}
                                    onFocus={() => setShowCategoryDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 200)}
                                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                
                                {showCategoryDropdown && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    {filteredCategories.length > 0 ? (
                                    filteredCategories.map((category) => (
                                        <div
                                        key={category.id}
                                        className={`cursor-pointer hover:bg-gray-100 px-4 py-2 ${
                                            formData.categoryId === category.id ? 'bg-gray-100' : ''
                                        }`}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, categoryId: category.id }));
                                            setCategorySearch(category.name);
                                            setShowCategoryDropdown(false);
                                        }}
                                        >
                                        {category.name}
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
                                <span className="text-sm text-gray-700">
                                    Dipilih: {categories.find(c => c.id === formData.categoryId)?.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                    setFormData(prev => ({ ...prev, categoryId: '' }));
                                    setCategorySearch('');
                                    }}
                                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                                >
                                    ×
                                </button>
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

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <FaGithub className="mr-2" /> Tautan repositori  <span className='text-red-700'>*</span>
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
                            <FaYoutube className="mr-2" /> Tautan video demo <span className='text-red-700'>*</span>
                        </label>
                        <input
                            type="url"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleInputChange}
                            className="mt-1 block w-full  px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://www.youtube.com/watch?v=..."
                            required
                        />
                        <div className='w-xl'>
                        {formData.videoUrl && <YouTubePreview videoUrl={formData.videoUrl} />}
                        </div>
                    </div>
                </div>
            )
        },
        {
            label: 'Gambar proyek',
            icon: <FiImage className="mr-2" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <FiUpload className="mr-2" /> Unggah Gambar  <span className='text-red-700'>*</span>
                            <span className="ml-auto text-xs text-gray-500">Max 2 images, 2MB each</span>
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-OxfordBlue hover:text-blue-500 focus-within:outline-none"
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
                                    {images.length > 0 
                                        ? `Kamu bisa mengunggah ${2 - images.length} gambar lagi.`
                                        : 'At least one image is required.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {images.length > 0 ? (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <FiImage className="mr-2" /> Gambar untuk di unggah ({images.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="border rounded-lg p-3 relative bg-white shadow-sm hover:shadow-md transition-shadow">
                                        <div className="relative pb-3/4 h-40">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`Preview ${index}`}
                                                className="absolute w-full h-full object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="mt-3">
                                            <input
                                                type="text"
                                                value={imageNames[index] || ''}
                                                onChange={(e) => {
                                                    const newNames = [...imageNames];
                                                    newNames[index] = e.target.value;
                                                    setImageNames(newNames);
                                                }}
                                                placeholder={image.name.split('.')[0]}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                            title="Hapus gambar"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg bg-gray-50">
                            <FiImage className="text-gray-400 text-4xl mb-3" />
                            <p className="text-gray-500 text-center">
                                Tidak ada gambar di upload. Mohon unggah setidaknya 1 gambar.
                            </p>
                        </div>
                    )}
                </div>
            )
        },
        {
            label: 'Anggota Grup',
            icon: <FiUsers className="mr-2" />,
            content: (
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <label className=" text-sm font-medium text-gray-700 mb-3 flex items-center">
                            <FiUsers className="mr-2" /> Anggota grup  <span className='text-red-700'>*</span>
                        </label>
                        
                        {teamMembers.map((member, index) => (
                            <div key={index} className="grid grid-cols-12 gap-3 items-end mb-4 last:mb-0">
                                <div className="col-span-5">
                                    <label className="block text-xs text-gray-500 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        value={member.memberName}
                                        onChange={(e) => handleTeamMemberChange(index, 'memberName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Member name"
                                        required
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-xs text-gray-500 mb-1">Kelas</label>
                                    <select
                                        value={member.class}
                                        onChange={(e) => handleTeamMemberChange(index, 'class', e.target.value)}
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
                                        value={member.position}
                                        onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="Posisi"
                                        required
                                    />
                                </div>
                                <div className="col-span-1">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTeamMember(index)}
                                        className="w-10 h-10 hover:scale-105 flex items-center justify-center bg-red-500 text-white rounded-md hover:bg-red-600 transition-transform"
                                        title="Hapus anggota"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={handleAddTeamMember}
                            className="mt-4 px-4 py-2 hover:scale-105 transition-transform bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white rounded-md hover:bg-OxfordBlue-D  flex items-center justify-center"
                        >
                            <FiPlus className="mr-2" /> Tambah Anggota
                        </button>
                    </div>

                </div>
            )
        }
    ];

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
                        <Link to="/admin/manage-projects" className="hover:text-OxfordBlue">Kelola Proyek</Link>
                        <span className="font-semibold text-OxfordBlue">Unggah proyek</span>
                    </div>

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900">Unggah proyek kamu</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Bagikan karya cemerlangmu di RPL SMEGA
                            </p>
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
                            <div className="p-6 max-w-screen">
                                <div className="mb-4 flex items-center">
                                    {steps[activeStep].icon}
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        {steps[activeStep].label}
                                    </h2>
                                </div>
                                {steps[activeStep].content}
                            </div>

                            {/* Navigation buttons */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
                                <button
                                    type="button"
                                    onClick={handlePrevStep}
                                    disabled={activeStep === 0}
                                    className={`px-4 py-2 hover:scale-105  rounded-md flex items-center ${activeStep === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-500 hover:bg-gray-600 text-white transition-transform'}`}
                                >
                                    <FiChevronLeft className="mr-1" /> Sebelumnya
                                </button>

                                {activeStep < steps.length - 1 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="px-4 py-2 hover:scale-105 bg-OxfordBlue hover:bg-OxfordBlue-D text-white rounded-md flex items-center transition-transform"
                                    >
                                        Lanjut <FiChevronRight className="ml-1" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center transition-transform hover:scale-105 disabled:bg-green-300"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <FiCheck className="mr-1" /> Kirim Proyek
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
};

export default TambahProject;