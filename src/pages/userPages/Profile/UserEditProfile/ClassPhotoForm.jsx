import React from 'react';

const ClassPhotoForm = ({ user, handleInputChange, handleFileChange, preview, prevStep, nextStep }) => {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
          <select
            name="class"
            value={user.class || ''}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
          >
            <option value="">Pilih kelasmu</option>
            <option value="XI RPL 1">XI RPL 1</option>
            <option value="XI RPL 2">XI RPL 2</option>
            <option value="XII RPL 1">XII RPL 1</option>
            <option value="XII RPL 2">XII RPL 2</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Profil</label>
          <div className="flex items-center space-x-6">
            {preview && (
              <div className="shrink-0">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-16 w-16 rounded-full object-cover shadow-md border border-gray-200" 
                />
              </div>
            )}
            <label className="block">
              <span className="sr-only">Pilih gambar profil</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-OxfordBlue-Dark
                  hover:file:bg-blue-100"
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
        >
          Kembali
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

export default ClassPhotoForm;