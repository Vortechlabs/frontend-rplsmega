import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import router from "./router";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;