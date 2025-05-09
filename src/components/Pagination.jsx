// components/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (startPage > 1) {
        if (startPage > 2) {
          pages.unshift('...');
        }
        pages.unshift(1);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-full border border-gray-300 mr-2 disabled:opacity-50 hover:bg-OxfordBlue-Dark hover:text-white"
      >
        <FaChevronLeft />
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' ? onPageChange(page) : null}
          className={`w-10 h-10 mx-1 rounded-full ${
            currentPage === page 
              ? 'bg-OxfordBlue text-white' 
              : 'border border-gray-300 hover:bg-OxfordBlue-Dark hover:text-white'
          } ${typeof page !== 'number' ? 'cursor-default' : ''}`}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-full border border-gray-300 ml-2 disabled:opacity-50 hover:bg-OxfordBlue-Dark hover:text-white"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination;