import React, { useState, useEffect } from "react";
import Card from "./card"; 
import { FaServer, FaPowerOff, FaExclamationTriangle } from 'react-icons/fa';

const CardApi = ({ apiUrl, authorizationToken, iconMapping }) => {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: authorizationToken,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();

        // Verificar si la respuesta tiene la estructura correcta
        if (responseData && responseData.data) {
            const mappedData = Object.entries(responseData.data)
            .filter(([key,value]) => !(key === "unknown" && value === 0))
             .map(([key, value]) => ({
                title: key.charAt(0).toUpperCase() + key.slice(1),
                value: value,
                icon: iconMapping[key] || null
            }));
              setCardData(mappedData);
           }else{
              throw new Error('La estructura de la respuesta de la API no es la esperada');
          }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, authorizationToken, iconMapping]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {cardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </>
  );
};

export default CardApi;