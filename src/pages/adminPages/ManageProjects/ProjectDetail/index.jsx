import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaUsers,
  FaCode,
  FaLink,
  FaCalendarAlt,
  FaShare,
  FaStar,
  FaCopy,
  FaDownload,
  FaUserFriends,
  FaMobileAlt,
  FaDesktop,
  FaPalette,
  FaGithub,
  FaGlobe,
  FaYoutube,
  FaCodepen,
  FaGitlab,
  FaBitbucket,
  FaGoogleDrive,
  FaDropbox,
  FaMicrosoft,
  FaFigma,
  FaTrello,
  FaSlack,
  FaDiscord,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaMedium,
  FaWordpress,
  FaShopify,
  FaAmazon,
  FaSpotify,
  FaSoundcloud,
  FaVimeo,
  FaTwitch,
  FaSketch,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge,
  FaOpera,
  FaAndroid,
  FaApple,
  FaWindows,
  FaLinux,
  FaDocker,
  FaJenkins,
  FaAws,
  FaArrowAltCircleRight,
  FaCube,
  FaPrint,
  FaShoppingCart,
  FaIndustry,
  FaDollarSign,
  FaChartLine,
  FaDribbble,
  FaBehance,
} from "react-icons/fa";
import {
  SiCanva, // Ikon Canva
  SiNotion,
  SiZoom, // Ikon Zoom
} from "react-icons/si";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../../../services/GlobalApi";
import Sidebar from "../../../../components/Sidebar";
import Loader from "../../../../components/Loader";
import defaultProfilePic from "/defaultProfile.jpg";
import YoutubeSkeleton from "../../../../components/skeleton/YoutubeSkeleton";
import CommentForm from "../../../../components/CommentForm";
import RatingForm from "../../../../components/RatingForm";
import { FiMessageSquare } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../../../../auth/AuthContext";

