import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUpload, FaRocket } from 'react-icons/fa';

const About = () => {
  const steps = [
    {
      icon: <FaUserPlus className="text-2xl" />,
      number: '1',
      title: 'Create a free account',
      description: 'Easily register using your email or social media. Manage projects, interact with users, and get community feedback.'
    },
    {
      icon: <FaUpload className="text-2xl" />,
      number: '2',
      title: 'Upload your project',
      description: 'Add project details including title, description, media, and team members. Showcase your work professionally.'
    },
    {
      icon: <FaRocket className="text-2xl" />,
      number: '3',
      title: 'Release & Launch',
      description: 'Share your project with the community. Receive ratings, comments, and valuable feedback to improve your skills.'
    }
  ];

  return (
    <>
      <Navbar />
      <div className="mt-14"></div>
      
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-OxfordBlue to-OxfordBlue-Dark sm:py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Showcase Your <span className="text-GoldenYellow">PKL Projects</span>
            </h2>
            <p className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed text-gray-200">
              A platform designed to help students share their internship projects, get feedback, and connect with the community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white sm:py-20 lg:py-28">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 text-sm font-semibold tracking-wider text-OxfordBlue uppercase rounded-full bg-OxfordBlue/10">
                How It Works
              </span>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Share Your Work in <span className="text-OxfordBlue">3 Simple Steps</span>
              </h2>
              <p className="max-w-lg mx-auto mt-4 text-lg leading-relaxed text-gray-600">
                Follow these steps to showcase your internship projects and inspire fellow students.
              </p>
            </motion.div>
          </div>

          <div className="relative mt-16 lg:mt-24">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="relative h-full p-8 transition-all duration-300 bg-white border border-gray-200 rounded-2xl group-hover:border-OxfordBlue/30 group-hover:shadow-xl">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto transition-all duration-300 bg-OxfordBlue rounded-full shadow-lg group-hover:bg-GoldenYellow group-hover:scale-110">
                        <span className="text-xl font-semibold text-white">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 transition-all duration-300 bg-OxfordBlue/10 rounded-2xl group-hover:bg-OxfordBlue/20">
                      <div className="text-OxfordBlue group-hover:text-GoldenYellow">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-center text-gray-900">{step.title}</h3>
                    <p className="mt-4 text-base text-center text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 sm:py-20 lg:py-28">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { number: '500+', label: 'Projects Shared' },
              { number: '1000+', label: 'Community Members' },
              { number: '4.8', label: 'Average Rating' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 text-center bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-3xl font-bold text-OxfordBlue sm:text-4xl">{stat.number}</p>
                <p className="mt-2 text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-OxfordBlue to-OxfordBlue-Dark sm:py-20 lg:py-28">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Ready to Showcase Your Work?
            </h2>
            <p className="max-w-2xl mx-auto mt-4 text-lg leading-relaxed text-gray-200">
              Join our community of talented students and professionals today.
            </p>
            <div className="flex flex-col justify-center mt-8 space-y-3 sm:space-y-0 sm:space-x-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-GoldenYellow border border-transparent rounded-lg hover:bg-GoldenYellow-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-GoldenYellow"
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-transparent border border-white rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;