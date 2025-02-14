/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { FaDatabase } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { Table, Pagination, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import style from "./baseDatos.module.css";
import useExport from "../../hooks/useExport";
import ExcelImporter from "../layouts/ExcelImporter";
import React from "react";

const BaseDeDatos = () => {
    const [searchValue, setSearchValue] = useState("");
    const [base_datos, setBasesDeDatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedBasesDeDatos, setSelectedBasesDeDatos] = useState(new Set());
    const navigate = useNavigate();
    const { exportToExcel } = useExport();

    //USO DEL IMPORT
    const handleImport = () => {
        Swal.fire({
            title: "Importar desde Excel",
            html: '<div id="excel-importer-container"></div>',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            width: "80%",
            height: "80%",
            /*
           customClass: {
              container: 'swal-custom-container',
              popup: 'swal-custom-popup',
              content: 'swal-custom-content'
           },
           grow:false,
         */
            didOpen: () => {
                const container = document.getElementById("excel-importer-container");
                const tableMetadata = [
                    { name: "instance_id", required: true, type: "string" },
                    { name: "cost_center", required: true, type: "string" },
                    { name: "category", required: true, type: "string" },
                    { name: "type", required: true, type: "string" },
                    { name: "item", required: true, type: "string" },
                    { name: "owner_contact", required: true, type: "string" },
                    { name: "name", required: true, type: "string" },
                    { name: "application_code", required: true, type: "string" },
                    { name: "inactive", required: true, type: "string" },
                    { name: "asset_life_cycle_status", required: true, type: "string" },
                    { name: "system_environment", required: true, type: "string" },
                    { name: "cloud", required: true, type: "string" },
                    { name: "version_number", required: true, type: "string" },
                    { name: "serial", required: true, type: "string" },
                    { name: "ci_tag", required: true, type: "string" },
                    { name: "instance_name", required: true, type: "string" },
                    { name: "model", required: true, type: "string" },
                    { name: "ha", required: true, type: "string" },
                    { name: "port", required: true, type: "string" },
                    { name: "owner_name", required: true, type: "string" },
                    { name: "department", required: true, type: "string" },
                    { name: "company", required: true, type: "string" },
                    { name: "manufacturer_name", required: true, type: "string" },
                    { name: "supplier_name", required: true, type: "string" },
                    { name: "supported", required: true, type: "string" },
                    { name: "account_id", required: true, type: "string" },
                    { name: "create_date", required: true, type: "DateTime" },
                    { name: "modified_date", required: true, type: "DateTime" }
                ];
                const importer = (
                    <ExcelImporter
                        onImportComplete={handleImportComplete}
                        tableMetadata={tableMetadata}
                    />
                );
                if (container) {
                    const root = createRoot(container);
                    root.render(importer);
                }
            },
            willClose: () => {
                const container = document.getElementById("excel-importer-container");
                if (container) {
                    const root = createRoot(container);
                    root.unmount();
                }
            },
        });
    };

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    const showSuccessToast = () => {
        Toast.fire({
            icon: "success",
            title: "Base de datos eliminada exitosamente",
        });
    };

    //La variable handleImportComplete es la que se encarga de tomar/mapear la información al importar el archivo de excel.
    const handleImportComplete = async (importedData) => {
        console.log("Datos importados listos para enviar:", importedData);

        if (!Array.isArray(importedData) || importedData.length === 0) {
            Swal.fire("Error", "No se encontraron datos válidos en el archivo", "error");
            return;
        }

        try {
            const token = localStorage.getItem("authenticationToken");
            if (!token) {
                throw new Error("Token de autorización no encontrado.");
            }
            // Se deben colocar todas las propiedades/campos de la tabla a la cual se le este haciendo la vista a excepción de la clave prinaria, dicho campo no debe ir aquí
            const formattedData = importedData.map(row => ({
                instance_id: row.instance_id || "",
                cost_center: row.cost_center || "",
                category: row.category || "",
                type: row.type || "",
                item: row.item || "",
                owner_contact: row.owner_contact || "",
                name: row.name || "",
                application_code: row.application_code || "",
                inactive: row.inactive || "",
                asset_life_cycle_status: row.asset_life_cycle_status || "",
                system_environment: row.system_environment || "",
                cloud: row.cloud || "",
                version_number: row.version_number || "",
                serial: row.serial || "",
                ci_tag: row.ci_tag || "",
                instance_name: row.instance_name || "",
                model: row.model || "",
                ha: row.ha || "",
                port: row.port || "",
                owner_name: row.owner_name || "",
                department: row.department || "",
                company: row.company || "",
                manufacturer_name: row.manufacturer_name || "",
                supplier_name: row.supplier_name || "",
                supported: row.supported || "",
                account_id: row.account_id || "",
                create_date: row.create_date || "",
                modified_date: row.modified_date || ""
            }));
            // Aquí se debe colocar la ruta del back-end que recibe la información del excel y la inserta en la BD
            const response = await fetch("http://localhost:8000/base_datos/add_from_excel", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status}`);
            }

            Swal.fire("Éxito", "Datos importados correctamente", "success");
        } catch (error) {
            console.error("Error al importar:", error);
            Swal.fire("Error", error.message || "Error al importar datos", "error");
        }
    };

    const selectedCount = selectedBasesDeDatos.size;

    const [showSearch, setShowSearch] = useState(true);
    const [unfilteredBasesDeDatos, setUnfilteredBasesDeDatos] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState(false);
    const searchInputRef = useRef(null);
    useEffect(() => {
        setShowSearch(selectedCount === 0);
    }, [selectedCount]);

    const irCrear = () => {
        navigate("/crear-base-de-datos");
    };
    const irVer = (baseDeDatosId) => {
        navigate(`/ver/${baseDeDatosId}/basedatos`);
    };
    const irEditar = (baseDeDatosId) => {
        navigate(`/editar/${baseDeDatosId}/basedatos`);
    };
    const handleError = (error) => {
        setError(error);
        console.error("Error al obtener las bases de datos:", error);
    };
    const token = localStorage.getItem("authenticationToken");
    const fetchBasesDeDatos = async (page, limit, search = "") => {
        if (isSearching) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8000/base_datos/get_all?page=${page}&limit=${limit}&name=${search}`,
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
                setUnfilteredBasesDeDatos(data.data.base_datos);
                setBasesDeDatos(data.data.base_datos);
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
    const fetchSearch = async (search) => {
        if (isSearching) return;
        setIsSearching(true);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8000/base_datos/search_by_name?name=${search}&page=${currentPage}&limit=${rowsPerPage}`,
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
                setBasesDeDatos(data.data.base_datos);
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

    useEffect(() => {
        fetchBasesDeDatos(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    useEffect(() => {
        if (isSearchButtonClicked) {
            if (searchValue.trim() === "") {
                setBasesDeDatos(unfilteredBasesDeDatos);
                setTotalPages(
                    unfilteredBasesDeDatos.length > 0
                        ? Math.ceil(unfilteredBasesDeDatos.length / rowsPerPage)
                        : 0
                );
            } else {
                setCurrentPage(1);
                fetchSearch(searchValue);
            }
            setIsSearchButtonClicked(false);
        }
    }, [isSearchButtonClicked, searchValue, unfilteredBasesDeDatos, rowsPerPage]);

    
    const BaseDeDatosMapper = (baseDeDatos) => {
        return {
            "InstanceId": baseDeDatos.instance_id || "",
            "Cost Center": baseDeDatos.cost_center || "",
            "Category": baseDeDatos.category || "",
            "Type": baseDeDatos.type || "",
            "Item": baseDeDatos.item || "",
            "OwnerContact": baseDeDatos.owner_contact || "",
            "Name": baseDeDatos.name || "",
            "ApplicationCode": baseDeDatos.application_code || "",
            "Inactive": baseDeDatos.inactive || "",
            "AssetLifecycleStatus": baseDeDatos.asset_life_cycle_status || "",
            "SystemEnvironment": baseDeDatos.system_environment || "",
            "isCloud": baseDeDatos.cloud || "",
            "VersionNumber": baseDeDatos.version_number || "",
            "SerialNumber": baseDeDatos.serial || "",
            "CITag": baseDeDatos.ci_tag || "",
            "InstanceName": baseDeDatos.instance_name || "",
            "Model": baseDeDatos.model || "",
            "HA": baseDeDatos.ha || "",
            "Port": baseDeDatos.port || "",
            "OwnerName": baseDeDatos.owner_name || "",
            "Department": baseDeDatos.department || "",
            "Company": baseDeDatos.company || "",
            "ManufacturerName": baseDeDatos.manufacturer_name || "",
            "Supplier Name+": baseDeDatos.supplier_name || "",
            "Supported": baseDeDatos.supported || "",
            "AccountID": baseDeDatos.account_id || "",
            "CreateDate": baseDeDatos.create_date || "",
            "ModifiedDate": baseDeDatos.modified_date || "",

        };
    };

    // Esta variable genera un archivo de excel con la información que se muestra en la vista principal
    const handleExport = () => {
        exportToExcel(base_datos, "baseDeDatos", BaseDeDatosMapper); //AQUI USAMO EL HOOK QUE EXPORTA A EXCEL
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
        searchInputRef.current.focus();
    };

    const handleSearchButtonClick = () => {
        setIsSearchButtonClicked(true); // Activa la busqueda
    };

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);
        if (selectAll) {
            setSelectedBasesDeDatos(new Set());
        } else {
            setSelectedBasesDeDatos(new Set(base_datos.map((baseDeDatos) => baseDeDatos.id)));
        }
    };

    const toggleSelectBasesDeDatos = (baseDeDatosId) => {
        const newSelectedBasesDeDatos = new Set(selectedBasesDeDatos);
        if (newSelectedBasesDeDatos.has(baseDeDatosId)) {
            newSelectedBasesDeDatos.delete(baseDeDatosId);
        } else {
            newSelectedBasesDeDatos.add(baseDeDatosId);
        }
        setSelectedBasesDeDatos(newSelectedBasesDeDatos);
    };
    const filteredBasesDeDatos = base_datos.filter((baseDeDatos) =>
        baseDeDatos.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const indexOfLastBaseDatos = currentPage * rowsPerPage;
    const indexOfFirstBaseDatos = indexOfLastBaseDatos - rowsPerPage;
    const handleDeleteStorage = async (baseDeDatosId) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas eliminar esta base de datos?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        `http://localhost:8000/base_datos/delete/${baseDeDatosId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        let errorMessage = `Error HTTP ${response.status}`;
                        let errorData;

                        try {
                            errorData = await response.json();
                            if (response.status === 422 && errorData && errorData.detail) {
                                errorMessage = errorData.detail.map((e) => e.msg).join(", ");
                            } else if (response.status === 401 || response.status === 403) {
                                errorMessage =
                                    "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
                            } else if (response.status === 404) {
                                errorMessage = "La base de datos no existe.";
                            } else if (errorData && errorData.message) {
                                errorMessage = errorData.message;
                            }
                        } catch (errorParse) {
                            console.error("Error parsing error response:", errorParse);
                            errorMessage = `Error al procesar la respuesta del servidor.`;
                            handleError(errorParse);
                        }

                        Swal.fire({
                            icon: "error",
                            title: "Error al eliminar la base de datos",
                            text: errorMessage,
                        });
                    } else {
                        setBasesDeDatos(base_datos.filter((baseDeDatos) => baseDeDatos.id !== baseDeDatosId));
                        showSuccessToast();
                    }
                } catch (error) {
                    console.error("Error al eliminar la base de datos:", error);
                    handleError(error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error inesperado al eliminar la base de datos.",
                    });
                }
            }
        });
    };

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
                    <FaDatabase /> Lista de Bases de datos
                </h1>
                <button className={style.btnAdd} onClick={irCrear}>
                    <IoIosAdd className={style.icon} /> Crear
                </button>
                <button className={style.btnImport} onClick={handleImport}>
                    <CiImport className={style.icon} /> Importar
                </button>
                <button className={style.btnExport} onClick={handleExport}>
                    <CiExport className={style.icon} /> Exportar
                </button>
            </div>
            <div
                className={`${style.searchContainer} ${selectedCount > 0 ? style.searchContainerSelected : ""
                    }`}
            >
                {showSearch && (
                    <>
                        <input
                            className={style.searchInput}
                            type="search"
                            placeholder="Buscar base de datos..."
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
                            Base de datos{selectedCount !== 1 ? "es" : ""} Seleccionada
                            {selectedCount !== 1 ? "s" : ""}
                        </span>
                    </span>
                )}
            </div>
            <div className={style.container}>
                <Table className={`${style.table} ${style.customTable}`}>
                    <thead>
                        <tr>
                            <th className={style.contChek}>
                                <input
                                    type="checkbox"
                                    className={style.customCheckbox}
                                    checked={
                                        base_datos.length > 0 &&
                                        selectedBasesDeDatos.size === base_datos.length
                                    }
                                    onChange={toggleSelectAll}
                                />
                                {/* Modificar hacia abajo */}
                            </th>
                            <th>name</th>
                            <th>instance_id</th>
                            <th>cost_center</th>
                            <th>category</th>
                            <th className={style.contBtns}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {base_datos.map((baseDeDatos) => (
                            <tr
                                key={baseDeDatos.id}
                                className={
                                    selectedBasesDeDatos.has(baseDeDatos.id) ? style.selectedRow : ""
                                }
                            >
                                <td>
                                    <input
                                        type="checkbox"
                                        className={style.customCheckbox}
                                        checked={selectedBasesDeDatos.has(baseDeDatos.id)}
                                        onChange={() => toggleSelectBasesDeDatos(baseDeDatos.id)}
                                    />
                                </td>
                                <td>{baseDeDatos.name}</td>
                                <td>{baseDeDatos.instance_id}</td>
                                <td>{baseDeDatos.cost_center}</td>
                                <td>{baseDeDatos.category}</td>
                                <td>
                                    <button className={style.btnVer}
                                        onClick={() => irVer(baseDeDatos.id)}>
                                        <MdVisibility />
                                    </button>
                                    <button
                                        className={style.btnEdit}
                                        onClick={() => irEditar(baseDeDatos.id)}
                                    >
                                        <MdEdit />
                                    </button>
                                    <button
                                        className={style.btnDelete}
                                        onClick={() => {
                                            handleDeleteStorage(baseDeDatos.id);
                                        }}
                                    >
                                        <MdDelete />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className={style.contFil} colSpan="2">
                                <div
                                    className={`d-flex justify-content-start align-items-center ${style.tfootSmall}`}
                                >
                                    <span className={style.textfoot}>Filas por página:</span>
                                    <Form.Select
                                        value={rowsPerPage}
                                        onChange={(e) =>
                                            setRowsPerPage(parseInt(e.target.value, 10))
                                        }
                                        className={style.selectLine}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                    </Form.Select>
                                </div>
                            </td>
                            <td colSpan="1">
                                <div
                                    className={`d-flex justify-content-center align-items-center ${style.tfootSmall}`}
                                >
                                    <span>{`${indexOfFirstBaseDatos + 1}-${Math.min(
                                        indexOfLastBaseDatos,
                                        filteredBasesDeDatos.length
                                    )} de ${filteredBasesDeDatos.length}`}</span>
                                </div>
                            </td>
                            <td className={style.contFilDos} colSpan="3">
                                <div
                                    className={`d-flex justify-content-end align-items-center ${style.tfootSmall}`}
                                >
                                    <Pagination className={style.pestanas}>
                                        <Pagination.Prev
                                            onClick={() =>
                                                setCurrentPage(Math.max(1, currentPage - 1))
                                            }
                                        />
                                        <Pagination.Item>{currentPage}</Pagination.Item>
                                        <Pagination.Next
                                            onClick={() =>
                                                setCurrentPage(Math.min(totalPages, currentPage + 1))
                                            }
                                        />
                                    </Pagination>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </div>
        </div>
    );
};

export default BaseDeDatos;

