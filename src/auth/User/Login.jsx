import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../AuthContext';
import apiClient from '../../services/GlobalApi';
import loginIllustration from '/login-ilustration.gif';

function Login() {
    const [nis, setNis] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await apiClient.post('auth/login', { nis, password });
            const { token, user } = response.data;

            if (user[0].role === 'moderator') {
                navigate('/auth/admin/login');
                return;
            }

            login({ user, token });
            localStorage.setItem('token', response.data.user.accessToken);
            localStorage.setItem('userId', response.data.user.id);
            
            Swal.fire({
                title: 'Berhasil!',
                text: 'Kamu berhasil login.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                background: '#fff',
                color: '#000000',
            });
            
            navigate('/');
        } catch (e) {
            if (e.response) {
                if (e.response.status === 401) {
                    await Swal.fire({
                        title: 'Oops!',
                        text: 'nis atau password salah',
                        icon: 'error',
                        confirmButtonColor: '#1a365d',
                        background: '#fff3cd',
                        iconColor: '#d33'
                    });
                } else if (e.response.status === 422) {
                    await Swal.fire({
                        title: 'Oops!',
                        text: 'nis or password salah',
                        icon: 'error',
                        confirmButtonColor: '#1a365d',
                        background: '#fff3cd',
                        iconColor: '#d33'
                    });
                } else if (e.response.status === 500) {
                    Swal.fire({
                        title: 'Server Error',
                        text: 'Please try again later',
                        icon: 'error',
                        confirmButtonColor: '#1a365d'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Network Error',
                    text: 'Please check your connection',
                    icon: 'error',
                    confirmButtonColor: '#1a365d'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-GoldenYellow-Dark to-GoldenYellow-Dark/90 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 px-4">
                <div className="text-center  md:w-1/2 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                        LOGIN
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Tunjukan karya and bakatmu di RPL SMEGA
                    </p>
                    <div className="relative w-full max-w-lg mx-auto">
                        <img 
                            src={loginIllustration} 
                            alt="Creative illustration" 
                            className="w-full h-auto -mt-24 object-contain hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute bottom-10 right-6 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <span className="text-OxfordBlue font-bold text-xl">👋</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                    <div className="py-10 px-8 sm:px-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-OxfordBlue">
                                Selamat datang kembali!
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Mohon login ke akun kamu
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                    Nomor Induk Siswa (NIS)
                                </label>
                                <input
                                    id="nis"
                                    name="nis"
                                    type="text"
                                    autoComplete="nis"
                                    required
                                    value={nis}
                                    onChange={(e) => setNis(e.target.value)}
                                    className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue placeholder-gray-400 transition-all duration-200"
                                    placeholder="1234"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue placeholder-gray-400 transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <Link to="/auth/forgot-password" className="font-medium text-OxfordBlue hover:text-OxfordBlue-Dark hover:underline">
                                        Lupa password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-OxfordBlue hover:bg-OxfordBlue-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sedang masuk...
                                        </>
                                    ) : 'Masuk'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                Belum punya akun?{' '}
                                <Link to="/auth/register" className="font-medium text-OxfordBlue hover:text-OxfordBlue-Dark hover:underline">
                                    Daftar
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;