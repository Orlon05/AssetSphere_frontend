import React, {useEffect, useState} from "react";
import Card from "../cards/card";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import CardStatsServers from "../cards/CardStatsServers";
import { FaServer, FaPowerOff, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './analitica.module.css';

const Analitica =() =>{

  const apiUrl = "http://localhost:8000/stats/servers"; 
  const token = localStorage.getItem("authenticationToken");

  const [totalServers, setTotalServers] = useState(0);

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalServers = async () => {
      if (!token) {
          setError("No autorizado. El token no se encuentra.");
        return;
    }
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, detail: ${errorData.detail}`);
            }
            const responseData = await response.json();
             if (responseData && responseData.data && responseData.data.total) {
                   setTotalServers(responseData.data.total);
                   setError(null);
                }else{
                       throw new Error('La estructura de la respuesta de la API no es la esperada');
                     }
            } catch (error) {
              setError(`Error al obtener total de servidores: ${error.message}`)
                console.error("Error al obtener total de servidores: ", error);
        }
    };

    fetchTotalServers();
}, [apiUrl, token]);

if(error) {
    return (
        <div>
            {error}
        </div>
    )
}

const iconMapping = {
        'online': <FaCheckCircle size={40} color="green"/>,
        'offline': <FaPowerOff size={40} color="red"/>,
        'total': <FaServer size={40} color="blue"/>,
        'maintenance': <FaExclamationTriangle size={40} color="orange"/>
      };
      

const citiesData = {
    labels: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Cúcuta', 'Bucaramanga'],
    data: [20, 15, 18, 12, 10, 8, 7],
};

const brandData = {
    labels: ['Cisco', 'HP', 'Dell', 'Bancolombia'],
    data: [30, 25, 20, 25],
};
    return(
        <div className={styles.analiticaContainer}>
            <div className={styles.cardContainer}>
            <CardStatsServers
                   apiUrl={apiUrl}
                   authorizationToken={`Bearer ${token}`}
                   iconMapping={iconMapping}
                  />
            </div>
            <div className={styles.graficos}>
            <div className={styles.barras}>
            <BarChart
                title="Servidores por Ciudad"
                data={citiesData.data}
                labels={citiesData.labels}
              />
            </div>
            <div className={styles.donut}>
            <DonutChart
                title="Servidores por Marca"
                data={brandData.data}
                labels={brandData.labels}
                totalServers={totalServers}
              />
            </div>
            </div>
        </div>
    );
  }
export default Analitica;