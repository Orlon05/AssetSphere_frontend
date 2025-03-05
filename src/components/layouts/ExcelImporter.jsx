/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Table, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import style from "./excelImporter.module.css";
import PropTypes from "prop-types";

const ExcelImporter = ({ onImportComplete, tableMetadata }) => {
    const [excelData, setExcelData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [fileError, setFileError] = useState("");
    const [showTable, setShowTable] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [sheetNames, setSheetNames] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState("");
    const [workbookData, setWorkbookData] = useState({});
    const [columnWidths, setColumnWidths] = useState({});
    const [resizingColumn, setResizingColumn] = useState(null);
    const startX = useRef(0);

    // Paginación
    const [rowsPerPage, setRowsPerPage] = useState(10); // Cantidad de filas por página
    const [currentPage, setCurrentPage] = useState(1); // Página actual

    const handleFileChange = (e) => {
        setFileError("");
        setSheetNames([]);
        setSelectedSheet("");
        setExcelData([]);
        setShowTable(false);
        const file = e.target.files[0];
        if (!file) return;
        const fileType = file.type;

        if (
            fileType !==
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            setFileError("Por favor, seleccione un archivo Excel válido (.xlsx)");
            setExcelData([]);
            setShowTable(false);
            setSheetNames([]);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                setSheetNames(workbook.SheetNames);
                setWorkbookData(workbook);
                console.log("Workbook Data:", workbook.SheetNames);
            }
            catch (error) {
                console.error("Error al leer archivo:", error);
                setFileError("Error al leer archivo. Por favor, inténtalo de nuevo.");
                setExcelData([]);
                setShowTable(false);
                setSheetNames([]);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSheetChange = (e) => {
        const selectedSheet = e.target.value;
        setSelectedSheet(selectedSheet);
        try {
            const worksheet = workbookData.Sheets[selectedSheet];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: null,
            });

            if (jsonData && jsonData.length > 0) {
                const headers = jsonData[0].map((header) => header || `Column ${columns.length + 1}`);
                const dataRows = jsonData.slice(1);
                console.log("Sheet Data:", dataRows);

                setColumns(headers);
                setExcelData(dataRows);
                setShowTable(true);
            } else {
                setFileError("El archivo Excel está vacío.");
                setExcelData([]);
                setShowTable(false);
            }
        } catch (error) {
            console.error("Error al leer la hoja:", error);
            setFileError("Error al leer la hoja. Por favor, inténtalo de nuevo.");
            setExcelData([]);
            setShowTable(false);
        }
    };

    const handleCellValueChange = useCallback(
        (rowIndex, colIndex, value) => {
            setExcelData((prevData) => {
                const newData = [...prevData];
                if (!newData[rowIndex]) {
                    newData[rowIndex] = []; // Ensure the row exists
                }
                newData[rowIndex][colIndex] = value;
                return newData;
            });
        },
        []
    );

    const mapExcelData = (excelData, tableMetadata) => {
        return excelData.map((row) => {
            const mappedRow = {};
            row.forEach((cell, index) => {
                const columnMetadata = tableMetadata?.[index];
                if (columnMetadata) {
                    mappedRow[columnMetadata.name] = cell;
                }
            });
            return mappedRow;
        });
    };

    // Paginación: Cambiar página
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Resetear a la primera página cuando cambie el número de filas por página
    };

    // Calcular las filas que se mostrarán según la página actual y la cantidad de filas por página
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = excelData.slice(indexOfFirstRow, indexOfLastRow);

    const handleSaveData = useCallback(async () => {
        const validationErrors = validateData(tableMetadata);
        if (validationErrors.length > 0) {
            Swal.fire({
                icon: "error",
                title: "Validación Fallida",
                html:
                    "Se encontraron los siguientes errores:<br>" +
                    validationErrors.join("<br>"),
            });
            return;
        }
        setIsSaving(true);
        Swal.fire({
            title: 'Guardando Datos...',
            html: 'Por favor, espera mientras guardamos los datos.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        try {
            // Simulación de guardado
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una llamada async a la base de datos
            Swal.fire({
                icon: "success",
                title: "Datos Guardados",
                text: "Los datos se han guardado correctamente.",
            });
            if (typeof onImportComplete === 'function') {
                const mappedData = mapExcelData(excelData, tableMetadata);
                onImportComplete(mappedData);
            }
            setExcelData([]);
            setColumns([]);
            setShowTable(false);
            setSheetNames([]);
            setSelectedSheet("");
        }
        catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire({
                icon: "error",
                title: "Error al Guardar",
                text: error.message || "Ocurrió un error al intentar guardar los datos.",
            });
        } finally {
            setIsSaving(false);
        }
    }, [excelData, onImportComplete, tableMetadata]);

    const validateData = (tableMetadata) => {
        const errors = [];
        excelData.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const columnMetadata = tableMetadata?.[colIndex];
                if (columnMetadata?.required && (cell === null || cell === undefined || cell === "")) {
                    errors.push(
                        `Fila ${rowIndex + 1}, columna ${colIndex + 1
                        }: el campo no puede estar vacío.`
                    );
                }
                if (columnMetadata?.type === "number" && cell !== null && cell !== undefined && cell !== "" && isNaN(Number(cell))) {
                    errors.push(
                        `Fila ${rowIndex + 1}, columna ${colIndex + 1
                        }: el campo debe ser un número.`
                    );
                }
                if (columnMetadata?.type === "integer" && cell !== null && cell !== undefined && cell !== "" && !Number.isInteger(Number(cell))) {
                    errors.push(
                        `Fila ${rowIndex + 1}, columna ${colIndex + 1
                        }: el campo debe ser un entero.`
                    );
                }
            });
        });
        return errors;
    };

    return (
        <div className={style.container}>
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className={style.inputExcel}
            />
            {fileError && <div className={style.error}>{fileError}</div>}
            {sheetNames.length > 0 && (
                <Form.Select
                    value={selectedSheet}
                    onChange={handleSheetChange}
                    className={style.selectLine}
                >
                    <option value="">Seleccionar Hoja</option>
                    {sheetNames.map((sheetName) => (
                        <option key={sheetName} value={sheetName}>
                            {sheetName}
                        </option>
                    ))}
                </Form.Select>
            )}
            {showTable && (
                <div className={style.tableContainer}>
                    <div className="table-responsive"> {/* Contenedor de desplazamiento */}
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    {columns.map((header, index) => (
                                        <th key={index} style={{ width: columnWidths[index] }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <span> {header} </span>
                                                <span
                                                    className={style.resizeHandle}
                                                    onMouseDown={(e) => handleResizeStart(e, index)}
                                                >
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {row.map((cell, colIndex) => (
                                            <td key={colIndex} style={{ width: columnWidths[colIndex] }} className={cell === null || cell === undefined || cell === "" ? style.emptyCell : ""}>
                                                <Form.Control
                                                    type="text"
                                                    value={cell === null ? "" : cell}
                                                    placeholder={cell === null ? "Rellenar aquí" : ""}
                                                    onChange={(e) =>
                                                        handleCellValueChange(rowIndex, colIndex, e.target.value)
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <div className={style.paginationControls}>
                        <div>
                            Filas por página:
                            <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div>
                            Página:
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </button>
                            <span>{currentPage}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={indexOfLastRow >= excelData.length}
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                    <Button variant="primary" onClick={handleSaveData} disabled={isSaving}>
                        Guardar Datos
                    </Button>
                </div>
            )}


        </div>
    );
};

ExcelImporter.propTypes = {
    onImportComplete: PropTypes.func,
    tableMetadata: PropTypes.array.isRequired,
};

export default ExcelImporter;
