import React, { useEffect, useState } from 'react';
import apiClient from '../../../../services/GlobalApi';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import Loader from '../../../../components/Loader';
import defaultProfilePic from '/defaultProfile.jpg';
import { 
  FaSearch, 
  FaFilter, 
  FaChevronDown, 
  FaStar, 
  FaTags,
  FaGlobe, 
  FaMobileAlt, 
  FaDesktop, 
  FaPalette,
  FaCode,
  FaArrowRight
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import Waves from '../../../../components/Waves/Waves';

const CreatorProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userResponse, projectsResponse, categoriesResponse] = await Promise.all([
          apiClient.get(`/users/creator/${username}`),
          apiClient.get('/projects'),
          apiClient.get('/categories')
        ]);

        setUser(userResponse.data);
        setProjects(projectsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  // Helper functions
  const truncateString = (str, maxLength) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0; 
    const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
    return total / ratings.length;
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      tahun: 31536000,
      bulan: 2592000,
      hari: 86400,
      jam: 3600,
      menit: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : ''} yang lalu`;
      }
    }
    
    return 'Baru saja';
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getCategoryIcon = (categoryName) => {
    const iconStyle = "text-sm";
    switch(categoryName?.toLowerCase()) {
      case 'website': return <FaGlobe className={`${iconStyle} text-OxfordBlue`} />;
      case 'mobile app': return <FaMobileAlt className={`${iconStyle} text-OxfordBlue`} />;
      case 'desktop app': return <FaDesktop className={`${iconStyle} text-OxfordBlue`} />;
      case 'design': return <FaPalette className={`${iconStyle} text-OxfordBlue`} />;
      default: return <FaCode className={`${iconStyle} text-OxfordBlue`} />;
    }
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    // Filter by creator
    const isCreatorProject = project.user?.username === username;
    
    // Search filter
    const matchesSearch = 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technology?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      selectedCategory === 'all' || 
      project.category?.id == selectedCategory;
    
    // Rating filter
    const avgRating = calculateAverageRating(project.ratings || []);
    let matchesRating = true;
    
    if (filterCriteria === 'high-rating') {
      matchesRating = avgRating >= 4;
    } else if (filterCriteria === 'low-rating') {
      matchesRating = avgRating < 4;
    }
    
    return isCreatorProject && matchesSearch && matchesCategory && matchesRating;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <div className="bg-red-100 rounded-full p-3 inline-flex mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Terjadi Kesalahan</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-18 bg-gray-50">
        {/* Background Waves */}
        <div className='relative h-80'>
          <Waves
            lineColor="#FDC800"
            backgroundColor="#0A3180"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
            className='max-h-80'
          />

          {/* Gradient Overlay */}
          <div className='absolute inset-0 flex items-end'>
            <div className='w-full h-60 bg-gradient-to-t from-white to-transparent'></div>
          </div>
        </div>

        {/* Profile Card */}
        {user && (
          <div className="max-w-4xl mt-[-200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-OxfordBlue to-OxfordBlue-Dark rounded-2xl shadow-lg overflow-hidden mb-10 border border-gray-700/50"
            >
              {/* Decorative Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full filter blur-3xl"></div>
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-indigo-400/10 rounded-full filter blur-3xl"></div>
              </div>

              <div className="relative p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Profile Picture */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="relative w-32 h-32 rounded-full border-4 border-white/80 shadow-xl overflow-hidden">
                      <img
                        src={user.profilePicture 
                          ? `https://api-rplsmega-master-auajf8.laravel.cloud/storage/${user.profilePicture}`
                          : defaultProfilePic}
                        alt={`${user.name}'s profile`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProfilePic;
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Profile Info */}
                  <div className="text-center md:text-left space-y-3">
                    <motion.h1 
                      className="text-3xl font-bold text-white tracking-tight"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className='line-clamp-1'>{user.name} </span>
                      <br className='block md:hidden'/>
                      <span className="text-blue-300/80 line-clamp-1 text-xl ml-2">@{user.username}</span>
                    </motion.h1>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <motion.div 
                        className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20"
                        whileHover={{ scale: 1.03 }}
                      >
                        <span className="text-sm font-medium text-white">
                          Kelas <span className="text-blue-300 font-semibold">{user.class}</span>
                        </span>
                      </motion.div>
                      
                      <motion.div 
                        className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20"
                        whileHover={{ scale: 1.03 }}
                      >
                        <span className="text-sm font-medium text-white">
                          SMKN 1 Purbalingga
                        </span>
                      </motion.div>
                    </div>
                    
                    <motion.p 
                      className="text-sm text-blue-100/90 flex items-center gap-1 justify-center md:justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Bergabung {formatDate(user.created_at)}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search and Filter Section */}
            <div className="mb-10">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1 group">
                  <div className="absolute z-20 -mt-7 inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-OxfordBlue">
                    <FaSearch className="transition-transform text-OxfordBlue duration-300 group-focus-within:scale-110" />
                  </div>
                  <input
                    type="text"
                    placeholder=" "
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="peer pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-OxfordBlue w-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-sm"
                  />
                  <label className="absolute left-11 top-3 px-1 text-gray-500 pointer-events-none transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-OxfordBlue peer-focus:bg-white peer-focus:px-1.5 rounded">
                    Cari karya {user.name}...
                  </label>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Rating Filter */}
                  <div className="relative group flex-1">
                    <div className="absolute z-20 inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-OxfordBlue">
                      <FaStar className="transition-transform duration-300 group-focus-within:scale-110" />
                    </div>
                    
                    <div 
                      className="flex items-center pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl cursor-pointer bg-white/80 hover:bg-white"
                      onClick={() => setIsRatingOpen(!isRatingOpen)}
                    >
                      {filterCriteria === 'all' && 'Semua Bintang'}
                      {filterCriteria === 'high-rating' && (
                        <span className="flex items-center">
                          <span className="text-amber-400 mr-1">★★★★</span> 4+ bintang
                        </span>
                      )}
                      {filterCriteria === 'low-rating' && (
                        <span className="flex items-center">
                          <span className="text-amber-400 mr-1">★★★☆</span> dibawah 4
                        </span>
                      )}
                      <FaChevronDown className={`absolute right-3 transition-transform ${isRatingOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isRatingOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul>
                          <li 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFilterCriteria('all');
                              setIsRatingOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            Semua Bintang
                          </li>
                          <li 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                              setFilterCriteria('high-rating');
                              setIsRatingOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            <span className="text-amber-400 mr-2">★★★★</span> 4+ bintang
                          </li>
                          <li 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                              setFilterCriteria('low-rating');
                              setIsRatingOpen(false);
                              setCurrentPage(1);
                            }}
                          >
                            <span className="text-amber-400 mr-2">★★★☆</span> dibawah 4
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="relative group flex-1">
                    <div 
                      className="flex items-center pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl cursor-pointer bg-white/80 hover:bg-white"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                      <FaTags className="absolute left-3.5 text-OxfordBlue" />
                      <span>
                        {selectedCategory === 'all' 
                          ? "Semua Kategori" 
                          : categories.find(cat => cat.id == selectedCategory)?.name
                        }
                      </span>
                      <FaChevronDown className={`absolute right-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isCategoryOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <ul>
                          <li 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setSelectedCategory('all');
                              setIsCategoryOpen(false);
                            }}
                          >
                            Semua Kategori
                          </li>
                          {categories.map((category) => (
                            <li 
                              key={category.id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                              onClick={() => {
                                setSelectedCategory(category.id);
                                setIsCategoryOpen(false);
                              }}
                            >
                              {getCategoryIcon(category.name)}
                              <span className="ml-2">{category.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            {currentProjects.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">Tidak ada proyek yang ditemukan</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Coba sesuaikan kriteria penelusuran atau filter Anda
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 grid-cols-1 justify-center gap-6">
                  {currentProjects.map((project) => {
                    const averageRating = calculateAverageRating(project.rating || []);
                    const mainImage = project.project_image?.[0]?.projectImage;

                    return (
                      <Link to={`/project/${project.slug}`} key={project.id}>
                        <motion.div
                          whileHover={{ y: -5 }}
                          className="hover:scale-[1.02] transition-transform duration-300 max-w-sm rounded-lg overflow-hidden shadow-lg bg-white"
                        >
                          {/* Project Image */}
                          <div className="relative h-48 w-full overflow-hidden">
                            {mainImage ? (
                              <img 
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                src={`https://api-rplsmega-master-auajf8.laravel.cloud/storage/${mainImage}`} 
                                alt={project.title}
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">Tidak ada gambar</span>
                              </div>
                            )}
                          </div>

                          {/* Project Content */}
                          <div className="p-6">
                            {/* Title and Category */}
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg leading-tight line-clamp-1">
                                {project.title}
                              </h3>
                              {project.category && (
                                <span className="text-center bg-blue-100 text-OxfordBlue text-xs p-1 rounded-full flex items-center">
                                  {getCategoryIcon(project.category.name)}
                                </span>
                              )}
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {project.description}
                            </p>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(project.created_at)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700 mr-1">
                                  {averageRating.toFixed(1)}
                                </span>
                                <span className="text-yellow-400">★</span>
                              </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mt-4">
                              <button className="w-full bg-white border border-OxfordBlue text-OxfordBlue hover:bg-OxfordBlue hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg text-sm font-semibold">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                              currentPage === pageNum
                                ? 'bg-OxfordBlue text-white border-OxfordBlue'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CreatorProfile;