import React from 'react';
import { Button } from '../Button/Button';
import './Pagination.css';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
}) => {
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= 7) {
      // Se há 7 ou menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sempre mostrar primeira página
      pageNumbers.push(1);

      // Determinar páginas ao redor da atual
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajustar quando está no início
      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }
      // Ajustar quando está no fim
      else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Adicionar ellipsis antes se necessário
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Adicionar páginas ao redor da atual
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          pageNumbers.push(i);
        }
      }

      // Adicionar ellipsis depois se necessário
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Sempre mostrar última página
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="shared-pagination">
      <div className="pagination-pages">
        {getPageNumbers().map((page, index) => {
          if (typeof page === 'number') {
            return (
              <button
                key={`page-${page}-${index}`}
                className={`pagination-page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          } else {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                {page}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
};
