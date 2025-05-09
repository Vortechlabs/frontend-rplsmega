import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../../services/GlobalApi';
import registerIllustration from '/login-ilustration.gif'; 

function Register() {
    const [step, setStep] = useState(1);
    const [nis, setNis] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role] = useState('user');
    const [className, setClassName] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (password !== passwordConfirmation) {
            await Swal.fire({
                title: 'Password Mismatch',
                text: 'The passwords you entered do not match',
                icon: 'error',
                background: '#fff3cd',
                confirmButtonColor: '#1a365d'
            });
            setLoading(false);
            return;
        }

        if (!agreedToTerms) {
            await Swal.fire({
                title: 'Terms Not Accepted',
                text: 'You must agree to our terms and conditions',
                icon: 'error',
                background: '#fff3cd',
                confirmButtonColor: '#1a365d'
            });
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('nis', nis);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role);
        formData.append('class', className);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        try {
            const response = await apiClient.post('auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            await Swal.fire({
                title: 'Registration Successful!',
                text: response.data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                background: '#fff3cd',
                color: '#000000'
            });
            
            navigate('/auth/login');
        } catch (e) {
            if (e.response) {
                if (e.response.status === 422) {
                    Swal.fire({
                        title: 'Registration Error',
                        text: 'NIS or Email already in use',
                        icon: 'error',
                        background: '#fff3cd',
                        confirmButtonColor: '#1a365d'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: e.response.data.message || 'Something went wrong',
                        icon: 'error',
                        background: '#fff3cd',
                        confirmButtonColor: '#1a365d'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Network Error',
                    text: 'Unable to connect to the server',
                    icon: 'error',
                    background: '#fff3cd',
                    confirmButtonColor: '#1a365d'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreview(imageUrl);
        } else {
            setPreview(null);
        }
    };

    const handleCancelPreview = () => {
        setPreview(null);
        setProfilePicture(null);
    };

    const nextStep = () => {
        if (step === 1 && (!name || !email || !className)) {
            Swal.fire({
                title: 'Incomplete Information',
                text: 'Please fill in all fields',
                icon: 'error',
                background: '#fff3cd',
                confirmButtonColor: '#1a365d'
            });
            return;
        } else if (step === 2 && (!password || !passwordConfirmation)) {
            Swal.fire({
                title: 'Password Required',
                text: 'Please enter and confirm your password',
                icon: 'error',
                background: '#fff3cd',
                confirmButtonColor: '#1a365d'
            });
            return;
        }
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-GoldenYellow to-GoldenYellow-Dark flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-6xl flex flex-col md:flex-row items-center justify-center gap-12 px-4">
                <div className="text-center md:w-1/2 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-6">
                        Join Our <span className="text-OxfordBlue">Creative</span> Community
                    </h1>
                    <p className="text-xl text-white/90 mb-8">
                        Showcase your talents and connect with like-minded creators
                    </p>
                    <div className="relative w-full max-w-lg mx-auto">
                        <img 
                            src={registerIllustration} 
                            alt="Registration illustration" 
                            className="w-full h-auto -mt-24 object-contain hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute bottom-10 right-6 bg-white/20 backdrop-blur-sm rounded-full p-4 animate-pulse">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                <span className="text-OxfordBlue font-bold text-xl">🎨</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-1/2 max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                    <div className="py-10 px-8 sm:px-10">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-OxfordBlue">
                                Create Account
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {step === 1 && "Let's start with the basics"}
                                {step === 2 && "Secure your account"}
                                {step === 3 && "Personalize your profile"}
                            </p>
                            
                            {/* Step indicator */}
                            <div className="flex justify-center mt-6 mb-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= i ? 'bg-OxfordBlue text-white' : 'bg-gray-200 text-gray-600'}`}>
                                            {i}
                                        </div>
                                        {i < 3 && (
                                            <div className={`w-8 h-1 ${step > i ? 'bg-OxfordBlue' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-4 animate-slide-in">
                                    
                                    <div>
                                        <label htmlFor="nis" className="block text-sm font-medium text-gray-700">
                                            NIS
                                        </label>
                                        <input
                                            id="nis"
                                            type="text"
                                            value={nis}
                                            onChange={(e) => setNis(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            placeholder="12345"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                                            Class
                                        </label>
                                        <select
                                            id="class"
                                            value={className}
                                            onChange={(e) => setClassName(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            required
                                        >
                                            <option value="" disabled>Select your class</option>
                                            <option value="XI RPL 1">XI RPL 1</option>
                                            <option value="XI RPL 2">XI RPL 2</option>
                                            <option value="XII RPL 1">XII RPL 1</option>
                                            <option value="XII RPL 2">XII RPL 2</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Password */}
                            {step === 2 && (
                                <div className="space-y-4 animate-slide-in">
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">At least 8 characters</p>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="passwordConfirmation"
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue transition-all duration-200"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Profile Picture & Terms */}
                            {step === 3 && (
                                <div className="space-y-4 animate-slide-in">
                                    <div>
                                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">
                                            Profile Picture (Optional)
                                        </label>
                                        <div className="mt-1 flex flex-col items-center">
                                            {preview ? (
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-OxfordBlue/20">
                                                    <img 
                                                        src={preview} 
                                                        alt="Profile preview" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelPreview}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1 -translate-y-1"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="cursor-pointer">
                                                    <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-OxfordBlue/30 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                                                        <div className="text-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-OxfordBlue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            <span className="text-xs text-OxfordBlue mt-1">Add Photo</span>
                                                        </div>
                                                    </div>
                                                    <input
                                                        id="profilePicture"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    checked={agreedToTerms}
                                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                    className="focus:ring-OxfordBlue h-4 w-4 text-OxfordBlue border-gray-300 rounded"
                                                    required
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="terms" className="font-medium text-gray-700">
                                                    I agree to the{' '}
                                                    <Link to="/termsconditions" className="text-OxfordBlue hover:underline">
                                                        Terms and Conditions
                                                    </Link>{' '}
                                                    and{' '}
                                                    <Link to="/privacypolicy" className="text-OxfordBlue hover:underline">
                                                        Privacy Policy
                                                    </Link>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between pt-4">
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="px-6 py-2 border border-transparent text-sm font-medium rounded-full text-OxfordBlue bg-OxfordBlue/10 hover:bg-OxfordBlue/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue transition-all duration-200"
                                    >
                                        Back
                                    </button>
                                )}
                                
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="ml-auto px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-OxfordBlue hover:bg-OxfordBlue-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue transition-all duration-200 hover:scale-105"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`ml-auto px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-OxfordBlue to-blue-800 hover:from-blue-800 hover:to-OxfordBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-OxfordBlue transition-all duration-200 ${loading ? 'opacity-70' : 'hover:scale-105'}`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Account...
                                            </>
                                        ) : 'Complete Registration'}
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link to="/auth/login" className="font-medium text-OxfordBlue hover:text-OxfordBlue-Dark hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;