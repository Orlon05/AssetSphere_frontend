import React, { useEffect, useState } from 'react';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logKeys, setLogKeys] = useState([]);

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8000/logs/', {
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
          throw new Error(`Error de estructura en respuesta API ${JSON.stringify(data)}`);
        }
      } catch (error) {
        setError(`Error fetching logs: ${error.message}`);
        console.error('Error fetching logs:', error);
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
      <div>
      <h1>Logs</h1>
      <table>
          <thead>
              <tr>
              {logKeys.map((key) => (
                  <th key={key}>{key}</th>
              ))}
              </tr>
          </thead>
          <tbody>
              {logs.map((log) => (
              <tr key={log.id}>
                  {logKeys.map((key) => (
                      <td key={`${log.id}-${key}`}>{log[key] != null ? log[key].toString() : "null"}</td>
                  ))}
              </tr>
              ))}
          </tbody>
      </table>
      </div>
  );
};

export default Logs;