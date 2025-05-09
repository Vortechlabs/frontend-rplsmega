import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../../../../services/GlobalApi';
import Loader from '../../../../components/Loader';
import Navbar from '../../../../components/Navbar';
import Slider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RatingForm from '../../../../components/RatingForm';
import CommentForm from '../../../../components/CommentForm'; 
import { useAuth } from '../../../../auth/AuthContext';
import Footer from '../../../../components/Footer';
import { FaShare, FaDownload, FaCopy, FaGithub, FaUserFriends, FaCalendarAlt, FaComment, FaStar } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import Swal from 'sweetalert2';
import defaultProfilePic from '/defaultProfile.jpg';
import YoutubeSkeleton from '../../../../components/skeleton/YoutubeSkeleton';
import { FiMessageSquare } from 'react-icons/fi';


const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 24) {
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    } else if (diffInDays === 1) {
        return 'Kemarin';
    } else if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' // Always show year in numeric format
        });
    }
};

function ProjectDetail() {
    const { slug } = useParams(); 
    const { user } = useAuth(); 
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [comments, setComments] = useState([]);
    const [showShareModal, setShowShareModal] = useState(false);
    const qrCodeRef = useRef(null);

    useEffect(() => {
        const fetchProjectDetail = async () => {
            try {
                const response = await apiClient.get(`/projects/${slug}`); 
                setProject(response.data);
                console.log(response.data)
            } catch (error) {
                setError('Project not found.');
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/projects/${slug}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchProjectDetail();
        fetchComments(); 
    }, [slug]);

    const handleCommentSubmitted = () => {
        const fetchComments = async () => {
            try {
                const response = await apiClient.get(`/projects/${slug}/comments`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    };

    const handleShareProject = () => {
        setShowShareModal(true);
    };

    // Truncate text helper
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const handleCopyLink = () => {
        const link = `http://localhost:5173/project/${slug}`;
        navigator.clipboard.writeText(link);
        Swal.fire('Link disalin!', 'Link project telah disalin ke clipboard.', 'success');
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
            downloadLink.download = `QRCode-${project.title}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!project) {
        return <p>No project data available.</p>;
    }

    
    const CustomPrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
          <button
            className={`${className} custom-arrow custom-prev`}
            style={{ ...style }}
            onClick={onClick}
            aria-label="Previous"
          >
            <span className="arrow-icon">&lt;</span>
          </button>
        );
      };
      
      const CustomNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
          <button
            className={`${className} custom-arrow custom-next`}
            style={{ ...style }}
            onClick={onClick}
            aria-label="Next"
          >
            <span className="arrow-icon">&gt;</span>
          </button>
        );
      };

      const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        adaptiveHeight: true,
        touchThreshold: 10,
        swipeToSlide: true,
        draggable: true
      };

      const handleDeleteComment = async (commentId) => {
        const confirm = await Swal.fire({
            title: 'Yakin ingin menghapus komentar ini?',
            text: 'Tindakan ini tidak dapat dibatalkan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal'
        });
    
        if (confirm.isConfirmed) {
            try {
                await apiClient.delete(`/projects/${slug}/comments/delete/${commentId}`);
                // Refresh comment list
                setComments(prev => prev.filter(c => c.id !== commentId));
                Swal.fire('Berhasil!', 'Komentar telah dihapus.', 'success');
            } catch (error) {
                console.error('Error deleting comment:', error);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus.', 'error');
            }
        }
    };
    

    const projectLink = `http://localhost:5173/project/${slug}`;

    return (
        <>
            <Navbar />
            <div className="mt-20"></div>
            
            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Project Header */}
                <div className="md:flex block justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                        <div className="flex items-center mt-2 text-gray-600">
                            <FaCalendarAlt className="mr-2" />
                            <span>{formatDate(project.created_at)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={handleShareProject}
                        className="flex items-center mt-2 gap-2 cursor-pointer bg-GoldenYellow text-white px-4 py-2 rounded-lg hover:bg-GoldenYellow-Dark transition-transform hover:scale-105  duration-200 shadow-md"
                    >
                        <FaShare /> Bagikan
                    </button>
                </div>

                {/* Project Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Media & Comments */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Media Gallery */}
                        <div className="bg-white rounded-xl  shadow-md overflow-hidden relative">
                        {project.project_image || project.videoUrl ? (
                            <Slider {...settings}>
                            {/* Video YouTube Slide */}
                            {project.videoUrl && (
                            <div key="video-slide" className="relative">
                                {loading ? (
                                <YoutubeSkeleton />
                                ) : (
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                    src={`https://www.youtube.com/embed/${
                                    project.videoUrl.includes('youtube.com/watch?v=') 
                                    ? project.videoUrl.split('v=')[1].split('&')[0]
                                    : project.videoUrl.split('/').pop()
                                    }`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full min-h-[450px] z-80"
                                    onLoad={() => setLoading(false)}
                                    onError={() => {
                                        setLoading(false);
                                        console.error('YouTube embed failed');
                                    }}
                                    frameBorder="0"
                                    />
                                </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                <p className="text-white text-center font-medium">Video Project</p>
                                </div>
                            </div>
                            )}

                            {/* Image Slides */}
                            {project.project_image?.map((image, index) => (
                                <div key={`image-${index}`} className="relative">
                                <img 
                                    src={`http://127.0.0.1:8000/storage/${image.projectImage}`} 
                                    alt={`Project Image ${index}`} 
                                    className="w-full min-h-[450px] object-cover"
                                    onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = defaultProfilePic;
                                    }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                    <p className="text-white  text-center font-medium">
                                    {image.name_image || `Gambar ${index + 1}`}
                                    </p>
                                </div>
                                </div>
                            ))}
                            </Slider>
                        ) : (
                            <div className="h-96 bg-gray-100 flex items-center justify-center">
                            <p className="text-gray-500">No media available</p>
                            </div>
                        )}
                        </div>

                        {/* Project Description */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Deskripsi Project</h2>
                            <p className="text-gray-700 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Rating Section */}
                        <div className="bg-white rounded-xl shadow-md p-6 hidden md:block">
                            <div className="flex items-center mb-4">
                                <FaStar className="text-yellow-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Rating Project</h2>
                            </div>
                            {userRating ? (
                                <p className="text-gray-700">Anda telah memberikan rating: {userRating} ⭐</p> 
                            ) : (
                                <RatingForm projectSlug={slug} onRatingSubmitted={() => setProject(prev => ({ ...prev }))} />
                            )}
                        </div>
                        

                        {/* Comments Section */}
                        <div className='hidden md:block'> 
                            <CommentForm projectId={project.id} onCommentSubmitted={handleCommentSubmitted} />
                        </div>

                    </div>

                    {/* Right Column - Project Details */}
                    <div className="space-y-6 ">
                        {/* Author Card */}
                        <Link to={`http://localhost:5173/profile/creator/${project.user.username}`}>
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                {project.user.profilePicture ? (
                                    <img 
                                        src={`http://127.0.0.1:8000/storage/${project.user.profilePicture}`} 
                                        alt="profile" 
                                        className="h-14 w-14 rounded-full object-cover mr-4"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = defaultProfilePic;
                                        }}
                                    />
                                ) : (
                                    <img 
                                        src={defaultProfilePic} 
                                        alt="profile default" 
                                        className="h-14 w-14 rounded-full object-cover mr-4"
                                    />
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900">{project.user.name}</h3>
                                    <p className="text-gray-600">{project.user.class}</p>
                                </div>
                            </div>
                        </div>
                        </Link>

                        {/* Team Members */}
                        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                            <div className="flex items-center mb-4">
                                <FaUserFriends className="text-OxfordBlue mr-2" />
                                <h3 className="font-semibold text-gray-800">Anggota Tim</h3>
                            </div>
                            <ul className="space-y-3">
                                {project.team && project.team.length > 0 ? (
                                    project.team.map((member) => (
                                        <li key={member.id} className="flex items-center">
                                            <div className="bg-purple-100 text-OxfordBlue-Dark p-2 rounded-full mr-3">
                                                <FaUserFriends className="text-sm" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{member.memberName}</p>
                                                <p className="text-xs text-gray-500">
                                                    {member.position} • {member.class}
                                                </p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">Tidak ada anggota tim</li>
                                )}
                            </ul>
                        </div>

                        {/* Repository Link */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <FaGithub className="text-gray-800 mr-2" />
                                <h3 className="font-semibold text-gray-800">Repositori</h3>
                            </div>
                            <a 
                                href={project.repository} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-block w-full"
                            >
                                <button className="w-full flex ite cursor-pointer ms-center justify-center bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-transform hover:scale-105 duration-200">
                                    <FaGithub className="mr-2" />
                                    Lihat di GitHub
                                </button>
                            </a>
                        </div>

                        {/* Additional Info Section */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Informasi Tambahan</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Kategori</p>
                                    <p className="text-gray-900">{project.category.name || 'Tidak tersedia'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Teknologi</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                    {project.technology.split(',').map((tech, index) => (
                                        <span 
                                        key={index}
                                        className="px-3 py-1 bg-OxfordBlue/10 text-OxfordBlue rounded-full text-sm"
                                        >
                                        {tech.trim()}
                                        </span>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Rating Section */}
                        <div className="bg-white rounded-xl shadow-md p-6 block md:hidden">
                            <div className="flex items-center mb-4">
                                <FaStar className="text-yellow-500 mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800">Rating Project</h2>
                            </div>
                            {userRating ? (
                                <p className="text-gray-700">Anda telah memberikan rating: {userRating} ⭐</p> 
                            ) : (
                                <RatingForm projectSlug={slug} onRatingSubmitted={() => setProject(prev => ({ ...prev }))} />
                            )}
                        </div>
                        

                        {/* Comments Form */}
                        <div className='md:hidden block'> 
                            <CommentForm projectId={project.id} onCommentSubmitted={handleCommentSubmitted} />
                        </div>
                        
                            {/* Comments Section */}
                            <div className="mt-8 p-6 shadow-md bg-white rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className='flex items-center gap-4'>
                                        <div className="bg-blue-100 p-2 rounded-full">
                                            <FiMessageSquare className="text-OxfordBlue text-xl" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                                            Comment
                                        </h3>
                                    </div>
                                    <p className='text-sm text-OxfordBlue bg-blue-100 p-1 px-2 rounded-full'>{comments.length} comment</p>
                                </div>

                                <div className="relative">
                                    <div className="space-y-6 max-h-96 py-6 overflow-y-auto pr-2 custom-scrollbar">
                                        {comments.length > 0 ? (
                                            comments.map((comment, index) => (
                                                <div
                                                    key={comment.id}
                                                    className={`relative group bg-gradient-to-tr from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 ${comment.isNew ? 'animate-pulse' : ''}`}
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="relative">
                                                            <img
                                                                src={comment.user?.profilePicture
                                                                    ? `http://127.0.0.1:8000/storage/${comment.user.profilePicture}`
                                                                    : defaultProfilePic}
                                                                alt="profile"
                                                                className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ring-OxfordBlue group-hover:ring-OxfordBlue-Dark transition duration-300"
                                                            />
                                                            <span className="absolute -top-1 -right-1 bg-GoldenYellow-Dark text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                                #{comments.length - index}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-semibold text-gray-900">{truncateText(comment.user.name, 15)}</h4>
                                                                <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                                                            </div>
                                                            <div className="mt-2 text-sm text-gray-700 leading-relaxed bg-gray-100 rounded-md px-4 py-2 relative">
                                                                {comment.content}

                                                                {/* Tombol Hapus */}
                                                                {user && user[0].id === comment.userId && (
                                                                    <button
                                                                        onClick={() => handleDeleteComment(comment.id)}
                                                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs"
                                                                        title="Hapus komentar"
                                                                    >
                                                                        Hapus
                                                                    </button>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-8">
                                                <p className="text-base">Belum ada komentar.</p>
                                                <p className="text-sm">Jadilah yang pertama untuk berkomentar! 🚀</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent z-10" />
                                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent z-10" />
                                </div>
                            </div>

                    </div>
                </div>
            </div>

            {/* Share Project Modal */}
            {showShareModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/20 backdrop-blur-lg">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">Bagikan Project</h2>
                        
                        <div ref={qrCodeRef} className="flex justify-center mb-6">
                            <QRCodeSVG  
                                value={projectLink}
                                size={200}
                                level="H"
                                includeMargin={true}
                                fgColor="#1f2937"
                            />
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-2 text-gray-700">Link Project:</p>
                            <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <p className="text-sm truncate flex-grow text-gray-700">{projectLink}</p>
                                <button 
                                    onClick={handleCopyLink}
                                    className="ml-3 text-gray-700 hover:text-bg-GoldenYellow transition-colors"
                                    title="Salin link"
                                >
                                    <FaCopy />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={downloadQRCode}
                                className="flex-1 flex items-center justify-center gap-2 bg-GoldenYellow text-white px-4 py-2 rounded-lg hover:bg-GoldenYellow-Dark transition duration-200"
                            >
                                <FaDownload /> Unduh QR
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default ProjectDetail;