const detectPlatform = (url) => {
  if (!url) return { platform: "unknown", name: "Link", icon: <FaGlobe /> };

  const platformPatterns = [
    // Development & Design
    { pattern: /github\.com/i, name: "GitHub", icon: <FaGithub /> },
    { pattern: /gitlab\.com/i, name: "GitLab", icon: <FaGitlab /> },
    { pattern: /bitbucket\.org/i, name: "Bitbucket", icon: <FaBitbucket /> },
    { pattern: /figma\.com/i, name: "Figma", icon: <FaFigma /> },
    { pattern: /codepen\.io/i, name: "CodePen", icon: <FaCodepen /> },
    { pattern: /dribbble\.com/i, name: "Dribbble", icon: <FaDribbble /> },
    { pattern: /behance\.net/i, name: "Behance", icon: <FaBehance /> },
    { pattern: /sketch\.com/i, name: "Sketch", icon: <FaSketch /> },
    //{ pattern: /adobe\.com/i, name: 'Adobe', icon: <FaAdobe /> },

    // Cloud Storage
    {
      pattern: /drive\.google\.com/i,
      name: "Google Drive",
      icon: <FaGoogleDrive />,
    },
    { pattern: /dropbox\.com/i, name: "Dropbox", icon: <FaDropbox /> },
    {
      pattern: /onedrive\.live\.com/i,
      name: "OneDrive",
      icon: <FaMicrosoft />,
    },

    // Video Platforms
    {
      pattern: /youtube\.com|youtu\.be/i,
      name: "YouTube",
      icon: <FaYoutube />,
    },
    { pattern: /vimeo\.com/i, name: "Vimeo", icon: <FaVimeo /> },
    { pattern: /twitch\.tv/i, name: "Twitch", icon: <FaTwitch /> },

    // Social Media
    { pattern: /twitter\.com|x\.com/i, name: "Twitter", icon: <FaTwitter /> },
    { pattern: /facebook\.com/i, name: "Facebook", icon: <FaFacebook /> },
    { pattern: /instagram\.com/i, name: "Instagram", icon: <FaInstagram /> },
    { pattern: /linkedin\.com/i, name: "LinkedIn", icon: <FaLinkedin /> },
    { pattern: /pinterest\.com/i, name: "Pinterest", icon: <FaPinterest /> },
    { pattern: /reddit\.com/i, name: "Reddit", icon: <FaReddit /> },

    // Productivity
    { pattern: /notion\.so/i, name: "Notion", icon: <SiNotion /> },
    { pattern: /trello\.com/i, name: "Trello", icon: <FaTrello /> },
    { pattern: /canva\.com/i, name: "Canva", icon: <SiCanva /> },

    // Communication
    { pattern: /slack\.com/i, name: "Slack", icon: <FaSlack /> },
    { pattern: /discord\.com/i, name: "Discord", icon: <FaDiscord /> },
    { pattern: /zoom\.us/i, name: "Zoom", icon: <SiZoom /> },

    // Blogging & CMS
    { pattern: /medium\.com/i, name: "Medium", icon: <FaMedium /> },
    { pattern: /wordpress\.com/i, name: "WordPress", icon: <FaWordpress /> },

    // E-commerce
    { pattern: /shopify\.com/i, name: "Shopify", icon: <FaShopify /> },
    { pattern: /amazon\.com/i, name: "Amazon", icon: <FaAmazon /> },

    // Music
    { pattern: /spotify\.com/i, name: "Spotify", icon: <FaSpotify /> },
    { pattern: /soundcloud\.com/i, name: "SoundCloud", icon: <FaSoundcloud /> },

    // Browsers
    { pattern: /chrome\.google\.com/i, name: "Chrome", icon: <FaChrome /> },
    { pattern: /mozilla\.org/i, name: "Firefox", icon: <FaFirefox /> },
    { pattern: /apple\.com\/safari/i, name: "Safari", icon: <FaSafari /> },
    { pattern: /microsoft\.com\/edge/i, name: "Edge", icon: <FaEdge /> },
    { pattern: /opera\.com/i, name: "Opera", icon: <FaOpera /> },

    // OS
    { pattern: /android\.com/i, name: "Android", icon: <FaAndroid /> },
    { pattern: /apple\.com/i, name: "Apple", icon: <FaApple /> },
    { pattern: /microsoft\.com/i, name: "Windows", icon: <FaWindows /> },
    { pattern: /linux\.org/i, name: "Linux", icon: <FaLinux /> },

    // DevOps
    { pattern: /docker\.com/i, name: "Docker", icon: <FaDocker /> },
    { pattern: /jenkins\.io/i, name: "Jenkins", icon: <FaJenkins /> },
    { pattern: /aws\.amazon\.com/i, name: "AWS", icon: <FaAws /> },

    // 3D Platforms
    { pattern: /sketchfab\.com/i, name: "Sketchfab", icon: <FaCube /> },
    { pattern: /thingiverse\.com/i, name: "Thingiverse", icon: <FaPrint /> },
    { pattern: /cults3d\.com/i, name: "Cults3D", icon: <FaShoppingCart /> },
    {
      pattern: /myminifactory\.com/i,
      name: "MyMiniFactory",
      icon: <FaIndustry />,
    },
    { pattern: /turbosquid\.com/i, name: "TurboSquid", icon: <FaDollarSign /> },
    { pattern: /cgtrader\.com/i, name: "CGTrader", icon: <FaChartLine /> },
  ];

  const matchedPlatform = platformPatterns.find(({ pattern }) =>
    pattern.test(url)
  );

  return (
    matchedPlatform || {
      platform: "website",
      name: new URL(url).hostname.replace("www.", "").split(".")[0],
      icon: <FaArrowAltCircleRight />,
    }
  );
};

