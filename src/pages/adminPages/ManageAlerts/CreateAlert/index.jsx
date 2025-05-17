import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowLeft, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAlertPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const getTypeIcon = (type) => {
    const iconClass = "text-4xl opacity-70";
    switch (type) {
      case 'info': return <FaInfoCircle className={`${iconClass} text-blue-400`} />;
      case 'warning': return <FaExclamationTriangle className={`${iconClass} text-amber-400`} />;
      case 'danger': return <FaExclamationCircle className={`${iconClass} text-red-400`} />;
      case 'success': return <FaCheckCircle className={`${iconClass} text-green-400`} />;
      default: return <FaInfoCircle className={`${iconClass} text-gray-400`} />;
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('type', data.type);
    formData.append('is_active', data.is_active ? '1' : '0');
    if (data.start_at) formData.append('start_at', data.start_at);
    if (data.end_at) formData.append('end_at', data.end_at);
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    try {
      await apiClient.post('/admin/alerts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Alert created successfully!');
      setTimeout(() => {
        navigate('/admin/manage-alerts');
      }, 3000);
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error(error.response?.data?.message || 'Failed to create alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
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
        <div className="p-6 md:p-8 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/manage-alerts"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaArrowLeft className="text-xl text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Buat pengumuman baru</h1>
                <p className="text-gray-600">Mohon isi detail dibawah ini untuk memberikan pemberitahuan</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Judul <span className='text-red-700'>*</span></label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Alert title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konten <span className='text-red-700'>*</span></label>
                  <textarea
                    {...register('content', { required: true })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Alert message"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipe <span className='text-red-700'>*</span></label>
                    <select
                      {...register('type', { required: true })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      <option value="info">Info</option>
                      <option value="warning">Warning</option>
                      <option value="danger">Danger</option>
                      <option value="success">Success</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gambar <span className='text-red-700'>*</span></label>
                    <input
                      type="file"
                      accept="image/*"
                      {...register('image')}
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai</label>
                    <input
                      type="datetime-local"
                      {...register('start_at')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Berakhir</label>
                    <input
                      type="datetime-local"
                      {...register('end_at')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="h-40 object-contain rounded-lg border border-gray-200" />
                  ) : (
                    <div className="h-40 w-40 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                      {getTypeIcon('info')}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register('is_active')}
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-all"
                  />
                  <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                    Aktifkan Pemberitahuan
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Link
                  to="/admin/manage-alerts"
                  className="px-5 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Membuat...' : 'Buat Pemberitahuan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlertPage;