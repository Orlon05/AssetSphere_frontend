import { useState, useEffect,} from "react";
import { FaServer } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { GrFormViewHide } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./fisicos.module.css";
import useFetchData from "../../hooks/useFetchData";
import useSearch from "../../hooks/useSearch";
import useExport from "../../hooks/useExport";
import Table from "../layouts/Table";
import usePagination from "../../hooks/usePagination";
import useSelection from "../../hooks/useSelection";
import DeleteButton from "../buttons/DeleteButton";

const ServidoresFisicos = () => {
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8000/servers/physical";
  const {searchValue, handleSearchChange, handleSearchButtonClick, clearSearch , isSearchButtonClicked, isSearching, searchInputRef} = useSearch();
  const { data, loading, error, fetchData } = useFetchData(baseUrl);
  const { exportToExcel } = useExport();
  const { selectedItems, toggleSelectAll, toggleSelectItem, clearSelected } = useSelection();
  const { currentPage, rowsPerPage, handlePageChange, handleRowsPerPageChange, setCurrentPage } = usePagination();
  const [unfilteredServers, setUnfilteredServers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectAll, setSelectAll] = useState(false);

   const fetchServers = async (page, limit, search = "") => {
       const result = await fetchData(`?page=${page}&limit=${limit}&name=${search}`);
       if(result) setUnfilteredServers(result.servers);
     };
  const fetchSearch = async (search) => {
       await fetchData(`/search?name=${search}&page=${currentPage}&limit=${rowsPerPage}`);
   };

  useEffect(() => {
    fetchServers(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage]);

  useEffect(() => {
      if(isSearchButtonClicked){
         if(searchValue.trim() === "") {
             fetchServers(currentPage, rowsPerPage);
         }else {
             setCurrentPage(1);
             fetchSearch(searchValue);
         }
      }
  }, [isSearchButtonClicked, searchValue, rowsPerPage]);

  const handleExport = () => {
    exportToExcel(data?.servers || [], "servidores_fisicos");
  };
  const handleEdit = (serverId) => {
    navigate(`/editar/${serverId}/servidores`);
  };
  const handleDeleteServer = async (serverId) => {
    const token = localStorage.getItem("authenticationToken");
      try{
       const response =  await fetch(
           `${baseUrl}/${serverId}`, {
             method: "DELETE",
               headers: {
                 Authorization: `Bearer ${token}`,
               },
         });
      if (!response.ok) {
            throw await response.json();
        }
      clearSelected();
      fetchServers(currentPage, rowsPerPage);
     }catch(error){
       throw error;
      }
  };

  useEffect(() => {
    clearSearch();
    clearSelected();
  }, []);
  const columns = [
    {
        header: "Servidor",
        key: 'name'
    },
    {
        header: "Estado",
         cell: (item) =>
            <div className={style.serverStatus}>
             <span
               className={
                 item.status.toLowerCase() === "encendido"
                   ? style.online
                   : item.status.toLowerCase() === "mantenimiento"
                   ? style.maintenance
                   : style.offline
               }
             ></span>
           {item.status}
         </div>
    },
   {
        header: "Serial",
        key: 'serial'
    },
    {
        header: "IP",
        key: 'ip_address'
    },
   {
    header: "Acciones",
    cell: (item) =>
      <div className={style.contBtns}>
         <button className={style.btnVer} onClick={() => {}}>
           <GrFormViewHide />
         </button>
         <button className={style.btnEdit} onClick={() => handleEdit(item.id)}>
           <MdEdit />
         </button>
         <DeleteButton onDelete={handleEdit} itemId={item.id} />
        </div>,
    }

  ];

  const irCrear = () => {
    navigate("/crear-servidores-f");
  };
  const selectedCount = selectedItems.size;

   if (loading) {
       return <div>Loading...</div>;
     }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>
          <FaServer /> Lista de Servidores
        </h1>
        <button className={style.btnAdd} onClick={irCrear}>
          <IoIosAdd className={style.icon} /> Crear
        </button>
        <button className={style.btnImport}>
          <CiImport className={style.icon} /> Importar
        </button>
        <button className={style.btnExport} onClick={handleExport}>
          <CiExport className={style.icon} /> Exportar
        </button>
      </div>
       <div
        className={`${style.searchContainer} ${
          selectedCount > 0 ? style.searchContainerSelected : ""
        }`}
      >
        {selectedCount === 0 && (
          <>
            <input
              className={style.searchInput}
              type="search"
              placeholder="Buscar servidor..."
              value={searchValue}
              onChange={handleSearchChange}
              ref={searchInputRef}
            />
            <button
              className={style.searchIcon}
              onClick={handleSearchButtonClick}
            >
              <CiSearch className={style.iconS} />
            </button>
          </>
        )}
         {selectedCount > 0 && (
          <span className={style.selectedCount}>
            <span>{selectedCount}</span>
            <span>
              Servidor{selectedCount !== 1 ? "es" : ""} Seleccionado
              {selectedCount !== 1 ? "s" : ""}
            </span>
          </span>
        )}
      </div>
    <Table
      columns={columns}
      data={data?.servers || []}
      selectedItems={selectedItems}
      toggleSelectItem={toggleSelectItem}
      selectAll={selectAll}
      toggleSelectAll={toggleSelectAll}
      rowsPerPage={rowsPerPage}
      handleRowsPerPageChange={handleRowsPerPageChange}
      currentPage={currentPage}
      totalRows={unfilteredServers.length}
      handlePageChange={handlePageChange}
    />
    </div>
  );
};

export default ServidoresFisicos;