import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import apiClient from '../../services/GlobalApi';
import Loader from '../../components/Loader';
import { FiMail, FiKey, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiClient.post('/auth/password/check-email', { email });
      setEmailVerified(true);
      await handleRequestToken(); 
    } catch (error) {
      Swal.fire({
        title: 'Email Tidak Ditemukan',
        text: 'Email yang Anda masukkan tidak terdaftar di sistem kami',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestToken = async () => {
    setLoading(true);
    
    try {
      const response = await apiClient.post('/auth/password/send-verification', { email });
      
      if (response.data.message === 'Verification code sent') {
        setStep(2);
        Swal.fire({
          title: 'Token Terkirim',
          text: 'Token reset password telah dikirim ke email Anda',
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          background: '#1f2937',
          color: 'white'
        });
      } else {
        throw new Error(response.data.message || 'Gagal mengirim token');
      }
    } catch (error) {
      console.error('Error sending token:', error.response?.data || error.message);
      Swal.fire({
        title: 'Gagal',
        text: error.response?.data?.message || error.message || 'Gagal mengirim token',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
    } finally {
      setLoading(false);
    }
};

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiClient.post('/auth/password/verify-token', { email, token });
      setStep(3);
      Swal.fire({
        title: 'Token Valid',
        text: 'Silahkan buat password baru',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        background: '#1f2937',
        color: 'white'
      });
    } catch (error) {
      Swal.fire({
        title: 'Token Tidak Valid',
        text: 'Token yang Anda masukkan salah atau sudah kadaluarsa',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: 'Error',
        text: 'Password dan konfirmasi password tidak sama',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
      return;
    }

    setLoading(true);
    
    try {
      await apiClient.post('/auth/password/change', {
        email,
        token,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      
      Swal.fire({
        title: 'Password Direset',
        text: 'Password Anda berhasil direset, silahkan login',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        background: '#1f2937',
        color: 'white'
      });
      navigate('/auth/login');
    } catch (error) {
      Swal.fire({
        title: 'Gagal',
        text: error.response?.data?.message || 'Gagal mereset password',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            {step === 1 && 'Masukkan email Anda untuk memulai proses reset password'}
            {step === 2 && 'Masukkan token yang dikirim ke email Anda'}
            {step === 3 && 'Buat password baru untuk akun Anda'}
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg py-8 px-6 shadow-xl rounded-xl sm:px-10 border border-gray-700">
          {step === 1 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleCheckEmail}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Verifikasi Email
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleVerifyToken}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="token" className="block text-sm font-medium text-gray-300">
                  Token Verifikasi
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="6-digit token"
                    maxLength="6"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  Token telah dikirim ke <span className="font-semibold text-blue-400">{email}</span>
                </p>
              </motion.div>

              <motion.div className="flex space-x-4" variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <FiArrowLeft className="mr-2" />
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Verifikasi Token
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form 
              className="space-y-6" 
              onSubmit={handleResetPassword}
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password Baru
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength="8"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Minimal 8 karakter"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Konfirmasi Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength="8"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 text-white placeholder-gray-400 block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                    placeholder="Ketik ulang password"
                  />
                </div>
              </motion.div>

              <motion.div className="flex space-x-4" variants={itemVariants}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <FiArrowLeft className="mr-2" />
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="mr-2" />
                      Reset Password
                    </>
                  )}
                </button>
              </motion.div>
            </motion.form>
          )}
        </div>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/auth/login')}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
          >
            Kembali ke halaman login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;