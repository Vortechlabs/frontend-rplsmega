import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck } from 'react-icons/fi';
import apiClient from '../services/GlobalApi';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/alerts');
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.read_at).length);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  return (
    <div className="relative ml-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 rounded-full text-gray-600 hover:text-OxfordBlue hover:bg-gray-100 transition-colors"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute -right-20 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            <div className="p-3 border-b border-gray-200">
              <h3 className="font-medium text-OxfordBlue">Notifikasi</h3>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Memuat...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Tidak ada notifikasi</div>
              ) : (
                // Ganti bagian render notifikasi:
                notifications.map(notification => (
                <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: 'rgba(0, 33, 71, 0.05)' }}
                    className={`p-3 border-b border-gray-100 bg-blue-50`}
                >
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-OxfordBlue">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.content}</p>
                        <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                        </p>
                    </div>
                    </div>
                </motion.div>
                ))
              )}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;