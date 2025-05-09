import React, { useEffect, useState } from 'react';
import apiClient from '../../../services/GlobalApi';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Loader from '../../../components/Loader';
import defaultProfilePic from '/defaultProfile.jpg';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Waves from '../../../components/Waves/Waves'

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
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
    }
    return 'Baru Saja';
};

function CreatorProfile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get(`/users/creator/${username}`);
        setUser(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col  items-center justify-center min-h-screen bg-gray-50 p-4">
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
            transition={{ duration: 0.4 }}
            className="bg-OxfordBlue rounded-xl shadow-sm overflow-hidden mb-10 border border-gray-200"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Picture */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={user.profilePicture 
                      ? `http://127.0.0.1:8000/storage/${user.profilePicture}`
                      : defaultProfilePic}
                    alt={`${user.name}'s profile`}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfilePic;
                    }}
                  />
                </div>
                
                {/* Profile Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <p className="text-gray-200 -mt-2">@{user.username}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="inline-flex items-center bg-gray-100 rounded-full px-4 py-1">
                      <span className="text-sm text-gray-800">
                        Kelas <span className="font-semibold">{user.class}</span> • SMKN 1 Purbalingga
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-300">
                      Bergabung sejak {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

            {/* Projects Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Karya</h2>
                <span className="text-sm text-gray-500">
                  {user.project?.length || 0} Proyek
                </span>
              </div>

              {user.project && user.project.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {user.project.map((project) => (
                    <motion.div 
                      key={project.id}
                      whileHover={{ y: -3 }}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    >
                      {/* Project Image */}
                      {project.project_image && project.project_image.length > 0 ? (
                        <div className="h-48 overflow-hidden bg-gray-100">
                          <img
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            src={`http://127.0.0.1:8000/storage/${project.project_image[0].projectImage}`}
                            alt={project.project_image[0].name_image}
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400">Tidak ada gambar</span>
                        </div>
                      )}
                      
                      {/* Project Content */}
                      <div className="p-5">
                        <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
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
                                    {calculateAverageRating(project.rating).toFixed(1)}
                                </span>
                                <span className="text-yellow-400">★</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                          <Link
                            to={`/project/${project.slug}`}
                            className="inline-flex items-center text-sm px-3 py-1.5 bg-GoldenYellow-Dark text-white rounded-lg hover:bg-GoldenYellow transition-colors"
                          >
                            Lihat Detail
                            <FaArrowRight className="ml-2" size={12} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-xl p-8 text-center border border-gray-200"
                >
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Belum ada proyek</h3>
                  <p className="text-gray-600">
                    Pengguna ini belum mengunggah proyek apapun
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default CreatorProfile;