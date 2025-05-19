import React, { useEffect, useState } from 'react';
import apiClient from '../services/GlobalApi';
import Loader from './Loader';
import { Link } from 'react-router-dom';
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
    FaCode
} from 'react-icons/fa';

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

function ShowcaseCard() {
    const [projects, setProjects] = useState([]); 
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 12;
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isRatingOpen, setIsRatingOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectsResponse, categoriesResponse] = await Promise.all([
                    apiClient.get('/projects'),
                    apiClient.get('/categories')
                ]);

                if (projectsResponse.data) {
                    setProjects(projectsResponse.data);
                } else {
                    setError('No projects found.');
                }

                if (categoriesResponse.data) {
                    setCategories(categoriesResponse.data);
                }
            } catch (error) {
                setError(error.message || 'Failed to fetch data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
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
    

    const filteredProjects = projects.filter((project) => {
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
        const avgRating = calculateAverageRating(project.rating);
        let matchesRating = true;
        
        if (filterCriteria === 'high-rating') {
            matchesRating = avgRating >= 4;
        } else if (filterCriteria === 'low-rating') {
            matchesRating = avgRating < 4;
        }
        
        return matchesSearch && matchesCategory && matchesRating;
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
        return (
            <div className='py-40 x-80 h-screen w-screen'>
                <Loader />
            </div>
        ); 
    }

    if (error) {
        return (
            <div className="px-4 md:px-20 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error! </strong>
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

    return (
        <div className="px-4 md:px-20">
            {/* Search and Filter Section - Vibrant Modern Design */}
            <div className="mb-10">
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input with floating label effect */}
                <div className="relative flex-1 group">
                <div className="absolute z-20 inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-OxfordBlue">
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
                    Jelajahi karya...
                </label>
                </div>

                {/* Filter Dropdowns with custom options */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Rating Filter - Custom Component */}
                <div className="relative group flex-1">
                <div className="absolute z-20 inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-OxfordBlue">
                    <FaStar className="transition-transform duration-300 group-focus-within:scale-110" />
                </div>
                
                {/* Custom Select Trigger */}
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

                {/* Custom Dropdown */}
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

                {/* Custom Select Category */}
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

                {/* Dropdown Menu */}
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
                    <h3 className="text-lg font-medium text-gray-900">Tidak ada karya yang ditemukan</h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Coba sesuaikan kriteria penelusuran atau filter Anda
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 justify-center gap-6">
                        {currentProjects.map((project) => {
                            const averageRating = calculateAverageRating(project.rating);
                            const mainImage = project.project_image?.[0]?.projectImage;

                            return (
                                
                                <Link to={`/project/${project.slug}`}>
                                <div 
                                    key={project.id} 
                                    className="hover:scale-[1.02] transition-transform duration-300 max-w-sm rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full"
                                >
                                    {/* Project Image */}
                                    <div className="relative h-48 w-full overflow-hidden">
                                        {mainImage ? (
                                            <img 
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                src={`https://apirpl.smkn1purbalingga.sch.id/storage/${mainImage}`} 
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
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <nav className="inline-flex rounded-md shadow">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                {/* Page Numbers */}
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

                                {/* Next Button */}
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
    );
}

export default ShowcaseCard;