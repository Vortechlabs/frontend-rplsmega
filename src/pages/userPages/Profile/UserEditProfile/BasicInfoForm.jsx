import React, { useState } from 'react';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import apiClient from '../../../../services/GlobalApi';

const BasicInfoForm = ({ user, handleInputChange, nextStep, navigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

const handleVerifyPassword = async (e) => {
  e.preventDefault();
  setIsVerifying(true);
  setVerificationError('');
  
  try {
    const response = await apiClient.post('/verify-password', {
      password 
    });

    // Periksa response.data.success sesuai backend
    if (response.data && response.data.success) {
      setIsVerified(true);
    } else {
      // Gunakan error message dari response atau default
      setVerificationError(response.data?.error || 'Password yang Anda masukkan salah');
    }
  } catch (error) {
    console.error('Verification error:', error);
    // Handle error response dari Laravel
    setVerificationError(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Terjadi kesalahan saat verifikasi'
    );
  } finally {
    setIsVerifying(false);
  }
};

  return (
    <div>
      <div className="space-y-6">
        <div className='hidden'>
          <input
            type="hidden"
            name="nis"
            value={user.nis}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Nama Pengguna</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Masukan nama pengguna"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Masukan nama lengkap"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              required
              disabled={!isVerified}
              className={`w-full p-3 border ${isVerified ? 'border-gray-300' : 'border-gray-200 bg-gray-50'} rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent`}
              placeholder="Masukan email valid"
            />
            {!isVerified && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg">
                <span className="text-sm text-gray-600">Verifikasi password untuk mengubah email</span>
              </div>
            )}
          </div>
          
          {!isVerified && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-blue-100">
              <h4 className="font-medium text-GoldenYellow-Darkflex items-center gap-2">
                <FaLock className="text-GoldenYellow" /> Verifikasi Password
              </h4>
              <p className="text-sm text-GoldenYellow mt-1">Masukkan password Anda saat ini untuk mengubah email</p>
              
              <div className="mt-3 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-GoldenYellow-Dark focus:border-transparent"
                  placeholder="Password saat ini"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {verificationError && (
                <p className="text-red-500 text-sm mt-2">{verificationError}</p>
              )}
              
              <button
                type='button'
                onClick={handleVerifyPassword}
                disabled={isVerifying || !password}
                className={`mt-3 px-4 py-2 rounded-lg flex items-center gap-2 ${isVerifying || !password ? 'bg-yellow-200 cursor-not-allowed' : 'bg-GoldenYellow-Dark hover:bg-GoldenYellow'} text-white transition-colors`}
              >
                {isVerifying ? 'Memverifikasi...' : 'Verifikasi Password'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-2.5 bg-OxfordBlue text-white rounded-lg hover:bg-OxfordBlue-Dark transition duration-300 shadow-md"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
};

export default BasicInfoForm;