import React, { useEffect, useState } from "react";
import { CiImport, CiExport, CiSearch } from "react-icons/ci";
import useExport from "../../hooks/useExport";
import style from "./logs.module.css";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logKeys, setLogKeys] = useState([]);
  const token = localStorage.getItem("authenticationToken");
  const { exportToExcel } = useExport();

  const handleExport = () => {
    exportToExcel(logs, "Registros"); // Pasar 'logs' y el nombre de archivo al hook
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8000/logs/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data && data.data && Array.isArray(data.data.logs)) {
          setLogs(data.data.logs);
          //Obtener las claves de la propiedad log
          if (data.data.logs.length > 0) {
            setLogKeys(Object.keys(data.data.logs[0]));
          }
        } else {
          //si la estructura no es la esperada, lanzamos un error
          throw new Error(
            `Error de estructura en respuesta API ${JSON.stringify(data)}`
          );
        }
      } catch (error) {
        setError(`Error fetching logs: ${error.message}`);
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [token]);

  if (loading) {
    return <p>Cargando registros...</p>;
  }
  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={style.container}>
      <div className={style.containerMain}>
        <h1 className={style.tittle}>Logs</h1>
        <button className={style.btnImport}>
          <CiImport className={style.icon} /> Importar
        </button>
        <button className={style.btnExport} onClick={handleExport}>
          <CiExport className={style.icon} /> Exportar
        </button>
      </div>
      <table className={`${style.table} ${style.customTable}`}>
        <thead>
          <tr>
            <th>Num/Reg</th>
            <th>Detalles</th>
            <th>ID Usuario</th>
            <th>Evento</th>
            <th>Tipo</th>
            <th>IP</th>
            <th className={style.contBtns}>Marca de tiempo</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id}>
              <td>{index + 1}</td>
              {/* Usamos log.detail en lugar de log.detalles */}
              <td>{log.detail != null ? log.detail : "null"}</td>
              <td>{log.user_id != null ? log.user_id : "null"}</td>
              <td>{log.event != null ? log.event : "null"}</td>
              <td>{log.type != null ? log.type : "null"}</td>
              <td>{log.ip_address != null ? log.ip_address : "null"}</td>
              <td>{log.timestamp != null ? log.timestamp : "null"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;