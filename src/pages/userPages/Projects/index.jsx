import React from 'react';
import { Link } from 'react-router-dom';
import ShowcaseCard from '../../../components/ShowcaseCard';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

function Project() {
  return (
    <>
      <Navbar />
      <div className="mt-14"></div>
    
      <div className="relative min-h-screen mt-20">
        <div className="container mx-auto py-12">
          <div className='text-center mb-10 px-6'>            
            <h1 class="mb-1 text-4xl uppercase font-extrabold leading-none tracking-tight text-OxfordBlue md:text-xl lg:text-2xl ">Lihat hasil karya proyek siswa-siswi <span class="text-GoldenYellow">RPL SMEGA</span></h1>
            <p class="text-sm font-normal text-gray-500 lg:text-lg dark:text-gray-400">
              Jelajahi karya para pengembang paling berbakat dan berpengalaman dari SMKN 1 Purbalingga.
            </p>
          </div>
          <ShowcaseCard />
        </div>

        <div className="fixed bottom-4 right-4">
          <Link to="/upload/project">
            <button className="flex items-center cursor-pointer transition-transform justify-center px-6 py-3 bg-OxfordBlue rounded-full shadow-lg hover:bg-OxfordBlue-Dark hover:scale-105 duration-200">
              <span className="text-white font-semibold">+ Tambahkan Proyek</span>
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Project;