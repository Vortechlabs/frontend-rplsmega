import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import { FaRegIdCard } from 'react-icons/fa';

function AdminCreateUser() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    nis: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    class: '',
    profilePicture: null,
  });
  const [preview, setPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdminCreateUser = async (e) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('nis', newUser.nis);
    formData.append('name', newUser.name);
    formData.append('email', newUser.email);
    formData.append('password', newUser.password);
    formData.append('role', newUser.role);
    formData.append('class', newUser.class);
    if (newUser.profilePicture) {
      formData.append('profilePicture', newUser.profilePicture);
    }
  
    try {
      await apiClient.post('/admin/user/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Pengguna berhasil ditambahkan', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => {
        navigate('/admin/manage-users');
      }, 3000);
      
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.', {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewUser({ ...newUser, profilePicture: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="flex bg-gray-50">

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Sidebar />
      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <div className="min-h-screen">

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 *:after:content-['/'] *:after:ml-1 mb-6">
            <Link to="/admin" className="hover:text-OxfordBlue">Dashboard</Link>
            <Link to="/admin/manage-users" className="hover:text-OxfordBlue">Kelola user</Link>
            <span className="font-semibold text-OxfordBlue">Tambah pengguna</span>
          </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleAdminCreateUser} className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                        {preview ? (
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <FiUser className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-OxfordBlue text-white p-2 rounded-full cursor-pointer hover:bg-OxfordBlue-Dark transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </label>
                    </div>
                    <span className="mt-2 text-sm text-gray-500">Upload foto profil</span>
                  </div>
                  
                  {/* NIS */}
                  <div className="space-y-1">
                    <label htmlFor="nis" className="block text-sm font-medium text-gray-700">NIS</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRegIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="nis"
                        type="nis"
                        value={newUser.nis}
                        onChange={(e) => setNewUser({ ...newUser, nis: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                        minLength="6"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm"
                        placeholder="Minimal 6 karakter"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={newUser.confirmPassword}
                        onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                        required
                        minLength="6"
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm"
                        placeholder="Ketik ulang password"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    {newUser.password && newUser.confirmPassword && newUser.password !== newUser.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">Password tidak cocok</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm rounded-md"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="user">User</option>
                    </select>
                  </div>

                  {/* Class */}
                  <div className="space-y-1">
                    <label htmlFor="class" className="block text-sm font-medium text-gray-700">Kelas</label>
                    <select
                      id="class"
                      value={newUser.class}
                      onChange={(e) => setNewUser({ ...newUser, class: e.target.value })}
                      required
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-OxfordBlue focus:border-OxfordBlue sm:text-sm rounded-md"
                    >
                      <option value="">Pilih Kelas</option>
                      <option value="XI RPL 1">XI RPL 1</option>
                      <option value="XI RPL 2">XI RPL 2</option>
                      <option value="XII RPL 1">XII RPL 1</option>
                      <option value="XII RPL 2">XII RPL 2</option>
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/manage-users')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (newUser.password && newUser.confirmPassword && newUser.password !== newUser.confirmPassword)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-GoldenYellow-Dark hover:bg-GoldenYellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-GoldenYellow-Dark ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateUser;