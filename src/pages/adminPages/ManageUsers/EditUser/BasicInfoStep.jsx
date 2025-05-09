import React from 'react';
import { FaIdBadge, FaEnvelope, FaUserCog, FaArrowLeft, FaArrowRight, FaRegIdCard } from 'react-icons/fa';

const BasicInfoStep = ({ user, handleInputChange, onNext, onCancel }) => {
  return (
    <div className="space-y-6">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaRegIdCard className="mr-2 text-OxfordBlue" />
          Nomor Induk Siswa (NIS)
        </label>
        <input
          type="nis"
          name="nis"
          value={user.nis}
          onChange={handleInputChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition"
          placeholder="Masukkan alamat email"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaIdBadge className="mr-2 text-OxfordBlue" />
          Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition"
          placeholder="Masukkan nama lengkap"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaEnvelope className="mr-2 text-OxfordBlue" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition"
          placeholder="Masukkan alamat email"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaUserCog className="mr-2 text-OxfordBlue" />
          Role Pengguna
        </label>
        <select
          name="role"
          value={user.role}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition appearance-none bg-white"
        >
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
      </div>
      
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
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

export default BasicInfoStep;