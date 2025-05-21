import React, { useState } from 'react';
import logo from '/logo.png';
import { FaEnvelope, FaFacebook, FaYoutube } from 'react-icons/fa';
import { RiInstagramFill } from 'react-icons/ri';

const Footer = () => {        
  const currentYear = new Date().getFullYear();
    return (
    <section className="py-10 bg-OxfordBlue sm:pt-16 lg:pt-24">
    <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
                <div className='flex gap-2 items-center'>
                  <img src={logo} alt="logo" className='h-20 brightness-0 invert-[1] contrast-200 -my-5'/>
                </div>

                <p className="text-sm leading-relaxed text-white mt-7">
                    RPL (Rekayasa Perangkat Lunak) adalah kompetensi keahlian yang fokus pada pemrograman, pengembangan software, dan pembuatan aplikasi/game.
                </p>

                <ul className="flex items-center space-x-3 mt-9">
                    <li>
                        <a href="mailto:contact.rplsmega@gmail.com" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-GoldenYellow focus:bg-GoldenYellow">
                            <FaEnvelope />
                        </a>
                    </li>

                    <li>
                        <a href="https://web.facebook.com/RPLSMEGA" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-GoldenYellow focus:bg-GoldenYellow">
                            <FaFacebook />
                        </a>
                    </li>

                    <li>
                        <a href="https://www.instagram.com/rplsmkn1purbalingga/" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-GoldenYellow focus:bg-GoldenYellow">
                            <RiInstagramFill />
                        </a>
                    </li>

                    <li>
                        <a href="https://www.youtube.com/@RPL_SMKN1_Purbalingga" title="" className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-GoldenYellow focus:bg-GoldenYellow">
                            <FaYoutube />
                        </a>
                    </li>
                </ul>
            </div>
            
            <div>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Navigasi</p>
                <ul className="mt-6 space-y-4">
                <li>
                    <a href="/" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Beranda</a>
                </li>
                <li>
                    <a href="/projects" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Karya siswa</a>
                </li>
                <li>
                    <a href="/profile" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Profil kamu</a>
                </li>
                <li>
                    <a href="/upload/project" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Bagikan Karya</a>
                </li>
                </ul>
            </div>

            <div>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Legal</p>
                <ul className="mt-6 space-y-4">
                <li>
                    <a href="/termsconditions" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Syarat & Ketentuan</a>
                </li>
                <li>
                    <a href="/privacypolicy" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">Kebijakan Privasi</a>
                </li>
                <li>
                    <a href="/about" className="flex text-base text-white transition-all duration-200 hover:text-GoldenYellow focus:text-GoldenYellow">FAQ</a>
                </li>
                </ul>
            </div>

            <div className='col-span-2'>
                <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Lokasi</p>
                <div className="mt-6 rounded-lg overflow-hidden">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1674.3234133269098!2d109.34562123997215!3d-7.4036508578086915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6559b9ff8d3795%3A0xa58daaef273f4e44!2sSMK%20Negeri%201%20Purbalingga!5e1!3m2!1sid!2sid!4v1746589520035!5m2!1sid!2sid" 
                    width="100%" 
                    height="180" 
                    style={{ border: 0 }}
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                ></iframe>
                </div>
            </div>
        </div>

        <hr className="mt-16 mb-10 border-gray-200" />

        <p className="text-sm text-center text-white">© Copyright {currentYear}, All Rights Reserved by RPL SMEGA.</p>
    </div>
</section>

    )
}
export default Footer;