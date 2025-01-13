import { useState } from 'react';

const usePagination = (initialRowsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setCurrentPage(1); 
    };
   const paginateServers = (filteredServers) => {
        const indexOfLastServer = currentPage * rowsPerPage;
        const indexOfFirstServer = indexOfLastServer - rowsPerPage;
        return filteredServers.slice(
            indexOfFirstServer,
            indexOfLastServer
        );
    };

  return {
    currentPage,
    setCurrentPage,
    rowsPerPage,
      setRowsPerPage,
    handleRowsPerPageChange,
      paginateServers // Agregada la funcion al return
  };
};

export default usePagination;