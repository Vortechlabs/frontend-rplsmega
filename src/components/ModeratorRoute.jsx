import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModeratorRoute = ({ children }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Jika user tidak ada, arahkan ke halaman login
        if (!user) {
            navigate('/auth/admin/login');
            return; // Hentikan eksekusi lebih lanjut
        }

        // Jika user ada tetapi bukan moderator, arahkan ke halaman utama
        if (user[0].role !== 'moderator') { 
            navigate('/'); 
        }
    }, [user, navigate]);

    // Pastikan user ada dan memiliki role moderator sebelum merender children
    return user && user[0]?.role === 'moderator' ? children : null; 
};

export default ModeratorRoute;