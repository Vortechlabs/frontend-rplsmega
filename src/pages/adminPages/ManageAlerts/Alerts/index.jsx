import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import AlertCard from './AlertCard';
import Loader from '../../../../components/Loader';

const AlertManagement = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      showErrorAlert('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3b82f6',
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true
    });
  };

  const deleteAlert = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Alert?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      timer: 5000,
      timerProgressBar: true,
      showCloseButton: true
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/alerts/${id}`);
        setAlerts(alerts.filter(alert => alert.id !== id));
        toast.success('Alert deleted successfully!');
      } catch (error) {
        console.error('Error deleting alert:', error);
        showErrorAlert('Failed to delete alert');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer />
      <Sidebar />
      
      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <div className="p-6 md:p-8 min-h-screen">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-OxfordBlue/10 text-OxfordBlue">
                <FaBell className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Kelola Pemberitahuan</h1>
                <p className="text-gray-600">Manage system alerts and notifications</p>
              </div>
            </div>
            
            <Link
              to="/admin/manage-alerts/add"
              className="flex items-center justify-center bg-gradient-to-r hover:scale-105 from-GoldenYellow/80 to-GoldenYellow-Dark text-white px-4 py-3 rounded-lg hover:from-GoldenYellow-Dark hover:to-GoldenYellow/80 transition-transform shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2" />
              Buat Pemberitahuan
            </Link>
          </div>

          {/* Alert Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <>
              <Loader/>
              </>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  <FaBell className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No alerts yet</h3>
                <p className="mt-1 text-sm text-gray-500">Create your first alert to get started</p>
                <div className="mt-6">
                  <Link
                    to="/admin/manage-alerts/add"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-OxfordBlue hover:bg-OxfordBlue-Dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                    New Alert
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {alerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onEdit={() => navigate(`/admin/alerts/edit/${alert.id}`)}
                    onDelete={deleteAlert}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertManagement;