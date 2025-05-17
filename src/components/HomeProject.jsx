import React, { useEffect, useState } from 'react';
import apiClient from '../services/GlobalApi';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import { 
  FaGlobe, 
  FaMobileAlt, 
  FaDesktop, 
  FaPalette,
  FaCode
} from 'react-icons/fa';

const truncateString = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
};

const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) return 0; 
    let total = 0;
    for (let i = 0; i < ratings.length; i++) {
        total += ratings[i].score; 
    }
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

function HomeProject() {
    const [projects, setProjects] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const response = await apiClient.get('/projects'); 
                if (response.data && response.data.length > 0) {
                    setProjects(response.data); 
                } else {
                    setError('Tidak ada karya yang valid.'); 

                }

            } catch (error) {
                setError(error.message); 
            } finally {
                setLoading(false); 
            }
        };

        fetchProjectData();
    }, []);

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

    if (loading) {
        return (
            <div className='py-40'>
                <Loader />
            </div>
        ); 
    }

if (error) {
    return (
        <div className="px-4 md:px-20 py-8">
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Info: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
    );
}

    if (projects.length === 0) {
        return (
            <div className="px-4 md:px-20 py-8">
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Info: </strong>
                    <span className="block sm:inline">Tidak ada karya yang valid.</span>
                </div>
            </div>
        );
    }

    const recentProjects = projects.slice(0, 6);

    return (
        <div className="px-4 md:px-20">
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-2">
                {recentProjects.map((project) => {
                    const averageRating = calculateAverageRating(project.rating);

                    return (
                    <Link to={`/project/${project.slug}`}>
                        <div 
                            key={project.id} 
                            className="hover:scale-[1.02] transition-transform duration-300 max-w-sm rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 w-full overflow-hidden">
                                {project.project_image && project.project_image.length > 0 ? (
                                    <img 
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        src={`https://api-rplsmega-master-auajf8.laravel.cloud/storage/${project.project_image[0].projectImage}`} 
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
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Title and Category */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight">
                                        {truncateString(project.title, 30)}
                                    </h3>
                                    {project.category && (
                                    <span className=" text-center bg-blue-100  text-OxfordBlue text-xs  p-1 rounded-full flex items-center">
                                        {getCategoryIcon(project.category.name)}
                                    </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4  flex-grow">
                                    {truncateString(project.description, 100)}
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
                        </div>
                    </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default HomeProject;