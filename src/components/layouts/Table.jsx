import React from "react";
import style from "../pages/fisicos.module.css";
import { Form, Pagination } from "react-bootstrap";

const Table = ({
  columns,
  data,
  selectedItems,
  toggleSelectItem,
  selectAll,
  toggleSelectAll,
  rowsPerPage,
  handleRowsPerPageChange,
  currentPage,
  totalRows,
  handlePageChange,
  idKey = "id",
  children,
  styleOverride
}) => {

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = data.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages =  Math.ceil(totalRows / rowsPerPage)

  return (
    <div className={styleOverride || style.container}>
       <table className={`${style.table} ${style.customTable}`}>
          <thead>
            <tr>
              <th className={style.contChek}>
                <input
                  type="checkbox"
                  className={style.customCheckbox}
                  checked={
                    data.length > 0 &&
                    selectedItems.size === data.length
                  }
                  onChange={() => toggleSelectAll(data, idKey)}
                />
              </th>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
             {children}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item[idKey]}
                className={
                    selectedItems.has(item[idKey]) ? style.selectedRow : ""
                  }>
                <td>
                  <input
                    type="checkbox"
                    className={style.customCheckbox}
                    checked={selectedItems.has(item[idKey])}
                    onChange={() => toggleSelectItem(item[idKey])}
                  />
                </td>
                {columns.map((col, i) => (
                  <td key={`${item[idKey]}-${i}`}>
                    {typeof col.cell === 'function'
                    ? col.cell(item)
                    : item[col.key]}
                  </td>
                 ))}
              {children}
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
                    onChange={handleRowsPerPageChange}
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
                  <span>{`${indexOfFirstItem + 1}-${Math.min(
                    indexOfLastItem,
                   data.length
                  )} de ${data.length}`}</span>
                </div>
              </td>
              <td className={style.contFilDos} colSpan={columns.length}>
                <div
                  className={`d-flex justify-content-end align-items-center ${style.tfootSmall}`}
                >
                  <Pagination className={style.pestanas}>
                    <Pagination.Prev
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                    />
                     <Pagination.Item>{currentPage}</Pagination.Item>
                    <Pagination.Next
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                    />
                  </Pagination>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
    </div>
  );
};

export default Table;