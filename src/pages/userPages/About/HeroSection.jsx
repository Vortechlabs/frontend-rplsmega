import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
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
            Tunjukan <span className="text-GoldenYellow">Karya Brilian</span> Anda di RPL SMEGA
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg leading-relaxed text-gray-200">
            Platform untuk berbagi karya khusus siswa-siswi jurusan RPL SMKN 1 Purbalingga, mendapatkan umpan balik, dan terhubung dengan guru.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;