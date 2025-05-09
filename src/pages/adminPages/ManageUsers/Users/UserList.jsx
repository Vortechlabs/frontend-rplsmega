import React from 'react';
import UserCard from './UserCard';
import Pagination from '../../../../components/Pagination';

const UserList = ({ 
  users, 
  currentPage, 
  totalPages, 
  onPageChange,
  onEdit,
  onDelete,
  type = 'user' // 'admin' or 'user'
}) => {
  return (
    <div className="space-y-4">
      {users.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {users.map(user => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={onEdit}
                onDelete={onDelete}
                showRoleBadge={type === 'admin'}
                showClass={type === 'user'}
                showUsername={type === 'user'}
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
          No users found
        </div>
      )}
    </div>
  );
};

export default UserList;