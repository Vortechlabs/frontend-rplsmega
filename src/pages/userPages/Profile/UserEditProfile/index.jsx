import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../../../../services/GlobalApi';
import { useAuth } from '../../../../auth/AuthContext';
import Loader from '../../../../components/Loader';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';

// Components
import ProfileStepper from './ProfileStepper';
import BasicInfoForm from './BasicInfoForm';
import ClassPhotoForm from './ClassPhotoForm';
import PasswordForm from './PasswordForm';

function EditUser() {
  const { user: loggedInUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    nis: '',
    username: '',
    name: '',
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
  const [token, setToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState(false);

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/users/${loggedInUser[0].id}`);
        setUser(response.data);
        setOriginalUser(response.data);
        setPreview(response.data.profilePicture ? `http://127.0.0.1:8000/storage/${response.data.profilePicture}` : null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [loggedInUser, navigate]);

  const handleTokenChange = (e) => {
    setToken(e.target.value);
  };

  const requestToken = async () => {
    try {
      const response = await apiClient.post('/auth/password/send-verification', {
        email: user.email
      });
      setShowTokenForm(true);
      showSuccess('Token sent to your email');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to send token');
    }
  };
  
  const verifyToken = async () => {
    try {
      await apiClient.post('/auth/password/verify-token', {
        email: user.email,
        token: token
      });
      setTokenVerified(true);
      showSuccess('Token verified successfully');
    } catch (error) {
      showError('Invalid token');
    }
  };
  
  const handlePasswordSubmit = async () => {
    try {
      await apiClient.post('/auth/password/change', {
        email: user.email,
        token: token,
        password: user.password,
        password_confirmation: user.password
      });
      resetPasswordState();
      showSuccess('Password changed successfully');
    } catch (error) {
      showError('Failed to change password');
    }
  };
  
  // Helper functions
  const showSuccess = (message) => {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonColor: '#1a365d',
    });
  };
  
  const showError = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#e53e3e',
    });
  };
  
  const resetPasswordState = () => {
    setToken('');
    setTokenVerified(false);
    setShowTokenForm(false);
    setUser(prev => ({...prev, password: ''}));
  };

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

    if (!user.username || !user.name || !user.email) {
      Swal.fire({
        title: 'Error!',
        text: 'Name and email are required',
        icon: 'error',
        confirmButtonColor: '#e53e3e',
      });
      return;
    }

    const formData = new FormData();
    formData.append('nis', user.nis);
    formData.append('username', user.username);
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('class', user.class || '');
    formData.append('_method', 'PUT');

    if (user.profilePicture instanceof File) {
      formData.append('profilePicture', user.profilePicture);
    }

    try {
      const response = await apiClient.post(`/users/${loggedInUser[0].id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const updatedUserData = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      localStorage.setItem('userId', updatedUserData.id);
      updateUser(updatedUserData);
      
      Swal.fire({
        title: 'Success!',
        text: 'Profile updated successfully',
        icon: 'success',
        confirmButtonColor: '#1a365d',
      });
      navigate('/profile');
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          let errorMessage = '';
          for (const key in errors) {
            errorMessage += `${errors[key].join(', ')}\n`;
          }
          Swal.fire({
            title: 'Error!',
            text: errorMessage,
            icon: 'error',
            confirmButtonColor: '#e53e3e',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: `An error occurred: ${error.response.data.message || 'Unknown error'}`,
            icon: 'error',
            confirmButtonColor: '#e53e3e',
          });
        }
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Connection error. Please try again.',
          icon: 'error',
          confirmButtonColor: '#e53e3e',
        });
      }
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (loading) return <Loader />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  const formProps = {
    user,
    handleInputChange,
    handleFileChange,
    preview,
    nextStep,
    prevStep,
    handleSubmit,
    showTokenForm,
    token,
    tokenVerified,
    requestToken,
    verifyToken,
    handleTokenChange,
    handlePasswordSubmit,
    navigate
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl mt-20 shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Stepper Sidebar */}
              <div className="md:w-1/4 bg-gray-50 p-6">
                <ProfileStepper step={step} setStep={setStep} />
              </div>
              
              {/* Main Content */}
              <div className="md:w-3/4 p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Edit Profil</h1>
                
                {/* Form for profile data (step 1 & 2) */}
                {step !== 3 && (
                  <form onSubmit={handleSubmit}>
                    {step === 1 && <BasicInfoForm {...formProps} />}
                    {step === 2 && <ClassPhotoForm {...formProps} />}
                  </form>
                )}
                
                {/* Separate form for password (step 3) */}
                {step === 3 && (
                  <PasswordForm {...formProps} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditUser;