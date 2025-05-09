import React from 'react';
import { FaLock, FaArrowLeft, FaSave } from 'react-icons/fa';

const PasswordStep = ({ user, handleInputChange, onPrev, onSubmit }) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          <FaLock className="mr-2 text-OxfordBlue" />
          Password Baru
        </label>
        <input
          type="password"
          name="password"
          value={user.password || ''}
          onChange={handleInputChange}
          placeholder="Kosongkan jika tidak ingin mengubah password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition"
        />
        <p className="mt-1 text-xs text-gray-500">
          Minimal 8 karakter, kombinasi huruf dan angka
        </p>
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
          type="submit"
          onClick={onSubmit}
          className="flex items-center px-6 py-3 bg-OxfordBlue text-white rounded-lg hover:bg-OxfordBlue-Dark transition duration-300"
        >
          <FaSave className="mr-2" />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
};

export default PasswordStep;