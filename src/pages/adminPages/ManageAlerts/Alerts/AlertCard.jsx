import React from 'react';
import { FaEdit, FaTrash, FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AlertCard = ({ alert, onDelete }) => {
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'danger': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    const iconClass = "text-5xl opacity-80";
    switch (type) {
      case 'info': return <FaInfoCircle className={`${iconClass} text-OxfordBlue`} />;
      case 'warning': return <FaExclamationTriangle className={`${iconClass} text-GoldenYellow-Dark `} />;
      case 'danger': return <FaExclamationCircle className={`${iconClass} text-red-500 `} />;
      case 'success': return <FaCheckCircle className={`${iconClass} text-green-800 `} />;
      default: return <FaInfoCircle className={`${iconClass} text-gray-800 `} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Alert Image or Icon */}
        <div className="w-full md:w-40 h-40 md:h-24 flex-shrink-0 flex items-center justify-center">
          {alert.image_path ? (
            <div className="rounded-xl overflow-hidden w-full h-full">
              <img
                src={`http://127.0.0.1:8000/storage/${alert.image_path}`}
                className="w-full h-full object-cover"
                alt={alert.title}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-tl from-gray-300 to-gray-200 rounded-xl">
              {getTypeIcon(alert.type)}
            </div>
          )}
        </div>
        
        {/* Alert Details */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3 className="font-bold text-xl text-gray-800">{alert.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(alert.type)}`}>
                  {alert.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {alert.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Start : {formatDate(alert.start_at)} <br />
              End : {formatDate(alert.end_at) || 'No end date'}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{alert.content}</p>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col md:flex-row justify-end items-center gap-3 w-full md:w-auto mt-3 md:mt-0">
          
          <Link
          to={`/admin/manage-alerts/edit/${alert.id}`}
            className="w-full md:w-fit hover:scale-105 transition rounded-full border border-[#060A23] p-3 md:px-5 font-semibold text-nowrap flex items-center justify-center gap-2"
          >
            <FaEdit size={14} /> Edit
          </Link>
          <button
            onClick={() => onDelete(alert.id)}
            className="w-full md:w-fit hover:scale-105 transition rounded-full p-3 md:px-5 bg-[#FF435A] font-semibold text-white text-nowrap flex items-center justify-center gap-2"
          >
            <FaTrash size={14} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;