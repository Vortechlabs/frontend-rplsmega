import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import apiClient from '../../services/GlobalApi';
import adminIllustration from '/login-ilustration.gif'; // You can use a different admin-themed illustration

function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('auth/admin/login', { username, password });
            const { token, user } = response.data;

            // Check if the user has admin role
            if (user[0].role !== 'moderator') {
                await Swal.fire({
                    title: 'Akses ditolak',
                    text: 'Hanya administrator yang bisa mengaskses halaman ini.',
                    icon: 'error',
                    background: '#1a365d',
                    color: '#fff',
                    confirmButtonColor: '#f59e0b'
                });
                setLoading(false);
                return;
            }

            login({ user, token });
            localStorage.setItem('token', response.data.user.accessToken);
            localStorage.setItem('userId', response.data.user.id);
            
            await Swal.fire({
                title: 'Akses Admin Diterima',
                text: 'Mengalihkan ke dashboard...',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                background: '#ffffff',
                color: '#000000'
            });
            
            navigate('/admin');
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401) {
                    await Swal.fire({
                        title: 'Autentikasi Gagal',
                        text: 'Username atau password tidak ada',
                        icon: 'error',
                        background: '#ffffff',
                        confirmButtonColor: '#1a365d',
                        iconColor: '#d33'
                    });
                } else if (e.response.status === 422) {
                    await Swal.fire({
                        title: 'Autentikasi Gagal',
                        text: 'Username atau password tidak ada',
                        icon: 'error',
                        background: '#ffffff',
                        confirmButtonColor: '#1a365d',
                        iconColor: '#d33'
                    });
                } else if (e.response.status === 500) {
                    Swal.fire({
                        title: 'Server Error',
                        text: 'Please try again later',
                        icon: 'error',
                        background: '#ffffff',
                        confirmButtonColor: '#1a365d'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Connection Error',
                    text: 'Unable to reach the server',
                    icon: 'error',
                    background: '#ffffff',
                    confirmButtonColor: '#1a365d'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-OxfordBlue to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 px-4">
                <div className="text-center md:w-1/2 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
                        Admin <span className="text-GoldenYellow">Dashboard</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Kelola website untuk admin RPL SMEGA dengan statistik
                    </p>
                    <div className="relative w-full max-w-lg mx-auto">
                        <img 
                            src={adminIllustration} 
                            alt="Admin illustration" 
                            className="w-full h-auto -mt-24 object-contain hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute bottom-10 right-6 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <span className="text-OxfordBlue font-bold text-xl">🔒</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                    <div className="py-10 px-8 sm:px-10">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-OxfordBlue/10 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-OxfordBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <h2 className="text-3xl font-extrabold text-OxfordBlue">
                                Admin Portal
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Akses terbatas hanya ke pengguna yang berwenang
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Admin Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue placeholder-gray-400 transition-all duration-200"
                                    placeholder="admin"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Admin Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue placeholder-gray-400 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-white bg-gradient-to-r from-OxfordBlue to-blue-800 hover:from-blue-800 hover:to-OxfordBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Mengautentikasi...
                                        </>
                                    ) : 'Akses Dashboard'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <Link to="/auth/login" className="font-medium text-OxfordBlue hover:text-blue-800 hover:underline">
                                ← Kembali ke login user
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;