import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import workIllustration from '/work-ilustration.gif';
import logo3T from '/logo/logo-3t.png';
import logoSmartInnovative from '/logo/logo-smart-innovative.png';
import logoSmkHebat from '/logo/logo-smk-hebat.png';
import logoVokasi from '/logo/logo-vokasi.png';
import { GiDiamondTrophy } from "react-icons/gi";
import { RiMedalFill } from "react-icons/ri";
import { GiPodiumWinner } from "react-icons/gi";
import HomeProject from '../../../components/HomeProject';
import { FaUpload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import BlurText from '../../../components/BlurText/BlurText';
import AnimatedContent from '../../../components/AnimatedContent/AnimatedContent';
import AlertsContainer from '../../../components/AlertContainer';

const Home = () => {
  return (
    <>
      <Navbar />
      <main className='space-y-10'>
        {/* Hero Section with Wave Divider */}
        <section className="bg-OxfordBlue min-h-screen pt-28 md:pt-32 w-full text-white relative overflow-hidden">
        <AlertsContainer />
          {/* Wave Divider at Bottom */}
          <div className="absolute bg-white bottom-0 left-0 w-full overflow-hidden">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none" 
              className="fill-current text-OxfordBlue w-full h-16 md:h-24"
            >
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25" 
                className="shape-fill"
              ></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5" 
                className="shape-fill"
              ></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                className="shape-fill"
              ></path>
            </svg>
          </div>

          <div className="container mx-auto px-10 md:px-20 py-20 relative z-10">
            <div className='space-y-4 text-center max-w-4xl mx-auto'>
              <BlurText
                text="Selamat Datang di Portal Proyek PKL RPL SMEGA"
                delay={100}
                animateBy="words"
                direction="top"
                className="font-bold flex uppercase justify-center text-4xl md:text-6xl mb-8"
              />
              
              <BlurText
                text="Website ini merupakan tempat untuk menampilkan hasil proyek PKL siswa-siswi Rekayasa Perangkat Lunak (RPL) SMKN 1 Purbalingga. Di sini, kamu dapat menemukan berbagai karya website yang telah dikembangkan selama masa PKL maupun pra-PKL, mulai dari aplikasi berbasis web, mobile, desktop, dan lainnya."
                delay={50}
                animateBy="words"
                direction="top"
                className="text-sm flex justify-center md:text-base mb-8 mx-auto max-w-5xl"
              />
              
              <AnimatedContent
                distance={200}
                direction="vertical"
                reverse={false}
                config={{ tension: 50, friction: 25 }}
                initialOpacity={0.0}
                animateOpacity
                scale={1.1}
                threshold={0.2}
              >
                <Link to='/upload/project'>
                  <button className="relative cursor-pointer overflow-hidden bg-GoldenYellow hover:bg-GoldenYellow-Dark text-OxfordBlue font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 group">
                    <span className="absolute inset-0 bg-white opacity-20 group-hover:opacity-30 transition-opacity duration-500"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Mari mulai petualangan!
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                  </button>
                </Link>
              </AnimatedContent>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 my-16 max-w-5xl mx-auto'>
              {[
                { icon: <GiDiamondTrophy className='text-5xl text-GoldenYellow' />, title: "The First", description: "Selalu menjadi yang pertama" },
                { icon: <RiMedalFill className='text-5xl text-GoldenYellow' />, title: "The Best", description: "Tetap menjadi yang terbaik" },
                { icon: <GiPodiumWinner className='text-5xl text-GoldenYellow' />, title: "The Winner", description: "Dan menjadi Pemenang" }
              ].map((item, index) => (
                <AnimatedContent
                  key={index}
                  distance={100}
                  direction="vertical"
                  reverse={index % 2 === 0}
                  config={{ tension: 50, friction: 25 }}
                  initialOpacity={0.0}
                  animateOpacity
                  scale={1.05}
                  threshold={0.2}
                >
                  <div className='bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl p-6 flex flex-col items-center text-center hover:bg-white/20 transition-all duration-300 hover:-translate-y-2 shadow-lg'>
                    <div className='mb-4'>{item.icon}</div>
                    <h2 className='font-bold text-xl mb-2'>{item.title}</h2>
                    <p className='text-sm opacity-80'>{item.description}</p>
                  </div>
                </AnimatedContent>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className='container mx-auto px-6 md:px-10 py-20'>
          <AnimatedContent
            distance={100}
            direction="vertical"
            reverse={false}
            config={{ tension: 50, friction: 25 }}
            initialOpacity={0.0}
            animateOpacity
            scale={1.05}
            threshold={0.2}
          >
            <div className='text-center mb-12'>
              <h1 className='font-bold text-3xl md:text-4xl text-OxfordBlue mb-4'>Explore Our Website Projects</h1>
              <div className='w-24 h-1 bg-GoldenYellow mx-auto'></div>
            </div>
          </AnimatedContent>

          <HomeProject />

          <div className="flex justify-center mt-10">
            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              config={{ tension: 50, friction: 25 }}
              initialOpacity={0.0}
              animateOpacity
              scale={1.05}
              threshold={0.2}
            >
              <Link to='/projects'>
                <button className='bg-OxfordBlue hover:bg-OxfordBlue-Dark cursor-pointer text-white py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2'>
                  Load More Projects 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </button>
              </Link>
            </AnimatedContent>
          </div>
        </section>

        {/* Upload Section with Curved Divider */}
        <section className='relative py-20 bg-gradient-to-b to-white from-gray-50'>
          {/* Curved Top Divider */}
          <div className="absolute bg-white top-0 left-0 w-full overflow-hidden rotate-180">
            <svg 
              viewBox="0 0 1200 120" 
              preserveAspectRatio="none" 
              className="fill-current text-gray-50 w-full h-16 md:h-20"
            >
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25" 
              ></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5" 
              ></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
              ></path>
            </svg>
          </div>

          <div className="container mx-auto px-6 md:px-10">
            <div className='flex flex-col md:flex-row items-center gap-10 md:gap-16'>
              <AnimatedContent
                distance={100}
                direction="horizontal"
                reverse={true}
                config={{ tension: 50, friction: 25 }}
                initialOpacity={0.0}
                animateOpacity
                scale={1.05}
                threshold={0.2}
              >
                <div className='w-full'>
                  <img src={workIllustration} alt="Work Illustration" className="w-full h-full" />
                </div>
              </AnimatedContent>

              <AnimatedContent
                distance={100}
                direction="horizontal"
                reverse={false}
                config={{ tension: 50, friction: 25 }}
                initialOpacity={0.0}
                animateOpacity
                scale={1.05}
                threshold={0.2}
              >
                <div className='w-full  space-y-6'>
                  <h1 className='text-3xl md:text-4xl font-bold text-OxfordBlue'>Upload and Show Your PKL Project</h1>
                  <p className='text-lg text-gray-600'>Join with <span className='font-bold text-GoldenYellow'>500+ Developers</span> and start getting feedback right now!</p>
                  <div className='flex flex-wrap gap-4'>
                    <Link to='/auth/register'>
                      <button className='bg-OxfordBlue cursor-pointer hover:bg-OxfordBlue-Dark text-white py-3 px-6 rounded-lg shadow transition-all duration-300 transform hover:scale-105'>
                        Join Now
                      </button>
                    </Link>
                    <Link to='/upload/project'>
                      <button className='border-2 border-OxfordBlue cursor-pointer text-OxfordBlue hover:bg-OxfordBlue hover:text-white py-3 px-6 rounded-lg shadow transition-all duration-300 transform hover:scale-105 flex items-center gap-2'>
                        <FaUpload/> Upload Project
                      </button>
                    </Link>
                  </div>
                </div>
              </AnimatedContent>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 md:px-10">
            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              config={{ tension: 50, friction: 25 }}
              initialOpacity={0.0}
              animateOpacity
              scale={1.05}
              threshold={0.2}
            >
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-OxfordBlue">How does it work?</h2>
                <div className='w-24 h-1 bg-GoldenYellow mx-auto mt-4'></div>
                <p className="mt-6 text-lg text-gray-600">By following these easy steps, you can share the results of your PKL project and inspire others. Let's get started now!</p>
              </div>
            </AnimatedContent>

            <div className="relative mt-12 lg:mt-20">
              <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
                <svg className="w-full" viewBox="0 0 1000 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 10 C 200 20, 300 0, 500 10 S 800 0, 1000 10" stroke="#0A3180" strokeWidth="2" strokeDasharray="10 5" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="relative grid grid-cols-1 text-center gap-y-16 md:grid-cols-3 gap-x-8">
                {[
                  {
                    number: "1",
                    title: "Create a free account",
                    description: "Easily register yourself using your email or social media account. With an account, you can manage your projects, interact with other users, and get feedback from the community."
                  },
                  {
                    number: "2",
                    title: "Upload your project",
                    description: "Add project details such as title, description, and project images or demos. Don't forget to include contributing team members so that everyone knows who is involved in this work."
                  },
                  {
                    number: "3",
                    title: "Release & Launch",
                    description: "Once your project is uploaded, everyone can see it, rate it, and leave comments. Get feedback and improve your skills by sharing your experience with other communities."
                  }
                ].map((step, index) => (
                  <AnimatedContent
                    key={index}
                    distance={50}
                    direction="vertical"
                    reverse={index % 2 === 0}
                    config={{ tension: 50, friction: 25 }}
                    initialOpacity={0.0}
                    animateOpacity
                    scale={1.05}
                    threshold={0.2}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-OxfordBlue border-2 border-white rounded-full shadow-lg mb-6">
                        <span className="text-xl font-semibold text-white">{step.number}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-OxfordBlue mb-4">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </AnimatedContent>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className='py-16 bg-gray-50'>
          <div className="container mx-auto px-6 md:px-10">
            <AnimatedContent
              distance={100}
              direction="vertical"
              reverse={false}
              config={{ tension: 50, friction: 25 }}
              initialOpacity={0.0}
              animateOpacity
              scale={1.05}
              threshold={0.2}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-center">
                  <img src={logoSmartInnovative} alt="Smart Innovative" className="h-24 object-contain opacity-80 hover:opacity-100 transition-opacity"/>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-center">
                  <img src={logo3T} alt="3T" className="h-24 object-contain opacity-80 hover:opacity-100 transition-opacity"/>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-center">
                  <img src={logoSmkHebat} alt="SMK Hebat" className="h-24 object-contain opacity-80 hover:opacity-100 transition-opacity"/>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex justify-center">
                  <img src={logoVokasi} alt="Vokasi" className="h-24 object-contain opacity-80 hover:opacity-100 transition-opacity"/>
                </div>
              </div>
            </AnimatedContent>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;