const ProjectDetailAdmin = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Kemarin";
    } else if (diffInDays < 7) {
      return `${diffInDays} hari yang lalu`;
    } else {
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiClient.get(`/projects/${slug}`);

        setProject(response.data);
      } catch (error) {
        Swal.fire("Error!", "Gagal memuat detail Karya", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/projects/${slug}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchProject();
    fetchComments();
  }, [slug]);

  const handleCommentSubmitted = () => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get(`/projects/${slug}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getCategoryIcon = (categoryName) => {
    const iconStyle = "text-sm";
    switch (categoryName.toLowerCase()) {
      case "website":
        return <FaGlobe className={`${iconStyle} text-OxfordBlue`} />;
      case "mobile app":
        return <FaMobileAlt className={`${iconStyle} text-OxfordBlue`} />;
      case "desktop app":
        return <FaDesktop className={`${iconStyle} text-OxfordBlue`} />;
      case "design":
        return <FaPalette className={`${iconStyle} text-OxfordBlue`} />;
      default:
        return <FaCode className={`${iconStyle} text-OxfordBlue`} />;
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Hapus Karya Ini?",
      text: "Anda tidak bisa mengembalikan data yang sudah dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Hapus!",
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/projects/${project.id}`);
        toast.success(
          "Karya berhasil dihapus. Mengarahkan ke halaman kelola karya...",
          {
            autoClose: 3000, // Toast akan menutup setelah 3 detik
            onClose: () => {
              navigate("/admin/manage-projects");
            },
          }
        );
      } catch (error) {
        toast.error("Gagal menghapus Karya");
      }
    }
  };

  const handleCopyLink = () => {
    const link = `https://rplsmega.netlify.app/project/${slug}`;
    navigator.clipboard.writeText(link);
    Swal.fire(
      "Tautan disalin!",
      "Tautan karya telah disalin ke clipboard.",
      "success"
    );
  };

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    const svg = qrCodeRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `QRCode-${project.title}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

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
    draggable: true,
  };

  const getYouTubeId = (url) => {
    if (!url) return null;

    // Handle berbagai format URL YouTube
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus komentar ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await apiClient.delete(
          `/projects/${slug}/comments/delete/${commentId}`
        );
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        Swal.fire("Berhasil!", "Komentar telah dihapus.", "success");
      } catch (error) {
        console.error("Error deleting comment:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  const videoId = project ? getYouTubeId(project.videoUrl) : null;

  const projectLink = `https://rplsmega.netlify.app/project/${slug}`;

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <div className="p-6 md:p-8 min-h-screen">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 *:after:content-['/'] *:after:ml-1 mb-6">
            <Link to="/admin" className="hover:text-OxfordBlue">
              Dashboard
            </Link>
            <Link to="/admin/manage-projects" className="hover:text-OxfordBlue line-clamp-1">
              Kelola karya
            </Link>
            <span className="font-semibold text-OxfordBlue line-clamp-1">
              {truncateText(project.title, 10)}
            </span>
          </div>

          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <FaCalendarAlt className="mr-2" />
                <span>
                  {new Date(project.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Share Button */}
              <motion.button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 bg-OxfordBlue text-white px-4 py-2 rounded-lg"
                whileHover={{
                  y: -2,
                  scale: 1.05,
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                whileTap={{
                  scale: 0.98,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 10,
                }}
              >
                <motion.span
                  whileHover={{ rotate: [0, 15, -5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <FaShare />
                </motion.span>
                <motion.span
                  whileHover={{ x: [0, 2, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  Bagikan
                </motion.span>
              </motion.button>

              {/* Edit Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link
                  to={`/admin/manage-projects/edit/${slug}`}
                  className="flex items-center gap-2 bg-GoldenYellow text-white px-4 py-2 rounded-lg"
                >
                  <motion.span
                    animate={{ rotate: 0 }}
                    whileHover={{ rotate: [0, 10, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaEdit />
                  </motion.span>
                  <motion.span
                    whileHover={{
                      x: [0, 3, 0],
                      textShadow: "0 0 4px rgba(255,255,255,0.5)",
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    Edit
                  </motion.span>
                </Link>
              </motion.div>

              {/* Delete Button */}
              <motion.button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg relative overflow-hidden"
                whileHover={{
                  y: -2,
                  scale: 1.05,
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {/* Button content */}
                <motion.span
                  whileHover={{ rotate: [0, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <FaTrash />
                </motion.span>
                <motion.span
                  whileHover={{ x: [0, 3, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  Hapus
                </motion.span>

                {/* Pulsing warning effect */}
                <motion.span
                  className="absolute inset-0 bg-red-700 opacity-0 rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: [0, 0.2, 0],
                    transition: { duration: 1.5, repeat: Infinity },
                  }}
                />
              </motion.button>
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Media Slider */}
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
                                project.videoUrl.includes(
                                  "youtube.com/watch?v="
                                )
                                  ? project.videoUrl
                                      .split("v=")[1]
                                      .split("&")[0]
                                  : project.videoUrl.split("/").pop()
                              }`}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full min-h-96"
                              onLoad={() => setLoading(false)}
                              onError={() => {
                                setLoading(false);
                                console.error("YouTube embed failed");
                              }}
                              frameBorder="0"
                            />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <p className="text-white text-center font-medium">
                            Video demo
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Image Slides */}
                    {project.project_image?.map((image, index) => (
                      <div key={`image-${index}`} className="relative">
                        <img
                          src={`https://apirpl.smkn1purbalingga.sch.id/${image.projectImage}`}
                          alt={`Project Image ${index}`}
                          className="w-full min-h-96 object-cover"
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
                    <p className="text-gray-500">Tidak ada media tersedia.</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Deskripsi Karya</h2>
                <p className="text-gray-700">{project.description}</p>
              </div>

              {/* Rating Section */}
              <div className="bg-white rounded-xl shadow-md p-6 hidden md:block">
                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Rating Karya
                  </h2>
                </div>
                {userRating ? (
                  <p className="text-gray-700">
                    Anda telah memberikan rating: {userRating} ⭐
                  </p>
                ) : (
                  <RatingForm
                    projectSlug={slug}
                    onRatingSubmitted={() =>
                      setProject((prev) => ({ ...prev }))
                    }
                  />
                )}
              </div>

              {/* Comments Section */}
              <div className="hidden md:block">
                <CommentForm
                  projectId={project.id}
                  onCommentSubmitted={handleCommentSubmitted}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Author Card */}
              <Link to={`/profile/creator/${project.user.username}`}>
                <div className="bg-white rounded-xl shadow-md p-6 mb-4">
                  <div className="flex items-center">
                    {project.user.profilePicture ? (
                      <img
                        src={`https://apirpl.smkn1purbalingga.sch.id/storage/${project.user.profilePicture}`}
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
                      <h3 className="font-bold text-gray-900">
                        {project.user.name}
                      </h3>
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
                          <p className="font-medium text-gray-900">
                            {member.memberName}
                          </p>
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

              {/* Links */}
                          <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                {project.repository && detectPlatform(project.repository).icon}
                <h3 className="font-semibold text-gray-800 ml-2">
                  Tautan Karya
                </h3>
              </div>
              {project.repository ? (
                <a
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <button className="w-full flex items-center justify-center bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-transform hover:scale-105 duration-200">
                    {detectPlatform(project.repository).icon}
                    <span className="ml-2">
                      Lihat di {detectPlatform(project.repository).name}
                    </span>
                  </button>
                </a>
              ) : (
                <p className="text-gray-500">Tidak ada tautan karya</p>
              )}
            </div>

              {/* Additional Info Section */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Informasi Tambahan
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Kategori
                    </p>
                    <p className="text-gray-900 flex items-center gap-2">
                      <span>{getCategoryIcon(project.category?.name)}</span>
                      {project.category.name || "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Teknologi
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.technology.split(",").map((tech, index) => (
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
                  <h2 className="text-xl font-semibold text-gray-800">
                    Rating Karya
                  </h2>
                </div>
                {userRating ? (
                  <p className="text-gray-700">
                    Anda telah memberikan rating: {userRating} ⭐
                  </p>
                ) : (
                  <RatingForm
                    projectSlug={slug}
                    onRatingSubmitted={() =>
                      setProject((prev) => ({ ...prev }))
                    }
                  />
                )}
              </div>

              {/* Comments Form */}
              <div className="md:hidden block">
                <CommentForm
                  projectId={project.id}
                  onCommentSubmitted={handleCommentSubmitted}
                />
              </div>

              {/* Comments Section */}
              <div className="mt-8 p-6 shadow-md bg-white rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FiMessageSquare className="text-OxfordBlue text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 tracking-tight">
                      Komentar
                    </h3>
                  </div>
                  <p className="text-sm text-OxfordBlue bg-blue-100 p-1 px-2 rounded-full">
                    {comments.length} comment
                  </p>
                </div>

                <div className="relative">
                  <div className="space-y-6 max-h-96 py-6 overflow-y-auto pr-2 custom-scrollbar">
                    {comments.length > 0 ? (
                      comments.map((comment, index) => (
                        <div
                          key={comment.id}
                          className={`relative group bg-gradient-to-tr from-white to-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 ${
                            comment.isNew ? "animate-pulse" : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <img
                                src={
                                  comment.user?.profilePicture
                                    ? `https://apirpl.smkn1purbalingga.sch.id/storage/${comment.user.profilePicture}`
                                    : defaultProfilePic
                                }
                                alt="profile"
                                className="h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ring-OxfordBlue group-hover:ring-OxfordBlue-Dark transition duration-300"
                              />
                              <span className="absolute -top-1 -right-1 bg-GoldenYellow-Dark text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                #{comments.length - index}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {truncateText(comment.user.name, 15)}
                                </h4>
                                <span className="text-xs text-gray-400">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <div className="mt-2 text-sm text-gray-700 leading-relaxed bg-gray-100 rounded-md px-4 py-2">
                                {comment.content}

                                {/* Tombol Hapus */}
                                {(user?.id_user === comment.user?.user_id ||
                                  user?.role === "admin") && (
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(comment.id)
                                    }
                                    className="text-red-600 hover:text-red-800 ml-2"
                                  >
                                    <FaTrash />
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
                        <p className="text-sm">
                          Jadilah yang pertama untuk berkomentar! 🚀
                        </p>
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
      </div>

      {/* Share Project Modal */}
      {showShareModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/20 backdrop-blur-lg">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">
              Bagikan Karya
            </h2>

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
              <p className="text-sm font-medium mb-2 text-gray-700">
                Link Karya:
              </p>
              <div className="flex items-center bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm truncate flex-grow text-gray-700">
                  {projectLink}
                </p>
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
    </div>
  );
};

export default ProjectDetailAdmin;
