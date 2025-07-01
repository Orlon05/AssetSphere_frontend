import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

/**
 * Componente para importar y procesar archivos Excel con funcionalidades avanzadas
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onImportComplete - Callback ejecutado cuando la importación se completa exitosamente
 * @param {Array} props.tableMetadata - Metadatos de la tabla que definen la estructura y validaciones de las columnas
 *
 * @example
 * // Uso básico del componente
 * const tableMetadata = [
 *   { name: 'nombre', type: 'string', required: true },
 *   { name: 'edad', type: 'number', required: false },
 *   { name: 'email', type: 'string', required: true }
 * ];
 *
 * const handleImportComplete = (data) => {
 *   console.log('Datos importados:', data);
 *   // Procesar los datos importados
 * };
 *
 * <ExcelImporter
 *   onImportComplete={handleImportComplete}
 *   tableMetadata={tableMetadata}
 * />
 *
 * @returns {JSX.Element} Componente de importación de Excel
 */
const ExcelImporter = ({ onImportComplete, tableMetadata }) => {
  // ==================== ESTADO DEL COMPONENTE ====================

  /**
   * Datos extraídos del archivo Excel
   * @type {Array<Array>} Array bidimensional con los datos de las celdas
   */
  const [excelData, setExcelData] = useState([]);

  /**
   * Nombres de las columnas del archivo Excel
   * @type {Array<string>} Array con los nombres de las columnas
   */
  const [columns, setColumns] = useState([]);

  /**
   * Mensaje de error relacionado con el archivo
   * @type {string} Mensaje de error o cadena vacía
   */
  const [fileError, setFileError] = useState("");

  /**
   * Controla la visibilidad de la tabla de datos
   * @type {boolean} true si la tabla debe mostrarse
   */
  const [showTable, setShowTable] = useState(false);

  /**
   * Estado de guardado de datos
   * @type {boolean} true si se está guardando
   */
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Nombres de las hojas del archivo Excel
   * @type {Array<string>} Array con los nombres de las hojas
   */
  const [sheetNames, setSheetNames] = useState([]);

  /**
   * Hoja seleccionada actualmente
   * @type {string} Nombre de la hoja seleccionada
   */
  const [selectedSheet, setSelectedSheet] = useState("");

  /**
   * Datos completos del libro de Excel
   * @type {Object} Objeto workbook de XLSX
   */
  const [workbookData, setWorkbookData] = useState({});

  /**
   * Anchos personalizados de las columnas
   * @type {Object} Objeto con índices de columna como claves y anchos como valores
   */
  const [columnWidths, setColumnWidths] = useState({});

  /**
   * Columna que se está redimensionando
   * @type {number|null} Índice de la columna o null
   */
  const [resizingColumn, setResizingColumn] = useState(null);

  /**
   * Posición X inicial para el redimensionamiento
   * @type {React.RefObject<number>} Referencia a la posición X
   */
  const startX = useRef(0);

  // ==================== ESTADO DE PAGINACIÓN ====================

  /**
   * Número de filas por página
   * @type {number} Cantidad de filas a mostrar por página
   */
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /**
   * Página actual
   * @type {number} Número de página actual (base 1)
   */
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== MANEJADORES DE EVENTOS ====================

  /**
   * Maneja el cambio de archivo Excel seleccionado
   * Valida el tipo de archivo y lee su contenido
   *
   * @param {Event} e - Evento de cambio del input file
   */
  const handleFileChange = (e) => {
    // Limpiar estados previos
    setFileError("");
    setSheetNames([]);
    setSelectedSheet("");
    setExcelData([]);
    setShowTable(false);

    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
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

    // Leer archivo
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        setSheetNames(workbook.SheetNames);
        setWorkbookData(workbook);
      } catch (error) {
        console.error("Error al leer archivo:", error);
        setFileError("Error al leer archivo. Por favor, inténtalo de nuevo.");
        setExcelData([]);
        setShowTable(false);
        setSheetNames([]);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  /**
   * Maneja el cambio de hoja seleccionada
   * Procesa los datos de la hoja seleccionada y los prepara para visualización
   *
   * @param {Event} e - Evento de cambio del select
   */
  const handleSheetChange = (e) => {
    const selectedSheet = e.target.value;
    setSelectedSheet(selectedSheet);

    try {
      const worksheet = workbookData.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
        raw: false, // Convertir todos los valores a strings
      });

      if (jsonData && jsonData.length > 0) {
        // Filtrar filas vacías
        const filteredData = jsonData.filter((row) =>
          row.some((cell) => cell !== null && cell !== undefined && cell !== "")
        );

        if (filteredData.length === 0) {
          setFileError("El archivo Excel no contiene datos válidos.");
          setExcelData([]);
          setShowTable(false);
          return;
        }

        // Procesar encabezados y datos
        const headers = filteredData[0].map(
          (header, idx) => header || `Column ${idx + 1}`
        );
        const dataRows = filteredData.slice(1);

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

  /**
   * Maneja el cambio de valor en una celda específica
   * Actualiza los datos del Excel en memoria
   *
   * @param {number} rowIndex - Índice de la fila
   * @param {number} colIndex - Índice de la columna
   * @param {string} value - Nuevo valor de la celda
   */
  const handleCellValueChange = useCallback((rowIndex, colIndex, value) => {
    setExcelData((prevData) => {
      const newData = [...prevData];
      if (!newData[rowIndex]) {
        newData[rowIndex] = []; // Asegurar que la fila existe
      }
      newData[rowIndex][colIndex] = value;
      return newData;
    });
  }, []);

  // ==================== FUNCIONES DE UTILIDAD ====================

  /**
   * Mapea los datos del Excel según los metadatos de la tabla
   * Convierte el array bidimensional en objetos con propiedades nombradas
   *
   * @param {Array<Array>} excelData - Datos del Excel en formato array bidimensional
   * @param {Array} tableMetadata - Metadatos que definen la estructura de la tabla
   * @returns {Array<Object>} Array de objetos con propiedades nombradas
   *
   * @example
   * // Entrada:
   * // excelData = [["Juan", 25], ["María", 30]]
   * // tableMetadata = [{name: "nombre"}, {name: "edad"}]
   * // Salida:
   * // [{nombre: "Juan", edad: 25}, {nombre: "María", edad: 30}]
   */
  const mapExcelData = (excelData, tableMetadata) => {
    // Verificar que tableMetadata sea un array
    if (!Array.isArray(tableMetadata)) {
      console.error("tableMetadata no es un array:", tableMetadata);
      return [];
    }

    return excelData.map((row) => {
      const mappedRow = {};

      // Verificar formato de tableMetadata
      if (
        tableMetadata.length > 0 &&
        typeof tableMetadata[0] === "object" &&
        "name" in tableMetadata[0]
      ) {
        // Formato: [{name: "nombre", ...}, {name: "otro", ...}]
        row.forEach((cell, index) => {
          if (index < tableMetadata.length) {
            const columnMetadata = tableMetadata[index];
            if (columnMetadata && columnMetadata.name) {
              mappedRow[columnMetadata.name] = cell;
            }
          }
        });
      } else {
        // Si tableMetadata es un array anidado, usar el primer elemento
        const metadataArray = Array.isArray(tableMetadata[0])
          ? tableMetadata[0]
          : tableMetadata;

        row.forEach((cell, index) => {
          if (index < metadataArray.length) {
            const columnMetadata = metadataArray[index];
            if (columnMetadata && columnMetadata.name) {
              mappedRow[columnMetadata.name] = cell;
            }
          }
        });
      }

      return mappedRow;
    });
  };

  /**
   * Valida los datos según los metadatos de la tabla
   * Verifica campos requeridos, tipos de datos y otras validaciones
   *
   * @param {Array} tableMetadata - Metadatos con las reglas de validación
   * @returns {Array<string>} Array de mensajes de error encontrados
   */
  const validateData = (tableMetadata) => {
    const errors = [];

    excelData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const columnMetadata = tableMetadata?.[colIndex];

        // Validar campos requeridos
        if (
          columnMetadata?.required &&
          (cell === null || cell === undefined || cell === "")
        ) {
          errors.push(
            `Fila ${rowIndex + 1}, columna ${
              colIndex + 1
            }: el campo no puede estar vacío.`
          );
        }

        // Validar tipo número
        if (
          columnMetadata?.type === "number" &&
          cell !== null &&
          cell !== undefined &&
          cell !== "" &&
          isNaN(Number(cell))
        ) {
          errors.push(
            `Fila ${rowIndex + 1}, columna ${
              colIndex + 1
            }: el campo debe ser un número.`
          );
        }

        // Validar tipo entero
        if (
          columnMetadata?.type === "integer" &&
          cell !== null &&
          cell !== undefined &&
          cell !== "" &&
          !Number.isInteger(Number(cell))
        ) {
          errors.push(
            `Fila ${rowIndex + 1}, columna ${
              colIndex + 1
            }: el campo debe ser un entero.`
          );
        }
      });
    });

    return errors;
  };

  // ==================== MANEJADORES DE PAGINACIÓN ====================

  /**
   * Cambia la página actual
   * @param {number} newPage - Nueva página a mostrar
   */
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  /**
   * Cambia el número de filas por página
   * @param {Event} event - Evento de cambio del select
   */
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10));
    setCurrentPage(1); // Resetear a la primera página
  };

  // Calcular las filas que se mostrarán según la página actual
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = excelData.slice(indexOfFirstRow, indexOfLastRow);

  // ==================== FUNCIÓN PRINCIPAL DE GUARDADO ====================

  /**
   * Guarda los datos importados después de validarlos
   * Ejecuta el callback onImportComplete con los datos mapeados
   */
  const handleSaveData = useCallback(async () => {
    // Validar datos
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

    // Verificar que haya datos para guardar
    if (excelData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Sin datos",
        text: "No hay datos para importar.",
      });
      return;
    }

    setIsSaving(true);

    // Mostrar loading
    Swal.fire({
      title: "Guardando Datos...",
      html: "Por favor, espera mientras guardamos los datos.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Mapear los datos
      const mappedData = mapExcelData(excelData, tableMetadata);

      // Verificar que se hayan mapeado correctamente
      if (mappedData.length === 0) {
        throw new Error("No se pudieron mapear los datos correctamente");
      }

      // Simulación de guardado (reemplazar con llamada real a la API)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mostrar éxito
      Swal.fire({
        icon: "success",
        title: "Datos Guardados",
        text: `Se han procesado ${mappedData.length} registros correctamente.`,
      });

      // Ejecutar callback si existe
      if (typeof onImportComplete === "function") {
        onImportComplete(mappedData);
      }

      // Limpiar estados
      setExcelData([]);
      setColumns([]);
      setShowTable(false);
      setSheetNames([]);
      setSelectedSheet("");
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al Guardar",
        text:
          error.message || "Ocurrió un error al intentar guardar los datos.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [excelData, onImportComplete, tableMetadata]);

  // ==================== RENDERIZADO DEL COMPONENTE ====================

  return (
    <div className="w-full max-w-full">
      {/* Área de carga de archivos */}
      <div className="mb-4">
        <label
          htmlFor="excel-file"
          className="block w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 focus:outline-none"
        >
          <div className="flex flex-col items-center justify-center">
            <svg
              className="mb-2 h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-1 text-sm font-medium text-gray-500">
              Haz clic para seleccionar un archivo Excel o arrastra y suelta
              aquí
            </p>
            <p className="text-xs text-gray-500">.xlsx</p>
          </div>
          <input
            id="excel-file"
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Mensaje de error */}
      {fileError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          <div className="flex">
            <svg
              className="mr-2 h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{fileError}</span>
          </div>
        </div>
      )}

      {/* Selector de hojas */}
      {sheetNames.length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="sheet-select"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Seleccionar Hoja
          </label>
          <select
            id="sheet-select"
            value={selectedSheet}
            onChange={handleSheetChange}
            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Seleccionar Hoja</option>
            {sheetNames.map((sheetName) => (
              <option key={sheetName} value={sheetName}>
                {sheetName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tabla de datos */}
      {showTable && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((header, index) => (
                    <th
                      key={index}
                      style={{ width: columnWidths[index] }}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div className="flex items-center justify-between whitespace-nowrap">
                        <span className="inline-block">{header}</span>
                        <span
                          className="ml-2 cursor-col-resize select-none border-l border-gray-300 pl-1"
                          onMouseDown={(e) => {
                            /* Implementar resize si es necesario */
                          }}
                        >
                          ⋮
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        style={{ width: columnWidths[colIndex] }}
                        className={`px-6 py-2 ${
                          cell === null || cell === undefined || cell === ""
                            ? "bg-yellow-50"
                            : ""
                        } whitespace-nowrap overflow-hidden text-ellipsis`}
                      >
                        <input
                          type="text"
                          value={cell === null ? "" : cell}
                          placeholder={cell === null ? "Rellenar aquí" : ""}
                          onChange={(e) =>
                            handleCellValueChange(
                              rowIndex + indexOfFirstRow,
                              colIndex,
                              e.target.value
                            )
                          }
                          className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Filas por página:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando {indexOfFirstRow + 1} a{" "}
                {Math.min(indexOfLastRow, excelData.length)} de{" "}
                {excelData.length} filas
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={indexOfLastRow >= excelData.length}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Botón de guardar */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveData}
              disabled={isSaving}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar Datos"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== VALIDACIÓN DE PROPS ====================

/**
 * Definición de tipos de props para validación en tiempo de desarrollo
 */
ExcelImporter.propTypes = {
  /**
   * Función callback ejecutada cuando la importación se completa
   * Recibe como parámetro un array de objetos con los datos importados
   */
  onImportComplete: PropTypes.func,

  /**
   * Array de metadatos que define la estructura de la tabla
   * Cada elemento debe tener al menos la propiedad 'name'
   * Propiedades opcionales: 'type', 'required', 'validation'
   */
  tableMetadata: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["string", "number", "integer", "boolean", "date"]),
      required: PropTypes.bool,
      validation: PropTypes.func,
    })
  ).isRequired,
};

/**
 * Valores por defecto de las props
 */
ExcelImporter.defaultProps = {
  onImportComplete: () => {
    console.log("Importación completada - No se proporcionó callback");
  },
};

export default ExcelImporter;
