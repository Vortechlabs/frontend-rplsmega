import React from 'react';
import { FaUserGraduate, FaImage, FaArrowLeft, FaArrowRight, FaUserAlt } from 'react-icons/fa';

const ClassPhotoStep = ({ user, handleInputChange, preview, handleFileChange, onPrev, onNext }) => {
  return (
    <div className="space-y-6">
          
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaUserAlt className="mr-2 text-OxfordBlue" />
          Username
        </label>
        <input
          type="username"
          name="username"
          value={user.username}
          onChange={handleInputChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition"
          placeholder="Masukkan alamat email"
        />
      </div>
    
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaUserGraduate className="mr-2 text-OxfordBlue" />
          Kelas
        </label>
        <select
          name="class"
          value={user.class || ''}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition appearance-none bg-white"
        >
          <option value="">Pilih Kelas</option>
          <option value="XI RPL 1">XI RPL 1</option>
          <option value="XI RPL 2">XI RPL 2</option>
          <option value="XII RPL 1">XII RPL 1</option>
          <option value="XII RPL 2">XII RPL 2</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaImage className="mr-2 text-OxfordBlue" />
          Foto Profil
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition">
            <div className="flex flex-col items-center justify-center">
              <FaImage className="text-3xl text-OxfordBlue mb-2" />
              <p className="text-sm text-gray-500 text-center">
                {preview ? 'Ganti foto' : 'Upload foto'}
              </p>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
          {preview && (
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-24 min-h-24 min-w-24 max-w-24 rounded-full object-cover border-2 border-indigo-100 shadow-sm" 
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setUser({...user, profilePicture: null});
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          <FaArrowLeft className="mr-2" />
          Kembali
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center px-6 py-3 bg-OxfordBlue text-white rounded-lg hover:bg-OxfordBlue-Dark transition duration-300"
        >
          Selanjutnya
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default ClassPhotoStep;