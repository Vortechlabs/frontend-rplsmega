import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import Stepper from './Stepper';
import BasicInfoStep from './BasicInfoStep';
import ClassPhotoStep from './ClassPhotoStep';
import PasswordStep from './PasswordStep';
import Loader from '../../../../components/Loader';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nis: '',
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user',
    class: '',
    profilePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [step, setStep] = useState(1);

  const steps = [
    { number: 1, label: 'Informasi Dasar' },
    { number: 2, label: 'Kelas & Foto' },
    { number: 3, label: 'Password' },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/users/${id}`);
        setUser(response.data);
        setOriginalUser(response.data);
        setPreview(response.data.profilePicture ? `http://127.0.0.1:8000/storage/${response.data.profilePicture}` : null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Gagal memuat data pengguna. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, profilePicture: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(originalUser?.profilePicture ? 
        `http://127.0.0.1:8000/storage/${originalUser.profilePicture}` : null);
      setUser({ ...user, profilePicture: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.nis || !user.name || !user.email || !user.role) {
      toast.error('NIS, Nama, email, dan role harus diisi!');
      return;
    }

    const formData = new FormData();
    formData.append('nis', user.nis);
    formData.append('name', user.name);
    formData.append('username', user.username);
    formData.append('email', user.email);
    if (user.password) {
      formData.append('password', user.password);
    }
    formData.append('role', user.role);
    formData.append('class', user.class || '');
    formData.append('_method', 'PUT');

    if (user.profilePicture instanceof File) {
      formData.append('profilePicture', user.profilePicture);
    }

    try {
      await apiClient.post(`/admin/user/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Data pengguna berhasil diperbarui!');
      
      setTimeout(() => {
        navigate('/admin/manage-users');
      }, 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      let errorMessage = 'Terjadi kesalahan saat memperbarui data';
      
      if (error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          errorMessage = Object.values(errors).flat().join(', ');
        } else {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!user.nis || !user.name || !user.email || !user.role)) {
      toast.error('Harap lengkapi semua field terlebih dahulu');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 mt-20 md:mt-0 md:ml-[290px] p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 mt-20 md:mt-0 md:ml-64">
        <div className="p-6">
          <ToastContainer />
          
          <div className="max-w-4xl mx-auto min-h-screen bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
            
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 *:after:content-['/'] *:after:ml-1 mb-6">
            <Link to="/admin" className="hover:text-OxfordBlue">Dashboard</Link>
            <Link to="/admin/manage-users" className="hover:text-OxfordBlue">Kelola User</Link>
            <span className="font-semibold text-OxfordBlue">edit : {user.name}</span>
          </div>

            <div className="flex items-center justify-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Edit Pengguna</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Stepper (Vertical) */}
              <div className="md:w-1/4">
                <Stepper steps={steps} currentStep={step} setStep={setStep} />
              </div>

              {/* Form Steps */}
              <div className="md:w-3/4">
                {step === 1 && (
                  <BasicInfoStep 
                    user={user} 
                    handleInputChange={handleInputChange} 
                    onNext={nextStep}
                    onCancel={() => navigate('/admin/manage-users')}
                  />
                )}

                {step === 2 && (
                  <ClassPhotoStep 
                    user={user} 
                    handleInputChange={handleInputChange}
                    preview={preview}
                    handleFileChange={handleFileChange}
                    onPrev={prevStep}
                    onNext={nextStep}
                  />
                )}

                {step === 3 && (
                  <PasswordStep 
                    user={user} 
                    handleInputChange={handleInputChange}
                    onPrev={prevStep}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;