import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

const useExport = () => {
  const exportToExcel = (data, fileName, dataMapper) => {
    try {
      const mappedData = dataMapper ? data.map(dataMapper) : data;
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(mappedData);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blobData = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blobData, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Error al exportar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al exportar',
        text: error.message,
      });
    }
  };
  return { exportToExcel };
};

export default useExport;