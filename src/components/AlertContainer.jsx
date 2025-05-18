import React, { useState, useEffect } from 'react';
import Alert from './Alert';
import apiClient from '../services/GlobalApi';
import { AnimatePresence, motion } from 'framer-motion';

const AlertsContainer = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAlert, setCurrentAlert] = useState(null);

  // Get dismissed alerts from localStorage
  const getDismissedAlerts = () => {
    const dismissed = localStorage.getItem('dismissedAlerts');
    return dismissed ? JSON.parse(dismissed) : [];
  };

  // Add to dismissed alerts in localStorage
  const dismissAlert = (alertId) => {
    const dismissed = getDismissedAlerts();
    const newDismissed = [...dismissed, { 
      id: alertId, 
      dismissedAt: new Date().toISOString() 
    }];
    localStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
  };

  // Filter alerts that haven't been dismissed or are older than 24 hours
  const filterAlerts = (allAlerts) => {
    const dismissed = getDismissedAlerts();
    const now = new Date();
    
    return allAlerts.filter(alert => {
      const dismissedAlert = dismissed.find(d => d.id === alert.id);
      if (!dismissedAlert) return true;
      
      const dismissedTime = new Date(dismissedAlert.dismissedAt);
      const hoursDiff = (now - dismissedTime) / (1000 * 60 * 60);
      return hoursDiff >= 24;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/alerts');
        const filteredAlerts = filterAlerts(response.data);
        setAlerts(filteredAlerts);
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
      setCurrentAlert(alerts[0]);
    } else {
      setCurrentAlert(null);
    }
  }, [alerts, loading]);

  const handleDismiss = (alertId) => {
    dismissAlert(alertId);
    setCurrentAlert(null);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="fixed inset-0 flex items-start justify-end pointer-events-none z-[100] p-4 pt-20">
      <div className="flex flex-col items-end space-y-3 w-full max-w-lg">
        <AnimatePresence>
          {currentAlert && (
            <Alert 
              key={currentAlert.id}
              alert={currentAlert} 
              onDismiss={() => handleDismiss(currentAlert.id)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsContainer;