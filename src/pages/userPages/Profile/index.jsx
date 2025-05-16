import React, { useEffect, useState, useRef } from 'react';
import apiClient from '../../../services/GlobalApi';
import Loader from '../../../components/Loader';
import Navbar from '../../../components/Navbar';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import Swal from 'sweetalert2';
import defaultProfilePic from '/defaultProfile.jpg';
import { 
  FaEdit, 
  FaPlus, 
  FaDownload, 
  FaCopy, 
  FaTrash, 
  FaEye,
  FaGlobe, 
  FaMobileAlt, 
  FaDesktop, 
  FaPalette,
  FaCode
} from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { FiAward, FiCalendar, FiEdit2, FiFolder, FiGrid, FiMail, FiShare2 } from 'react-icons/fi';

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
  }, [user[0].id]);

  
    const getCategoryIcon = (categoryName) => {
    const iconStyle = "text-sm";
      switch(categoryName.toLowerCase()) {
          case 'website':
          return <FaGlobe className={`${iconStyle} text-OxfordBlue`} />;
          case 'mobile app':
          return <FaMobileAlt className={`${iconStyle} text-OxfordBlue`} />;
          case 'desktop app':
          return <FaDesktop className={`${iconStyle} text-OxfordBlue`} />;
          case 'design':
          return <FaPalette className={`${iconStyle} text-OxfordBlue`} />;
          default:
          return <FaCode className={`${iconStyle} text-OxfordBlue`} />;
      }
    };

  const handleDeleteProject = async (projectId) => {
    try {
      const result = await Swal.fire({
        title: 'Apakah kamu yakin?',
        text: "Kamu tidak dapat mengembalikan data ini!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Ya, Hapus!',
      });

      if (result.isConfirmed) {
        await apiClient.delete(`/projects/${projectId}`);
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
        Swal.fire('Terhapus!', 'Karyamu sudah berhasil dihapus.', 'success');
      }
    } catch (error) {
      console.error('Gagal mengapus karya:', error);
      Swal.fire('Gagal!', 'Gagal untuk menghapus karya.', 'error');
    }
  };

  const handleShareProfile = () => setShowModal(true);
  const handleCopyLink = () => {
    const link = `${window.location.origin}/profile/creator/${userData.username}`;
    navigator.clipboard.writeText(link);
    Swal.fire('Tersalin!', 'Tautan profil berhasil disalin.', 'success');
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
  if (!userData) return <p className="text-center text-gray-500">Tidak ada data user tersedia.</p>;

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
        className="max-w-6xl mb-10 mx-auto px-4"
      >
        {/* Profile Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100/80 transition-all hover:shadow-2xl hover:-translate-y-1">
          <div className="flex flex-col lg:flex-row">
            {/* Profile Sidebar - Enhanced with Glass Effect */}
            <div className="lg:w-1/3 bg-gradient-to-br from-OxfordBlue/90 to-OxfordBlue-Dark/90 p-8 flex flex-col items-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-400/10 rounded-full filter blur-3xl"></div>
              
              {/* Profile Avatar with Floating Animation */}
              <motion.div 
                className="relative group mb-6 z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-md"></div>
                <div className="relative w-40 h-40 rounded-full border-4 border-white/80 shadow-2xl overflow-hidden">
                  <img
                    src={userData.profilePicture ? `https://apirpl.smkn1purbalingga.sch.id/storage/${userData.profilePicture}` : defaultProfilePic}
                    alt={`${userData.name}'s profile`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </motion.div>
              
              {/* User Info */}
              <div className="text-center space-y-3 z-10">
                <motion.h2 
                  className="text-2xl font-bold text-white tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {userData.name}
                </motion.h2>
                <motion.p 
                  className="text-blue-100/90 font-medium flex items-center justify-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <FiMail className="w-4 h-4" />
                  {userData.email}
                </motion.p>
                
                {/* Class Badge with Hover Effect */}
                <motion.div 
                  className="inline-flex bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20 shadow-sm mt-4"
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="text-sm font-medium text-white">
                    Kelas <span className="font-bold text-blue-300">{userData.class}</span> • SMKN 1 Purbalingga
                  </span>
                </motion.div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-auto pt-6 w-full flex justify-center gap-3 z-10">
                <Link 
                  to="/edit/profile"
                  className="flex items-center gap-2 hover:scale-105 transition-transform bg-white/90 hover:bg-white text-OxfordBlue px-4 py-2.5 rounded-lg border border-blue-200/50 shadow-sm hover:shadow-md font-medium text-sm"
                >
                  <FiEdit2 className="w-4 h-4" /> Perbarui Profil
                </Link>
              </div>
            </div>
            
            {/* Profile Content - Enhanced Layout */}
            <div className="lg:w-2/3 p-8 bg-gradient-to-br from-white to-gray-50">
              {/* Header with Animated Elements */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profil Saya</h1>
                  <p className="text-gray-500 mt-1 flex items-center gap-1">
                    <FiAward className="w-4 h-4" />
                    Tunjukan kreatifitas dan bakatmu di RPL SMEGA
                  </p>
                </motion.div>
                
                <motion.button 
                  onClick={handleShareProfile}
                  className="flex items-center gap-2 bg-gradient-to-r from-OxfordBlue to-blue-600 hover:from-OxfordBlue-Dark hover:to-blue-700 text-white px-4 py-2.5 rounded-lg hover:scale-[1.02] transition-transform shadow-md hover:shadow-lg font-medium text-sm whitespace-nowrap"
                  whileHover={{ y: -2 }}
                >
                  <FiShare2 className="w-4 h-4" /> Bagikan Profil
                </motion.button>
              </div>
              
              {/* Stats Grid - Enhanced Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                {/* Total Projects Card */}
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-3 rounded-xl mr-4">
                      <div className="w-6 h-6 relative">
                        <FiFolder className="absolute w-6 h-6 text-OxfordBlue" />
                        <FiFolder className="absolute w-6 h-6 text-OxfordBlue opacity-30 animate-pulse delay-100" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Total Karya</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{projects.length}</p>
                    </div>
                  </div>
                </motion.div>
                
                {/* Join Date Card */}
                <motion.div 
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center">
                    <div className="bg-green-50 p-3 rounded-xl mr-4">
                      <div className="w-6 h-6 relative">
                        <FiCalendar className="absolute w-6 h-6 text-green-600" />
                        <FiCalendar className="absolute w-6 h-6 text-green-600/30 animate-pulse delay-200" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Bergabung Pada</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">
                        {formatDate(userData?.created_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Project Categories Section - Enhanced */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <motion.h3 
                    className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FiGrid className="text-OxfordBlue" /> Kategori Karya
                  </motion.h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length} kategori
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized')))
                    .filter(category => typeof category === 'string')
                    .slice(0, 6)
                    .map((category, index) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-OxfordBlue rounded-xl border border-blue-200 shadow-xs flex items-center gap-2"
                      >
                        <span className="w-2 h-2 bg-OxfordBlue rounded-full animate-pulse" style={{ animationDelay: `${index * 100}ms` }}></span>
                        <span className="font-medium text-sm capitalize">{category}</span>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full ml-auto">
                          {projects.filter(p => p.category?.name === category || (!p.category && category === 'Uncategorized')).length}
                        </span>
                      </motion.div>
                    ))}
                  
                  {Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length > 6 && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl border border-gray-200 text-sm flex items-center gap-1"
                    >
                      <FiPlusCircle className="w-4 h-4" />
                      +{Array.from(new Set(projects.map(project => project.category?.name || 'Uncategorized'))).length - 6} lainnya
                    </motion.div>
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
              <h2 className="text-2xl font-bold text-gray-800">Karya saya</h2>
              <p className="text-gray-500">Koleksi karya kreatif dan brilian kamu</p>
            </div>
            <Link 
              to="/upload/project"
              className="flex items-center gap-2 hover:scale-105 transition-transform bg-GoldenYellow-Dark text-white px-4 py-2 rounded-lg hover:bg-GoldenYellow shadow-md"
            >
              <FaPlus size={14} /> Bagikan karya baru
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
                      src={`https://apirpl.smkn1purbalingga.sch.id/storage/${project.project_image[0].projectImage}`}
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
                      {project.category && (
                      <span className=" text-center bg-blue-100  text-OxfordBlue text-xs  p-1 rounded-full flex items-center">
                          {getCategoryIcon(project.category.name)}
                      </span>
                      )}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Bagikan karya baru</h3>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Belum ada karya yang kamu bagikan</h3>
                <p className="text-gray-600 mb-6">
                  Mulai dengan membagikan karya kamu, dan tunjukan skill terpendammu
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
                  src: userData.profilePicture ? `https://apirpl.smkn1purbalingga.sch.id/storage/${userData.profilePicture}` : defaultProfilePic,
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