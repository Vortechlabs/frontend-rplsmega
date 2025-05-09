import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';
import { FiArrowLeft, FiUpload, FiCheck, FiX } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import { motion } from 'framer-motion';
import TemplatePDF from './Template.xlsx';
import { FaDownload } from 'react-icons/fa';

function AdminBulkCreateUser() {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [fileProcessingStage, setFileProcessingStage] = useState('idle'); // 'idle', 'uploading', 'reading', 'validating', 'preview'
  const [parsedUsers, setParsedUsers] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleAdminBulkCreateUser = async (e) => {
    e.preventDefault();
  
    if (newUser.password !== newUser.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
  
    setIsSubmitting(true);
  
    try {
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
  
      await apiClient.post('/admin/user/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast.success('Pengguna baru berhasil ditambahkan.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate('/admin/manage-users')
      });
      
    } catch (error) {
      console.error('Gagal menambahkan pengguna:', error);
      toast.error(error.response?.data?.message || 'Terjadi kesalahan saat menambahkan pengguna', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    setFileProcessingStage('uploading');
    setParsedUsers([]);
    setValidationErrors([]);

    // Validasi tipe file
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak valid. Harap upload file CSV atau Excel.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFileProcessingStage('idle');
      return;
    }

    try {
      // Simulasi proses upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFileProcessingStage('reading');
      
      // Membaca file
      const data = await readFile(file);
      setFileProcessingStage('validating');
      
      // Parse data
      const users = parseData(data);
      setParsedUsers(users);
      
      if (users.length === 0) {
        throw new Error('Tidak ada data yang valid ditemukan dalam file');
      }
  
      // Validasi data
      const errors = validateBulkData(users);
      setValidationErrors(errors);
      
      if (errors.length > 0) {
        toast.error('Terdapat kesalahan dalam data yang diupload', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      
      setFileProcessingStage('preview');
      
    } catch (error) {
      console.error('Error during bulk upload:', error);
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFileProcessingStage('idle');
    }
  };

  const handleSubmitBulkData = async () => {
    if (validationErrors.length > 0) {
      toast.error('Harap perbaiki kesalahan sebelum mengirim data', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setIsBulkUploading(true);
    
    try {
      const response = await sendBulkData(parsedUsers);
      
      toast.success(`${parsedUsers.length} pengguna berhasil diimport`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => navigate('/admin/manage-users')
      });
      
    } catch (error) {
      console.error('Error submitting bulk data:', error);
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsBulkUploading(false);
      setFileProcessingStage('idle');
    }
  };

  // Fungsi untuk membaca file
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const parseData = (data) => {
    return data
    .slice(1)
    .map((row, index) => {
      if (index === 0 && (row['NIS'] || row['nis'] || row['Nama'] || row['nama'])) {
        return null; 
      }
      
      return {
        nis: row['NIS'] || row['nis'] || row['__EMPTY'] || '',
        name: row['Nama'] || row['nama'] || row['__EMPTY_1'] || '',
        email: row['Email'] || row['email'] || row['__EMPTY_2'] || '',
        password: row['Password'] || row['password'] || row['__EMPTY_3'] || generateRandomPassword(),
        role: (row['Role'] || row['role'] || row['__EMPTY_4'] || 'user').toLowerCase(),
        class: row['Kelas'] || row['kelas'] || row['Class'] || row['class'] || row['__EMPTY_5'] || '',
      };
    }).filter(user => user && (user.name && user.name.trim() !== '') && (user.email && user.email.trim() !== ''));
  };

  const validateBulkData = (users) => {
    const errors = [];
    
    users.forEach((user, index) => {
      if (!user.name) errors.push(`Baris ${index + 1}: Nama tidak boleh kosong`);
      if (!user.nis) {
        errors.push(`Baris ${index + 1}: NIS tidak boleh kosong`);
      } else if (!/^\d+$/.test(String(user.nis))) {
        errors.push(`Baris ${index + 1}: Format NIS tidak valid (harus angka)`);
      }
      if (!user.email) {
        errors.push(`Baris ${index + 1}: Email tidak boleh kosong`);
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
        errors.push(`Baris ${index + 1}: Format email tidak valid`);
      }
      if (!['user', 'moderator'].includes(user.role)) {
        errors.push(`Baris ${index + 1}: Role harus 'user' atau 'moderator'`);
      }
    });
    
    return errors;
  };
  
  
  const sendBulkData = async (users) => {
    try {
      const response = await apiClient.post('/admin/user/bulk-create', {
        users: users.map(user => ({
          nis: user.nis,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          class: user.class
        }))
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Bulk create error:', error);
      let errorMessage = 'Gagal mengimpor data!';
      
      if (error.response) {
        if (error.response.status === 422) {
          errorMessage = Object.entries(error.response.data.errors)
            .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
            .join('\n');
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
          if (error.response.data.errors) {
            errorMessage += '\n' + Object.values(error.response.data.errors).flat().join('\n');
          }
        }
      }
      
      throw new Error(errorMessage);
    }
  };

  const generateRandomPassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const renderProcessingAnimation = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mt-6 p-4 bg-blue-50 rounded-lg"
      >
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-3"
          />
          <div>
            <h4 className="font-medium text-blue-800">
              {fileProcessingStage === 'uploading' && 'Mengunggah file...'}
              {fileProcessingStage === 'reading' && 'Membaca data...'}
              {fileProcessingStage === 'validating' && 'Memvalidasi data...'}
            </h4>
            <p className="text-sm text-blue-600">
              {fileName}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderPreviewTable = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Preview Data ({parsedUsers.length} pengguna)
          </h3>
          {validationErrors.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {validationErrors.length} kesalahan ditemukan
            </span>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIS</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parsedUsers.map((user, index) => {
                const errorsForRow = validationErrors.filter(err => err.includes(`Baris ${index + 1}`));
                const isValid = errorsForRow.length === 0;
                
                return (
                  <tr key={index} className={isValid ? 'bg-white' : 'bg-red-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.class}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isValid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Valid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiX className="mr-1" /> Error
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {validationErrors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Daftar Kesalahan:</h4>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setFileProcessingStage('idle');
              setParsedUsers([]);
            }}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={handleSubmitBulkData}
            disabled={isBulkUploading || validationErrors.length > 0}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-OxfordBlue hover:bg-OxfordBlue-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isBulkUploading ? 'opacity-75 cursor-not-allowed' : ''
            } ${
              validationErrors.length > 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isBulkUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengimpor...
              </>
            ) : 'Konfirmasi & Impor'}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex bg-gray-50">
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
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
          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 *:after:content-['/'] *:after:ml-1 mb-6">
              <Link to="/admin" className="hover:text-OxfordBlue">Dashboard</Link>
              <Link to="/admin/manage-users" className="hover:text-OxfordBlue">Kelola user</Link>
              <span className="font-semibold text-OxfordBlue">Import User</span>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 sm:p-8">
                <form onSubmit={handleAdminBulkCreateUser} className="space-y-6">
                  {/* Import Massal dari CSV/XLS */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Import Data Massal</h3>
                    <p className="text-sm text-gray-500">
                      Upload file Excel atau CSV untuk menambahkan banyak pengguna sekaligus.
                      Format file harus mengandung kolom: NIS, Nama, Email, Password (opsional), Role, Kelas (opsional).
                    </p>
                    
                    <div className='flex justify-between'>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pilih File (.csv, .xlsx)
                      </label>
                      <div className="mt-1 flex items-center">
                        <label
                          htmlFor="bulk-upload"
                          className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            fileProcessingStage !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <FiUpload className="mr-2 h-5 w-5" />
                          Pilih File
                          <input
                            id="bulk-upload"
                            type="file"
                            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            onChange={handleBulkUpload}
                            disabled={fileProcessingStage !== 'idle'}
                            className="sr-only"
                          />
                        </label>
                        
                        {fileName && fileProcessingStage === 'idle' && (
                          <span className="ml-3 text-sm text-gray-600">
                            {fileName}
                          </span>
                        )}
                      </div>

                      </div>
                    </div>
                    
                    {/* Processing animation */}
                    {(fileProcessingStage === 'uploading' || fileProcessingStage === 'reading' || fileProcessingStage === 'validating') && 
                      renderProcessingAnimation()
                    }
                    
                    {/* Preview table */}
                    {fileProcessingStage === 'preview' && renderPreviewTable()}
                    
                    <div className="bg-blue-50 p-4 rounded-md mt-4">
                      <h4 className="text-sm font-medium text-blue-800 mb-2">Contoh Format File:</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">NIS</th>
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Password</th>
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                              <th className="px-4 py-2 border text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-2 border text-sm text-gray-600">12345</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">John Doe</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">john@example.com</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">password123</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">user</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">XII RPL 1</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 border text-sm text-gray-600">54345</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">Jane Smith</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">jane@example.com</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">(kosong - akan digenerate otomatis)</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">moderator</td>
                              <td className="px-4 py-2 border text-sm text-gray-600">XII RPL 2</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <p className="mt-2 text-xs text-OxfordBlue">
                        Catatan: Kolom Password bisa dikosongkan, sistem akan generate password otomatis.
                      </p>
                      
                    <a
                      href={TemplatePDF}
                      download="Template-Data-document"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <button
                        type="button"
                        className="inline-flex  mt-2 hover:scale-105 transition-transform items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <FaDownload className="mr-2" />
                        Unduh Template
                      </button>
                    </a>

                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/manage-users')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || (newUser.password && newUser.confirmPassword && newUser.password !== newUser.confirmPassword)}
                      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-OxfordBlue hover:bg-OxfordBlue-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
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

export default AdminBulkCreateUser;