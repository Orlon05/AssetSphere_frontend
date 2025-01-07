import { useState, useEffect } from "react";

const usePagination = (initialRowsPerPage = 10) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleRowsPerPageChange = (e) => {
      setRowsPerPage(parseInt(e.target.value, 10));
  };

  return {
    currentPage,
    rowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    setCurrentPage,
  };
};
export default usePagination;