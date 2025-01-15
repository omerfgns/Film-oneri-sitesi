import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.white};
  color: ${props => props.$active ? props.theme.colors.white : props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${props => props.theme.colors.primaryLight};
    color: ${props => props.theme.colors.white};
  }

  &:disabled {
    background: #ddd;
    cursor: not-allowed;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  const navigate = useNavigate(); // navigate hook'u

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    // Sayfa değiştirilirken URL'yi güncellemek
    navigate(`?page=${page}`);
    onPageChange(page); // sayfa değişikliğini ana bileşene bildir
  };

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </PageButton>

      {pages.map(page => (
        <PageButton
          key={page}
          $active={currentPage === page}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </PageButton>
      ))}

      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </PageButton>
    </PaginationContainer>
  );
}

export default Pagination;
