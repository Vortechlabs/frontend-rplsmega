import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import FAQSection from './FAQSection';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="mt-14"></div>
      
      <HeroSection />
      <HowItWorks />
      <FAQSection />

      <Footer />
    </>
  );
};

export default About;