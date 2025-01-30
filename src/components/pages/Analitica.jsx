import { useEffect, useState } from "react";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import CardStatsServers from "../cards/CardStatsServers";
import { FaServer, FaPowerOff, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './analitica.module.css';

const Analitica = () => {
    const apiUrl = "http://localhost:8000/stats/servers";
    const locationApiUrl = "http://localhost:8000/stats/servers/location";
    const brandApiUrl = "http://localhost:8000/stats/servers/brand" 
    const token = localStorage.getItem("authenticationToken");
    const [totalServers, setTotalServers] = useState(null);
    const [error, setError] = useState(null);
    const [locationData, setLocationData] = useState({ labels: [], data: [] });
    const [brandData, setBrandData] = useState({labels: [], data: []}); 

    useEffect(() => {
      // Obtener el total de servidores
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
                } else {
                    throw new Error('La estructura de la respuesta de la API no es la esperada');
                }
            } catch (error) {
                setError(`Error al obtener total de servidores: ${error.message}`)
                console.error("Error al obtener total de servidores: ", error);
            }
        };
         // Obtener la data de location
        const fetchLocationData = async () => {
            if (!token) {
                setError("No autorizado. El token no se encuentra.");
                return;
            }
            try {
                const response = await fetch(locationApiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, detail: ${JSON.stringify(errorData)}`);
                }

                const responseData = await response.json();

                if (responseData && responseData.data) {
                    const labels = responseData.data.map(item => item.name);
                    const data = responseData.data.map(item => item.total);
                    setLocationData({ labels, data });
                } else {
                       throw new Error('La estructura de la respuesta del endpoint location no es la esperada');
                   }

            } catch (error) {
                setError(`Error al obtener datos de ubicacion: ${error.message}`)
                console.error("Error al obtener datos de ubicacion: ", error);
            }
        };
             // Obtener la data de brand
        const fetchBrandData = async () => {
            if (!token) {
                setError("No autorizado. El token no se encuentra.");
                return;
            }
            try {
                const response = await fetch(brandApiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                 if (!response.ok) {
                      const errorData = await response.json();
                      throw new Error(`HTTP error! status: ${response.status}, detail: ${JSON.stringify(errorData)}`);
                }

                const responseData = await response.json();

                if (responseData && responseData.data) {
                    const labels = responseData.data.map(item => item.name);
                    const data = responseData.data.map(item => item.total);
                    setBrandData({ labels, data });
                } else {
                       throw new Error('La estructura de la respuesta del endpoint brand no es la esperada');
                   }


            } catch (error) {
                setError(`Error al obtener datos de marca: ${error.message}`)
                console.error("Error al obtener datos de marca: ", error);
            }
        };


        fetchTotalServers();
        fetchLocationData();
        fetchBrandData()
    }, [apiUrl, token,locationApiUrl, brandApiUrl]);


    if (error) {
        return (
            <div>
                {error}
            </div>
        )
    }

    const iconMapping = {
        'online': <FaCheckCircle size={40} color="green" />,
        'offline': <FaPowerOff size={40} color="red" />,
        'total': <FaServer size={40} color="blue" />,
        'maintenance': <FaExclamationTriangle size={40} color="orange" />
    };

    return (
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
                        data={locationData.data}
                        labels={locationData.labels}
                    />
                </div>
                <div className={styles.donut}>
                     {brandData.labels.length > 0 && totalServers !== null && (
                        <DonutChart
                            title="Servidores por Marca"
                            data={brandData.data}
                            labels={brandData.labels}
                            totalServers={totalServers}
                        />
                   )}
                </div>
            </div>
        </div>
    );
}
export default Analitica;