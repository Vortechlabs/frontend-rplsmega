import React, { useState } from 'react';
import { 
  FiX, 
  FiInfo, 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiExternalLink
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Alert = ({ alert, onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const alertTypes = {
    info: {
      bg: 'bg-blue-50/90 backdrop-blur-sm',
      border: 'border-blue-100/80',
      text: 'text-blue-900',
      icon: <FiInfo className="text-blue-500" size={20} />,
      accent: 'from-blue-400 to-blue-600',
      iconBg: 'bg-blue-100/80'
    },
    warning: {
      bg: 'bg-amber-50/90 backdrop-blur-sm',
      border: 'border-amber-100/80',
      text: 'text-amber-900',
      icon: <FiAlertTriangle className="text-amber-500" size={20} />,
      accent: 'from-amber-400 to-amber-600',
      iconBg: 'bg-amber-100/80'
    },
    danger: {
      bg: 'bg-red-50/90 backdrop-blur-sm',
      border: 'border-red-100/80',
      text: 'text-red-900',
      icon: <FiAlertCircle className="text-red-500" size={20} />,
      accent: 'from-red-400 to-red-600',
      iconBg: 'bg-red-100/80'
    },
    success: {
      bg: 'bg-emerald-50/90 backdrop-blur-sm',
      border: 'border-emerald-100/80',
      text: 'text-emerald-900',
      icon: <FiCheckCircle className="text-emerald-500" size={20} />,
      accent: 'from-emerald-400 to-emerald-600',
      iconBg: 'bg-emerald-100/80'
    }
  };

  const config = alertTypes[alert.type] || alertTypes.info;

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => onDismiss(), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: isHovered 
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02)'
      }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ 
        type: 'spring', 
        damping: 20, 
        stiffness: 400,
        shadow: { duration: 0.2 }
      }}
      className={`relative w-full max-w-lg rounded-xl ${config.bg} ${config.border} border overflow-hidden pointer-events-auto transition-all duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isDismissing ? 'translateX(100px)' : 'translateX(0)'
      }}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b ${config.accent}`} />
      
      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Icon container */}
          <div className={`flex-shrink-0 ${config.iconBg} p-2 rounded-lg`}>
            {config.icon}
          </div>
          
          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <h3 className={`text-base font-medium ${config.text}`}>
                {alert.title}
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`flex-shrink-0 p-1 rounded-full ${config.text.replace('900', '500')} hover:bg-black/5 transition-colors`}
                >
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiChevronDown size={18} />
                  </motion.div>
                </button>
                <button 
                  onClick={handleDismiss}
                  className={`flex-shrink-0 p-1 rounded-full ${config.text.replace('900', '500')} hover:bg-black/5 transition-colors`}
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {alert.image_path && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-3 mb-3 overflow-hidden rounded-lg border border-gray-100/50"
                    >
                      <img 
                        src={`https://api-rplsmega-master-auajf8.laravel.cloud/storage/${alert.image_path}`} 
                        alt="Alert" 
                        className="w-full h-auto max-h-52 object-cover"
                      />
                    </motion.div>
                  )}
                  
                  <div 
                    className={`mt-2 text-sm ${config.text} opacity-90 prose prose-sm max-w-none`}
                    dangerouslySetInnerHTML={{ __html: alert.content }} 
                  />
                  
                  {/* Actions */}
                  {alert.link && (
                    <div className="mt-3 flex justify-end">
                      <a 
                        href={alert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${config.text.replace('900', '600')} hover:bg-black/5 transition-colors`}
                      >
                        Lihat Detail
                        <FiExternalLink className="ml-1" size={14} />
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Timestamp */}
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-400">
                <FiClock className="mr-1" size={12} />
                {new Date(alert.created_at).toLocaleString()}
              </div>
              
              {!isExpanded && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Baca selengkapnya
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Auto-dismiss progress bar */}
      {!isHovered && !isExpanded && (
        <motion.div 
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 6, ease: "linear" }}
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.accent} origin-left`}
        />
      )}
    </motion.div>
  );
};

export default Alert;