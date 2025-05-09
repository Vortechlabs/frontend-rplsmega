import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import apiClient from '../services/GlobalApi';
import { AnimatePresence, motion } from 'framer-motion';

const AlertsContainer = () => {
  const [alerts, setAlerts] = useState([]);
  const [shownAlerts, setShownAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAlert, setCurrentAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/alerts');
        setAlerts(response.data);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && alerts.length > 0) {
      const nextAlert = alerts.find(alert => !shownAlerts.includes(alert.id));
      setCurrentAlert(nextAlert || null);
    }
  }, [alerts, shownAlerts, loading]);

  const handleDismiss = (alertId) => {
    setShownAlerts(prev => [...prev, alertId]);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur rounded-full shadow-sm border border-gray-100"
        >
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-600">Loading notifications</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-start justify-end pointer-events-none z-[100] p-4 pt-20">
      <div className="flex flex-col items-end space-y-3 w-full max-w-lg">
        <AnimatePresence mode="wait">
          {currentAlert ? (
            <Alert 
              key={currentAlert.id}
              alert={currentAlert} 
              onDismiss={() => handleDismiss(currentAlert.id)} 
            />
          ) : shownAlerts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-2 bg-white/80 backdrop-blur hidden rounded-lg shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-600">All notifications viewed</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsContainer;