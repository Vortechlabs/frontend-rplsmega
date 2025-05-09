import React, { useState, useEffect } from 'react';
import apiClient from '../../../../services/GlobalApi';
import Swal from 'sweetalert2';
import Navbar from '../../../../components/Navbar';
import { useAuth } from '../../../../auth/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../../../../components/Footer';
import ProjectDetailsStep from './ProjectDetailsStep';
import ProjectImagesStep from './ProjectImagesStep';
import TeamMembersStep from './TeamMembersStep';
import { 
  FaArrowLeft, 
  FaArrowRight, 
  FaCloudUploadAlt,
  FaSpinner,
  FaCheckCircle,
  FaUsers,
  FaImages,
  FaClipboardList
} from 'react-icons/fa';
import { GiProgression } from 'react-icons/gi';

const UploadProject = () => {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  // Step handlers
  const handleNextStep = () => {
    // Validation for current step
    if (activeStep === 0) {
      if (!formData.title || !formData.description || !formData.videoUrl || !formData.technology || !formData.categoryId) {
        Swal.fire('Gagal', 'Tolong isi semua kolom input.', 'error');
        return;
      }
    } else if (activeStep === 1) {
      if (images.length === 0) {
        Swal.fire('Gagal', 'Tolong unggah minimal 1 gambar.', 'error');
        return;
      }
      
      const hasEmptyImageName = imageNames.some(name => !name || name.trim() === '');
      if (hasEmptyImageName) {
        Swal.fire('Gagal', 'Tolong isi semua kolom input nama gambar.', 'error');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Append images and their names
      images.forEach((image, index) => {
        formDataToSend.append('images[]', image);
        if (imageNames[index]) {
          formDataToSend.append(`name_image[${index}]`, imageNames[index]);
        }
      });

      // Include uploader in team if selected
      const membersToInclude = [...teamMembers];
      if (includeUploaderInTeam) {
        membersToInclude.unshift({
          memberName: user.name || user[0]?.name,
          class: user.class || user[0]?.class || 'XII RPL 1',
          position: 'Ketua'
        });
      }

      // Append team members
      membersToInclude.forEach((member, index) => {
        Object.entries(member).forEach(([key, value]) => {
          formDataToSend.append(`teamMembers[${index}][${key}]`, value);
        });
      });

      // Submit to API
      const response = await apiClient.post('/projects', formDataToSend, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Success notification
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Proyek berhasil diunggah!',
        timer: 2000,
        showConfirmButton: false
      });

      navigate('/projects');
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Gagal Mengunggah Proyek'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Steps configuration with React Icons
  const steps = [
    {
      label: 'Detail Proyek',
      icon: <FaClipboardList className="text-xl" />,
      content: (
        <ProjectDetailsStep 
          formData={formData} 
          setFormData={setFormData} 
          categories={categories}
        />
      )
    },
    {
      label: 'Gambar Proyek',
      icon: <FaImages className="text-xl" />,
      content: (
        <ProjectImagesStep 
          images={images} 
          imageNames={imageNames}
          setImages={setImages}
          setImageNames={setImageNames}
        />
      )
    },
    {
      label: 'Anggota Grup',
      icon: <FaUsers className="text-xl" />,
      content: (
        <TeamMembersStep 
          teamMembers={teamMembers}
          setTeamMembers={setTeamMembers}
          includeUploaderInTeam={includeUploaderInTeam}
          setIncludeUploaderInTeam={setIncludeUploaderInTeam}
          user={user}
        />
      )
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Bagikan <span className="text-OxfordBlue">Proyekmu</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Showcase your work and inspire others in the community
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
                    : 'bg-gray-200 hover:bg-gray-300 hover:scale-105 transition-transform text-gray-700 hover:text-OxfordBlue'
                }`}
              >
                <FaArrowLeft className="mr-2" />
                Sebelumnya
              </button>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-OxfordBlue hover:bg-OxfordBlue-Dark hover:scale-105 transition-transform text-white rounded-lg flex items-center hover:shadow-md"
                >
                  Lanjut
                  <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 cursor-pointer bg-gradient-to-r from-GoldenYellow/80 to-GoldenYellow-Dark hover:from-GoldenYellow-Dark hover:to-GoldenYellow/80 text-white rounded-lg flex items-center hover:scale-105 transition-transform hover:shadow-md disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="mr-2" />
                      Kirim Project
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

export default UploadProject;