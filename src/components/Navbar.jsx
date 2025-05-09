import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DefaultProfile from '/defaultProfile.jpg';
import Swal from 'sweetalert2';
import apiClient from '../services/GlobalApi';
import logo from '/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaSpinner, FaTachometerAlt, FaUser } from 'react-icons/fa';

function Navbar() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const userInfoRef = useRef(null);
    
    const handleLogOut = async (event) => {
        event.preventDefault();
        setIsLoggingOut(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const response = await apiClient.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                logout();
                navigate('/');
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Kamu berhasil keluar',
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
        }
    };
    
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const toggleUserInfo = () => {
        setShowUserInfo(!showUserInfo);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (userInfoRef.current && !userInfoRef.current.contains(event.target)) {
            setShowUserInfo(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuVariants = {
        open: { 
            opacity: 1,
            y: 0,
            transition: { 
                staggerChildren: 0.1, 
                delayChildren: 0.2,
                type: "spring",
                stiffness: 300,
                damping: 24
            } 
        },
        closed: { 
            opacity: 0,
            y: -20,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1,
                when: "afterChildren"
            } 
        }
    };

    const itemVariants = {
        open: { 
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        },
        closed: { opacity: 0, y: -20 }
    };

    const navLinkHover = {
        scale: 1.05,
        textShadow: "0 0 8px rgba(251, 191, 36, 0.5)"
    };

    return (
        <nav className='fixed bg-white w-screen top-0 p-4 z-50 shadow-lg'>
            <div className='w-full flex justify-between items-center px-8'>
                <motion.div 
                    className='flex items-center'
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <img src={logo} alt="logo" className='h-10'/>
                </motion.div>

                <div className='flex items-center gap-4'>
                    <div className='hidden md:flex gap-6'>
                        <motion.div whileHover={navLinkHover}>
                            <NavLink 
                                to='/' 
                                className={({ isActive }) => 
                                    (isActive 
                                        ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-8' 
                                        : 'text-OxfordBlue hover:text-OxfordBlue-Dark transition duration-300'
                                    )
                                }
                            >
                                Beranda
                            </NavLink>
                        </motion.div>
                        
                        <motion.div whileHover={navLinkHover}>
                            <NavLink 
                                to='/projects' 
                                className={({ isActive }) => 
                                    (isActive 
                                        ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-8' 
                                        : 'text-OxfordBlue hover:text-OxfordBlue-Dark transition duration-300'
                                    )
                                }
                            >
                                Proyek
                            </NavLink>
                        </motion.div>
                        
                        <motion.div whileHover={navLinkHover}>
                            <NavLink 
                                to='/about' 
                                className={({ isActive }) => 
                                    (isActive 
                                        ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-8' 
                                        : 'text-OxfordBlue hover:text-OxfordBlue-Dark transition duration-300'
                                    )
                                }
                            >
                                Tentang
                            </NavLink>
                        </motion.div>
                    </div>
                </div>

                <div className='flex items-center gap-4'>

                    {user ? (
                    <div className='flex items-center relative'>
                        <div className='relative inline-block'>
                            <motion.button 
                                onClick={toggleUserInfo} 
                                className="flex items-center text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="relative mr-2 h-[30px] w-[30px] rounded-full">
                                    <motion.img
                                        src={
                                            user[0].profilePicture
                                            ? `http://127.0.0.1:8000/storage/${user[0].profilePicture}`
                                            : DefaultProfile
                                        }
                                        alt="Profile"
                                        className="h-full w-full rounded-full object-cover object-center"
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    />
                                    <motion.span 
                                        className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-GoldenYellow"
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            opacity: [0.8, 1, 0.8]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    ></motion.span>
                                </div>
                                <span className="text-base font-medium text-OxfordBlue">
                                    {user[0].role === 'moderator' ? 'Admin' : truncateText(user[0].name, 10)}
                                </span>
                            </motion.button>
                            
                            <AnimatePresence>
                                {showUserInfo && (
                                    <motion.div 
                                        ref={userInfoRef} 
                                        className="absolute right-0 top-full mt-2 z-40 w-[200px] space-y-1 rounded-lg bg-white p-2 shadow-xl border border-gray-100"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {user[0].role === 'moderator' ? (
                                            <>
                                                <motion.div whileHover={{ x: 5 }}>
                                                    <NavLink 
                                                        to="/admin" 
                                                        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm text-body-color hover:bg-gray-100 transition-colors duration-200"
                                                        onClick={() => setShowUserInfo(false)}
                                                    >
                                                        <FaTachometerAlt className='text-OxfordBlue'/> Dashboard
                                                    </NavLink>
                                                </motion.div>
                                                
                                                <motion.div 
                                                    whileHover={{ x: 5 }}
                                                    className="relative"
                                                >
                                                    <button 
                                                        onClick={handleLogOut} 
                                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body-color hover:bg-gray-100 transition-colors duration-200"
                                                        disabled={isLoggingOut}
                                                    >
                                                        {isLoggingOut ? (
                                                            <span className="flex items-center">
                                                                <motion.span 
                                                                    className="inline-block mr-2"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ 
                                                                        repeat: Infinity, 
                                                                        duration: 1, 
                                                                        ease: "linear" 
                                                                    }}
                                                                >
                                                                    <FaSpinner />
                                                                </motion.span>
                                                                Sedang keluar...
                                                            </span>
                                                        ) : (
                                                            <span className='flex gap-2 items-center'>
                                                                <FaSignOutAlt className='text-OxfordBlue'/> Keluar
                                                            </span>
                                                        )}
                                                    </button>
                                                    {isLoggingOut && (
                                                        <motion.div 
                                                            className="absolute bottom-0 left-0 h-1 bg-GoldenYellow rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 1.5 }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </>
                                        ) : (
                                            <>
                                                <motion.div whileHover={{ x: 5 }}>
                                                    <NavLink 
                                                        to="/profile" 
                                                        className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-left text-sm text-body-color hover:bg-gray-100 transition-colors duration-200"
                                                        onClick={() => setShowUserInfo(false)}
                                                    >
                                                        <FaUser className='text-OxfordBlue'/> Profil
                                                    </NavLink>
                                                </motion.div>
                                                
                                                <motion.div 
                                                    whileHover={{ x: 5 }}
                                                    className="relative"
                                                >
                                                    <button 
                                                        onClick={handleLogOut} 
                                                        className="block w-full rounded-lg px-3 py-2 text-left text-sm text-body-color hover:bg-gray-100 transition-colors duration-200"
                                                        disabled={isLoggingOut}
                                                    >
                                                        {isLoggingOut ? (
                                                            <span className="flex items-center">
                                                                <motion.span 
                                                                    className="inline-block mr-2"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ 
                                                                        repeat: Infinity, 
                                                                        duration: 1, 
                                                                        ease: "linear" 
                                                                    }}
                                                                >
                                                                    <FaSpinner />
                                                                </motion.span>
                                                                Sedang keluar...
                                                            </span>
                                                        ) : (
                                                            <span className='flex gap-2 items-center'>
                                                                <FaSignOutAlt className='text-OxfordBlue'/> Keluar
                                                            </span>
                                                        )}
                                                    </button>
                                                    {isLoggingOut && (
                                                        <motion.div 
                                                            className="absolute bottom-0 left-0 h-1 bg-GoldenYellow rounded-full"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 1.5 }}
                                                        />
                                                    )}
                                                </motion.div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                    ) : (
                        <div className='flex gap-2'>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <NavLink to='/auth/login'>
                                    <button className='
                                        border-OxfordBlue border-1 p-2 px-4 rounded-lg 
                                        transition-all duration-300 
                                        hover:bg-OxfordBlue hover:text-white 
                                        hover:shadow-md
                                        active:scale-95
                                        relative overflow-hidden
                                    '>
                                        <span className="relative z-10">Masuk</span>
                                        <motion.span 
                                            className="absolute inset-0 bg-OxfordBlue opacity-0"
                                            whileHover={{ opacity: 0.1 }}
                                        />
                                    </button>
                                </NavLink>
                            </motion.div>
                            
                            <motion.div 
                                whileHover={{ scale: 1.05 }} 
                                whileTap={{ scale: 0.95 }}
                                initial={{ scale: 1 }}
                                animate={{ 
                                    scale: [1, 1.02, 1],
                                    boxShadow: ["0 4px 6px rgba(0, 0, 0, 0.1)", "0 6px 10px rgba(251, 191, 36, 0.3)", "0 4px 6px rgba(0, 0, 0, 0.1)"]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            >
                                <NavLink to='/auth/register'>
                                    <button className='
                                        bg-GoldenYellow text-white p-2 px-4 rounded-lg 
                                        transition-all duration-300 
                                        hover:bg-GoldenYellow-Dark 
                                        hover:shadow-md
                                        active:scale-95
                                        relative overflow-hidden
                                    '>
                                        <span className="relative z-10">Daftar</span>
                                        <motion.span 
                                            className="absolute inset-0 bg-white opacity-0"
                                            whileHover={{ opacity: 0.2 }}
                                        />
                                    </button>
                                </NavLink>
                            </motion.div>
                        </div>
                    )}
                    
                    <div className='flex gap-4 items-center md:hidden'>
                        <motion.button 
                            onClick={toggleMenu} 
                            className='text-OxfordBlue text-2xl'
                            whileTap={{ scale: 0.9 }}
                            animate={{ rotate: isOpen ? 90 : 0 }}
                        >
                            {isOpen ? '✖' : '☰'}
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div 
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                className='absolute top-16 right-0 bg-white shadow-md w-full md:hidden'
                            >
                                <motion.div className='flex flex-col p-4 space-y-4 mx-5'>
                                    <motion.div variants={itemVariants}>
                                        <NavLink 
                                            to='/' 
                                            className={({ isActive }) => 
                                                (isActive 
                                                    ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-4' 
                                                    : 'text-gray-700 hover:text-OxfordBlue transition duration-300'
                                                )
                                            }
                                            onClick={toggleMenu}
                                        >
                                            Beranda
                                        </NavLink>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <NavLink 
                                            to='/projects' 
                                            className={({ isActive }) => 
                                                (isActive 
                                                    ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-4' 
                                                    : 'text-gray-700 hover:text-OxfordBlue transition duration-300'
                                                )
                                            }
                                            onClick={toggleMenu}
                                        >
                                            Proyek
                                        </NavLink>
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <NavLink 
                                            to='/about' 
                                            className={({ isActive }) => 
                                                (isActive 
                                                    ? 'text-OxfordBlue font-bold underline decoration-GoldenYellow decoration-2 underline-offset-4' 
                                                    : 'text-gray-700 hover:text-OxfordBlue transition duration-300'
                                                )
                                            }
                                            onClick={toggleMenu}
                                        >
                                            Tentang
                                        </NavLink>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;