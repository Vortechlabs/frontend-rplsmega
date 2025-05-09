import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/logo.png';

const Loader = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsComplete(true), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.1, duration: 1.5, ease: "easeInOut" },
        opacity: { delay: i * 0.1, duration: 0.01 }
      }
    })
  };

  return (
    <div className="fixed max-w-screen inset-0 z-50 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
      <AnimatePresence>
        {!isComplete ? (
          <motion.div
            className="flex flex-col items-center w-full max-w-md px-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Logo dengan Animasi */}
            <motion.div
              className="relative w-64 h-64 mb-8"
              variants={variants}
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <div className='flex items-center justify-center h-full'>
                <img src={logo} alt="" />
              </div>
              
              {isHovered && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-4 border-yellow-400"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>

            {/* Loading Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-yellow-400 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Percentage Text */}
            <motion.p 
              className="text-xl font-bold text-gray-700 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Loading {loadingProgress}%
            </motion.p>

            {/* Text Animation */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-lg font-semibold text-gray-600">Rekayasa Perangkat Lunak</p>
              <p className="text-md text-gray-500">SMKN I Purbalingga</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Loader;