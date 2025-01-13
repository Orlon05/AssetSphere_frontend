import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useFetchServers = (token) => {
    const [servers, setServers] = useState([]);
    const [unfilteredServers, setUnfilteredServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false);


    const handleError = (error) => {
        setError(error);
        console.error("Error al obtener servidores:", error);
    };

    const fetchServers = async (page, limit, search = "") => {
        if (isSearching) return;
         setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8000/servers/physical?page=${page}&limit=${limit}&name=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw await response.json();
            }

            const data = await response.json();
            if (data && data.status === "success" && data.data) {
                 setUnfilteredServers(data.data.servers);
                setServers(data.data.servers);
               setTotalPages(data.data.total_pages || 0);
            } else {
                throw new Error("Respuesta inesperada de la API");
            }
        } catch (error) {
            handleError(error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.msg || error.message || "Ha ocurrido un error.",
             });
        } finally {
            setLoading(false);
            setIsSearching(false);
        }
    };
    const fetchSearch = async (search, currentPage, rowsPerPage) => {
        if (isSearching) return;
          setIsSearching(true);
         setLoading(true);
          setError(null);
        try {
             const response = await fetch(
                `http://localhost:8000/servers/physical/search?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw await response.json();
            }

            const data = await response.json();
            if (data && data.status === "success" && data.data) {
                 setServers(data.data.servers);
                setTotalPages(data.data.total_pages || 0);
             } else {
                 throw new Error("Respuesta inesperada de la API");
            }
        } catch (error) {
          handleError(error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.msg || error.message || "Ha ocurrido un error.",
            });
        } finally {
             setLoading(false);
            setIsSearching(false);
        }
    };


    return {
        servers,
        unfilteredServers,
        loading,
        error,
        totalPages,
         fetchServers,
        fetchSearch,
        setServers,
        setTotalPages,
          setIsSearching,
    };
};

export default useFetchServers;