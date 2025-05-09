import React from 'react';
import ProjectCard from './ProjectCard';
import Pagination from '../../../../components/Pagination';

const ProjectList = ({ 
  projects, 
  currentPage, 
  totalPages, 
  onPageChange,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      {projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={onDelete}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No projects found
        </div>
      )}
    </div>
  );
};

export default ProjectList;