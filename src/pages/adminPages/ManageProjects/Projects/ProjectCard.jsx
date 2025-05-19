import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaGithub, FaYoutube, FaUsers, FaCode, FaGlobe, FaMobileAlt, FaDesktop, FaPalette, FaLink } from 'react-icons/fa';
import defaultProjectImage from '/defaultProfile.jpg';

const ProjectCard = ({ project, onDelete }) => {
  const getCategoryIcon = (categoryName) => {
  const iconStyle = "text-sm";
    switch(categoryName.toLowerCase()) {
        case 'website':
        return <FaGlobe className={`${iconStyle} text-OxfordBlue`} />;
        case 'mobile app':
        return <FaMobileAlt className={`${iconStyle} text-OxfordBlue`} />;
        case 'desktop app':
        return <FaDesktop className={`${iconStyle} text-OxfordBlue`} />;
        case 'design':
        return <FaPalette className={`${iconStyle} text-OxfordBlue`} />;
        default:
        return <FaCode className={`${iconStyle} text-OxfordBlue`} />;
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Baru saja';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        hari: 86400,
        jam: 3600,
        menit: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : ''} yang lalu`;
        }
    }
    
    return 'Baru saja';
};

  return (
    <div className="card flex flex-col md:flex-row items-start md:items-center gap-5 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      {/* Project Image */}
      <div className="relative flex shrink-0 w-full md:w-40 h-40 md:h-24">
        <div className="rounded-xl overflow-hidden w-full h-full">
          {project.project_image?.length > 0 ? (
            <img
              src={`https://apirpl.smkn1purbalingga.sch.id/storage/${project.project_image[0].projectImage}`}
              className="w-full h-full object-cover"
              alt={project.title}
            />
          ) : (
            <img
              src={defaultProjectImage}
              className="w-full h-full object-cover"
              alt="Default project"
            />
          )}
        </div>
      </div>
      
      {/* Project Details */}
      <div className="w-full">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1">{project.title}</h3>
          <span className="bg-blue-100 flex gap-2 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                {getCategoryIcon(project.category?.name)}
                <span className='hidden md:block'>{project.category?.name}</span>
            </span>
        </div>
        
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap items-center gap-3 mt-3">
          {/* Technology Tags */}
          {project.technology && (
            <div className="flex items-center gap-1">
                <FaCode className='text-OxfordBlue'/>
              <span className="text-xs text-gray-500">{project.technology}</span>
            </div>
          )}
          
          {/* Team Members */}
          {project.team?.length > 0 && (
            <div className="flex items-center gap-1">
                <FaUsers className='text-OxfordBlue'/>       
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, index) => (
                  <div 
                    key={index} 
                    className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs"
                    title={member.memberName}
                  >
                    {member.memberName.charAt(0)}
                  </div>
                ))}
                {project.team.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs">
                    +{project.team.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Time Uploads */}
          {project.technology && (
            <div className="flex items-center gap-1">
              <div className='h-2 w-2 bg-GoldenYellow rounded-full'></div>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(project.created_at)}               
              </span>
            </div>
          )}

          {/* Project Links */}
          <div className="flex items-center gap-3 ml-auto">
            {project.repository && (
              <a 
                href={project.repository} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                title="Tautan Karya"
              >
                <FaLink />
              </a>
            )}
            {project.videoUrl && (
              <a 
                href={project.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-red-600"
                title="YouTube Video"
              >
                <FaYoutube />
              </a>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col md:flex-row justify-end items-center gap-3 w-full md:w-auto mt-3 md:mt-0">
        <Link 
          to={`/admin/manage-projects/detail/${project.slug}`}
          className="w-full md:w-fit hover:scale-105 transition rounded-full border border-[#060A23] p-3 md:px-5 font-semibold text-nowrap flex items-center justify-center gap-2"
        >
          <FaEdit size={14} /> Kelola
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;