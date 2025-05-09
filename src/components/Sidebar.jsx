import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaUsers, FaProjectDiagram, 
  FaSignOutAlt, FaBars, FaTimes,
  FaSpinner
} from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { FiAlertTriangle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import apiClient from '../services/GlobalApi';
import logo from '/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar() {
  const { logout, user, token } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth/admin/login');
    }
  }, [user, navigate]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(prev => !prev);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setIsLoggingOut(true);
    
    try {
      // Animation delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiClient.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        logout();
        navigate('/auth/admin/login');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          background: '#fff',
          color: '#000000',
        });
      }
    } catch (e) {
      Swal.fire('Error', e.response ? e.response.data.message : e.message, 'error');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { 
      to: '/admin', 
      icon: <FaHome className="text-lg" />, 
      text: 'Dashboard',
      end: true
    },
    { 
      to: '/admin/manage-users', 
      icon: <FaUsers className="text-lg" />, 
      text: 'Users'
    },
    { 
      to: '/admin/manage-projects', 
      icon: <FaProjectDiagram className="text-lg" />, 
      text: 'Projects'
    },
    { 
      to: '/admin/manage-alerts', 
      icon: <FiAlertTriangle className="text-lg" />, 
      text: 'Alerts'
    }
  ];

  // Animation variants
  const menuItem = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  const logoutButton = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {/* Mobile header with hamburger */}
      {isMobile && (
        <div className='fixed z-50 lg:hidden bg-[#060A23] w-full p-4 shadow-md'>
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <FaBars className="w-6 h-6" />
              )}
            </button>
            <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
            <div className="w-6"></div>
          </div>
        </div>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-2xl bg-white/20 transition bg-opacity-20 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-[calc(100vh-20px)] w-full max-w-[280px] my-[10px] ml-[10px] 
        bg-[#060A23] overflow-hidden flex flex-1 rounded-[20px] z-40
        transition-all duration-300
        ${isMobile ? 
          `transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}` : 
          'w-[280px]'
        }
      `}>
        <div className="scroll-container flex w-full hide-scrollbar">
          <nav className="flex flex-col w-full h-fit p-[30px] gap-10 z-10">
            {/* Logo/Brand area */}
            <Link to="/admin" className="flex items-center justify-center">
              <img src={logo} alt="logo" className='h-20 brightness-0 invert-[1] contrast-200 -my-5'/>
            </Link>

            {/* Navigation items */}
            <ul className="flex flex-col gap-4">
              <p className="font-semibold text-xs leading-[18px] text-white">UMUM</p>
              {navItems.map((item) => (
                <motion.li 
                  key={item.to}
                  variants={menuItem}
                  initial="hidden"
                  animate="show"
                  transition={{ duration: 0.3 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={handleNavClick}
                    className={({ isActive }) => `
                      flex items-center gap-3 w-full rounded-full border p-[14px_20px] 
                      transition-all duration-300 
                      ${isActive ? 
                        'bg-OxfordBlue-Dark border-OxfordBlue shadow-[-10px_-6px_10px_0_#0a368e_inset]' : 
                        'bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset] hover:bg-OxfordBlue-Dark hover:border-OxfordBlue hover:shadow-[-10px_-6px_10px_0_#0a368e_inset]'
                      }
                      ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                    `}
                  >
                    <span className="text-white">{item.icon}</span>
                    {isSidebarOpen && (
                      <span className="font-semibold text-white">{item.text}</span>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            {/* Others section */}
            <ul className="flex flex-col gap-4">
              <p className="font-semibold text-xs leading-[18px] text-white">LAINNYA</p>
              <motion.li
                variants={menuItem}
                initial="hidden"
                animate="show"
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => setShowLogoutConfirm(true)}
                  className={`
                    flex items-center gap-3 w-full rounded-full border p-[14px_20px] 
                    transition-all duration-300 
                    bg-[#070B24] border-[#24283E] shadow-[-10px_-6px_10px_0_#181A35_inset] 
                    hover:bg-OxfordBlue-Dark hover:border-OxfordBlue hover:shadow-[-10px_-6px_10px_0_#0a368e_inset]
                    ${isSidebarOpen ? 'justify-start' : 'justify-center'}
                  `}
                  variants={logoutButton}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <FaSignOutAlt className="text-white text-lg" />
                  {isSidebarOpen && (
                    <span className="font-semibold text-white">Logout</span>
                  )}
                </motion.button>
              </motion.li>
            </ul>
          </nav>
        </div>

        {/* Logout Confirmation Modal */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div 
              className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-OxfordBlue-Dark  p-6 rounded-xl border border-OxfordBlue max-w-md w-full mx-4"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
                
                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-500 text-gray-300 hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center justify-center transition-colors"
                    disabled={isLoggingOut}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoggingOut ? (
                      <>
                        <motion.span
                          className="mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <FaSpinner />
                        </motion.span>
                        Logging Out...
                      </>
                    ) : (
                      'Log Out'
                    )}
                  </motion.button>
                </div>
                
                {/* Progress bar for logout */}
                {isLoggingOut && (
                  <motion.div 
                    className="mt-4 h-1 bg-gray-700  rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5 }}
                  >
                    <motion.div 
                      className="h-full bg-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </>
  );
}

export default Sidebar;