import React from 'react';

const BasicInfoForm = ({ user, handleInputChange, nextStep, navigate }) => {
  return (
    <div>
      <div className="space-y-6">
        <div>
          <label className=" hidden text-sm font-medium text-gray-700 mb-1">Nomor Induk Siswa (NIS)</label>
          <input
            type="hidden"
            name="nis"
            value={user.nis}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Enter your NIS"
          />
        </div>

        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Enter username"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-transparent"
            placeholder="Enter your email"
          />
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