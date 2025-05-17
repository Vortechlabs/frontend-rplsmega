import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import router from "./router";
import { useEffect } from "react";

function App() {
    // Di dalam komponen ProjectDetail (bagian useEffect)
  useEffect(() => {
    // Mencegah klik kanan di seluruh halaman
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Bersihkan event listener saat komponen unmount
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
  
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;