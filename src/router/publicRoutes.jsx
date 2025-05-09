import Home from "../pages/userPages/Home";
import About from "../pages/userPages/About";
import PrivacyPolicy from "../pages/userPages/SitePolicy/PrivacyPolicy";
import TermsConditions from "../pages/userPages/SitePolicy/TermsConditions";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/privacypolicy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/termsconditions",
    element: <TermsConditions />,
  },
];

export default publicRoutes;