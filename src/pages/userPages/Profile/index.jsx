import React, { useEffect, useState, useRef } from 'react';
import apiClient from '../../../services/GlobalApi';
import Loader from '../../../components/Loader';
import Navbar from '../../../components/Navbar';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import Swal from 'sweetalert2';
import defaultProfilePic from '/defaultProfile.jpg';
import { FaEdit, FaPlus, FaShare, FaDownload, FaCopy, FaTrash, FaEye } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';

const truncateString = (str, maxLength) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const qrCodeRef = useRef(null);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const [userResponse, projectsResponse] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get(`/projects/user/projects`)
        ]);
        setUserData(userResponse.data);
        setProjects(projectsResponse.data);
      } catch (error) {
        setError('Failed to load profile or projects data.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user.id]);

  const handleDeleteProject = async (projectId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        await apiClient.delete(`/projects/${projectId}`);
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        Swal.fire('Deleted!', 'Your project has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      Swal.fire('Error!', 'Failed to delete project.', 'error');
    }
  };

  const handleShareProfile = () => setShowModal(true);
  const handleCopyLink = () => {
    const link = `${window.location.origin}/profile/creator/${userData.username}`;
    navigator.clipboard.writeText(link);
    Swal.fire('Copied!', 'Profile link copied to clipboard.', 'success');
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `QRCode-${userData.username}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!userData) return <p className="text-center text-gray-500">No user data available.</p>;

  const profileLink = `${window.location.origin}/profile/creator/${userData.username}`;

  return (
    <>
      <Navbar />
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] -z-10"></div>
      
      <div className="max-w-6xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mb-10 mx-auto"
      >
        {/* Profile Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Sidebar */}
            <div className="lg:w-1/3 bg-gradient-to-br from-OxfordBlue to-OxfordBlue-Dark p-8 flex flex-col items-center relative">
              {/* Profile Avatar */}
              <div className="relative group mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"></div>
                <img
                  src={userData.profilePicture ? `http://127.0.0.1:8000/storage/${userData.profilePicture}` : defaultProfilePic}
                  alt={`${userData.name}'s profile`}
                  className="relative w-40 h-40 object-cover rounded-full border-4 border-white shadow-xl z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* User Info */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{userData.name}</h2>
                <p className="text-blue-100 font-medium">{userData.email}</p>
                
                {/* Class Badge */}
                <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 border border-gray-200/50 shadow-sm mt-4">
                  <span className="text-sm font-medium text-gray-700">
                    Kelas <span className="font-bold text-OxfordBlue">{userData.class}</span> • SMKN 1 Purbalingga
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-auto pt-6 w-full flex justify-center gap-3">
                <Link 
                  to="/edit/profile"
                  className="flex items-center gap-2 hover:scale-105 transition-transform bg-white/90 hover:bg-white text-OxfordBlue px-4 py-2.5 rounded-lg border border-blue-200/50 shadow-sm hover:shadow-md font-medium text-sm"
                >
                  <FaEdit className="w-4 h-4" /> Edit Profile
                </Link>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="lg:w-2/3 p-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profil saya</h1>
                  <p className="text-gray-500 mt-1">Tunjukan kreatifitas dan bakatmu di RPL SMEGA.</p>
                </div>
                <button 
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 bg-OxfordBlue hover:bg-OxfordBlue-Dark text-white px-4 py-2.5 rounded-lg hover:scale-105 transition-transform shadow-md hover:shadow-lg font-medium text-sm whitespace-nowrap"
                >
                  <FaShare className="w-4 h-4" /> Bagikan Profil
                </button>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Total Projects Card */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-OxfordBlue" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total proyek</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{projects.length}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Published Projects Card */}
                <motion.div 
                  whileHover={{ y: -2 }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className="bg-green-50 p-3 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Gabung pada</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                      {formatDate(userData?.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Project Categories Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">Kategori Proyek</h3>
                  <span className="text-sm text-gray-500">
                    {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length} unique categories
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized')))
                    .filter(category => typeof category === 'string') // Ensure we only have strings
                    .slice(0, 6)
                    .map(category => (
                      <motion.div
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-OxfordBlue rounded-xl border border-blue-200 shadow-xs flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-OxfordBlue rounded-full"></span>
                        <span className="font-medium text-sm capitalize">{category}</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ml-auto">
                          {projects.filter(p => p.category?.name === category || (!p.category && category === 'Uncategorized')).length}
                        </span>
                      </motion.div>
                    ))}
                  
                  {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length > 6 && (
                    <div className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl border border-gray-200 text-sm">
                      +{Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length - 6} more
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.section>
        
        {/* Projects Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Proyek saya</h2>
              <p className="text-gray-500">Koleksi karya kreatif kamu</p>
            </div>
            <Link 
              to="/upload/project"
              className="flex items-center gap-2 hover:scale-105 transition-transform bg-GoldenYellow-Dark text-white px-4 py-2 rounded-lg hover:bg-GoldenYellow shadow-md"
            >
              <FaPlus size={14} /> Proyek baru
            </Link>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all"
              >
                {project.project_image && project.project_image.length > 0 && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={`http://127.0.0.1:8000/storage/${project.project_image[0].projectImage}`}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {truncateString(project.title, 30)}
                    </h3>
                    <span className="text-xs bg-blue-100 text-center text-OxfordBlue px-2 py-1 rounded-full">
                      {project.category?.name || 'General'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="flex justify-between border-t border-gray-100 pt-4">
                    <Link 
                      to={`/project/${project.slug}`}
                      className="flex items-center gap-2 text-OxfordBlue hover:text-OxfordBlue text-sm font-medium"
                    >
                      <FaEye size={12} /> Lihat Detail
                    </Link>
                    <div className="flex gap-4">
                      <Link
                        to={`/edit/project/${project.slug}`}
                        className="flex items-center gap-2 text-OxfordBlue hover:text-OxfordBlue text-sm font-medium"
                      >
                        <FaEdit size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <FaTrash size={12} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Project Card */}
            <Link to="/upload/project">
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer"
              >
                <div className="bg-blue-100 rounded-full p-4 mb-4 text-OxfordBlue">
                  <FaPlus size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tambah proyek baru</h3>
                <p className="text-sm text-gray-600">
                  Tunjukan karya terbaik kamu di RPL SMEGA
                </p>
              </motion.div>
            </Link>
          </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
              <div className="max-w-md mx-auto">
                <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FaPlus className="text-GoldenYellow-Dark" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada proyek yang kamu unggah</h3>
                <p className="text-gray-600 mb-6">
                  Mulai dengan mengunggah proyek kamu, dan tunjukan skill kamu
                </p>
                <Link 
                  to="/upload/project"
                  className="inline-flex items-center gap-2 bg-GoldenYellow-Dark text-white px-6 py-3 rounded-lg hover:bg-GoldenYellow transition-all shadow-md"
                >
                  <FaPlus /> Unggah proyek pertama
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6  max-w-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Bagikan Profilmu</h2>
            
            <div ref={qrCodeRef} className="flex justify-center mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <QRCodeSVG  
                value={profileLink}
                size={180}
                level="H"
                includeMargin={true}
                fgColor="#ECBB03"
                imageSettings={{
                  src: userData.profilePicture ? `http://127.0.0.1:8000/storage/${userData.profilePicture}` : defaultProfilePic,
                  excavate: true,
                  width: 40,
                  height: 40
                }}
              />
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Tautan profil:</p>
              <div className="flex items-center bg-gray-100 rounded-lg p-3 border border-gray-200">
                <p className="text-xs truncate flex-grow text-gray-800">{profileLink}</p>
                <button 
                  onClick={handleCopyLink}
                  className="ml-2 text-GoldenYellow-Dark hover:text-GoldenYellow p-2 rounded-full hover:bg-blue-50 transition"
                  title="Copy link"
                >
                  <FaCopy size={14} />
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadQRCode}
                className="flex items-center gap-2 bg-GoldenYellow-Dark text-white px-4 py-3 rounded-lg hover:bg-GoldenYellow transition-all flex-1 justify-center"
              >
                <FaDownload size={14} /> Unduh QR
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition flex-1"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default UserProfile;