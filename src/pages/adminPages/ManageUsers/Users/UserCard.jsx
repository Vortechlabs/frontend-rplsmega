import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaEnvelope, FaRegIdCard, FaSchool, FaTrash, FaUser } from 'react-icons/fa';
import defaultProfilePicture from '/defaultProfile.jpg';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete,
  showRoleBadge = true,
  showClass = true
}) => {
  return (
    <div className="card flex items-center gap-5 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="relative flex shrink-0 w-20 h-20">
        <div className="rounded-[20px] overflow-hidden">
          <img 
            src={user.profilePicture ? `http://127.0.0.1:8000/storage/${user.profilePicture}` : defaultProfilePicture}
            className="w-20 h-20 object-cover" 
            alt="profile" 
          />
        </div>
      </div>
      
      <div className="w-full">
        <h3 className="font-bold text-xl leading-[30px] line-clamp-1">{user.name}</h3>
        
        <div className="flex items-center gap-5 mt-2">
          <div className="flex items-center gap-2">
            {user.role === 'moderator' ? (
              <>
                <FaUser className='text-OxfordBlue'/>
                <p className="text-[#838C9D] text-sm">{user.username}</p>
              </>
            ) : (
              <>
                <FaRegIdCard className='text-OxfordBlue'/>
                <p className="text-[#838C9D] text-sm">{user.nis}</p>
              </>
            )}
          </div>
          
          {showClass && user.class && (
            <div className="flex items-center gap-2">
              <FaSchool className='text-OxfordBlue'/>
              <p className="text-[#838C9D] text-sm">{user.class}</p>
            </div>
          )}
          
          {showRoleBadge && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
              user.role === 'moderator' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          )}
        </div>
        
      </div>
      
      <div className="flex justify-end items-center gap-3">
        <button 
          onClick={() => onEdit(user.id)}
          className="w-fit hover:scale-105 transition rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap flex items-center gap-2"
        >
          <FaEdit /> Edit
        </button>
        <button 
          onClick={() => onDelete(user.id)}
          className="w-fit hover:scale-105 transition rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white text-nowrap flex items-center gap-2"
        >
          <FaTrash /> Hapus
        </button>
      </div>
    </div>
  );
};

export default UserCard;