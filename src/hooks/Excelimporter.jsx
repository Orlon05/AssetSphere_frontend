import { useState, useCallback, useRef } from "react"
import * as XLSX from "xlsx"
import Swal from "sweetalert2"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropTypes from "prop-types"

const ExcelImporter = ({ onImportComplete, tableMetadata }) => {
  const [excelData, setExcelData] = useState([])
  const [columns, setColumns] = useState([])
  const [fileError, setFileError] = useState("")
  const [showTable, setShowTable] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sheetNames, setSheetNames] = useState([])
  const [selectedSheet, setSelectedSheet] = useState("")
  const [workbookData, setWorkbookData] = useState(null)
  const [columnWidths, setColumnWidths] = useState({})
  const [resizingColumn, setResizingColumn] = useState(null)
  const startX = useRef(0)

  // Paginación
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const handleFileChange = (e) => {
    setFileError("")
    setSheetNames([])
    setSelectedSheet("")
    setExcelData([])
    setShowTable(false)

    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    if (
      fileType !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      setFileError("Por favor, seleccione un archivo Excel válido (.xlsx)")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result)
        const workbook = XLSX.read(data, { type: "array" })
        setSheetNames(workbook.SheetNames)
        setWorkbookData(workbook)
      } catch (error) {
        console.error("Error al leer archivo:", error)
        setFileError("Error al leer archivo. Por favor, inténtalo de nuevo.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSheetChange = (e) => {
    const selectedSheet = e.target.value
    setSelectedSheet(selectedSheet)

    if (!workbookData) return

    try {
      const worksheet = workbookData.Sheets[selectedSheet]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
      })

      if (jsonData && jsonData.length > 0) {
        const headers = jsonData[0].map((header) => header || `Column ${columns.length + 1}`)
        const dataRows = jsonData.slice(1)

        setColumns(headers)
        setExcelData(dataRows)
        setShowTable(true)
      } else {
        setFileError("El archivo Excel está vacío.")
        setExcelData([])
        setShowTable(false)
      }
    } catch (error) {
      console.error("Error al leer la hoja:", error)
      setFileError("Error al leer la hoja. Por favor, inténtalo de nuevo.")
      setExcelData([])
      setShowTable(false)
    }
  }

  const handleCellValueChange = useCallback((rowIndex, colIndex, value) => {
    setExcelData((prevData) => {
      const newData = [...prevData]
      if (!newData[rowIndex]) {
        newData[rowIndex] = [] // Ensure the row exists
      }
      newData[rowIndex][colIndex] = value
      return newData
    })
  }, [])

  const mapExcelData = (excelData, tableMetadata) => {
    const flatMetadata = tableMetadata.flat()
    return excelData.map((row) => {
      const mappedRow = {}
      row.forEach((cell, index) => {
        const columnMetadata = flatMetadata[index]
        if (columnMetadata) {
          mappedRow[columnMetadata.name] = cell
        }
      })
      return mappedRow
    })
  }

  // Paginación: Cambiar página
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setCurrentPage(1) // Resetear a la primera página cuando cambie el número de filas por página
  }

  // Calcular las filas que se mostrarán según la página actual y la cantidad de filas por página
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = excelData.slice(indexOfFirstRow, indexOfLastRow)

  const handleSaveData = useCallback(async () => {
    const validationErrors = validateData(tableMetadata.flat())
    if (validationErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Validación Fallida",
        html: "Se encontraron los siguientes errores:<br>" + validationErrors.join("<br>"),
      })
      return
    }

    setIsSaving(true)
    Swal.fire({
      title: "Guardando Datos...",
      html: "Por favor, espera mientras guardamos los datos.",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading()
      },
    })

    try {
      // Simulación de guardado
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simula una llamada async a la base de datos

      Swal.fire({
        icon: "success",
        title: "Datos Guardados",
        text: "Los datos se han guardado correctamente.",
      })

      if (typeof onImportComplete === "function") {
        const mappedData = mapExcelData(excelData, tableMetadata)
        onImportComplete(mappedData)
      }

      setExcelData([])
      setColumns([])
      setShowTable(false)
      setSheetNames([])
      setSelectedSheet("")
    } catch (error) {
      console.error("Error al guardar:", error)
      Swal.fire({
        icon: "error",
        title: "Error al Guardar",
        text: error.message || "Ocurrió un error al intentar guardar los datos.",
      })
    } finally {
      setIsSaving(false)
    }
  }, [excelData, onImportComplete, tableMetadata])

  const validateData = (tableMetadata) => {
    const errors = []
    excelData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const columnMetadata = tableMetadata?.[colIndex]
        if (columnMetadata?.required && (cell === null || cell === undefined || cell === "")) {
          errors.push(`Fila ${rowIndex + 1}, columna ${colIndex + 1}: el campo no puede estar vacío.`)
        }
        if (
          columnMetadata?.type === "number" &&
          cell !== null &&
          cell !== undefined &&
          cell !== "" &&
          isNaN(Number(cell))
        ) {
          errors.push(`Fila ${rowIndex + 1}, columna ${colIndex + 1}: el campo debe ser un número.`)
        }
        if (
          columnMetadata?.type === "integer" &&
          cell !== null &&
          cell !== undefined &&
          cell !== "" &&
          !Number.isInteger(Number(cell))
        ) {
          errors.push(`Fila ${rowIndex + 1}, columna ${colIndex + 1}: el campo debe ser un entero.`)
        }
      })
    })
    return errors
  }

  return (
    <div className="w-full max-w-full">
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
              Haz clic para seleccionar un archivo Excel o arrastra y suelta aquí
            </p>
            <p className="text-xs text-gray-500">.xlsx, .xls</p>
          </div>
          <input id="excel-file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

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

      {sheetNames.length > 0 && (
        <div className="mb-4">
          <label htmlFor="sheet-select" className="mb-1 block text-sm font-medium text-gray-700">
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

      {showTable && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((header, index) => (
                    <th
                      key={index}
                      style={{ width: columnWidths[index] }}
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div className="flex items-center justify-between">
                        <span>{header}</span>
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
                          cell === null || cell === undefined || cell === "" ? "bg-yellow-50" : ""
                        }`}
                      >
                        <input
                          type="text"
                          value={cell === null ? "" : cell}
                          placeholder={cell === null ? "Rellenar aquí" : ""}
                          onChange={(e) => handleCellValueChange(rowIndex + indexOfFirstRow, colIndex, e.target.value)}
                          className="w-full border-0 bg-transparent p-0 focus:outline-none focus:ring-0"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between space-y-3 sm:flex-row sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Filas por página:</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando {indexOfFirstRow + 1} a {Math.min(indexOfLastRow, excelData.length)} de {excelData.length}{" "}
                filas
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white">
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={indexOfLastRow >= excelData.length}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

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
  )
}

ExcelImporter.propTypes = {
  onImportComplete: PropTypes.func,
  tableMetadata: PropTypes.array.isRequired,
}

export default ExcelImporter
