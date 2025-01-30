import React from "react";
import Card from "../cards/card";
import BarChart from "../charts/BarChart";
import DonutChart from "../charts/DonutChart";
import { FaServer, FaPowerOff, FaCheckCircle } from 'react-icons/fa';
import styles from './analitica.module.css';

const Analitica =() =>{

    const serverData = [
        {
          title: 'Servidores Encendidos',
          value: 15,
          icon: <FaCheckCircle size={40} color="green"/>
        },
        {
          title: 'Servidores Apagados',
          value: 5,
          icon: <FaPowerOff size={40} color="red"/>
        },
        {
          title: 'Total Servidores',
          value: 100,
          icon: <FaServer size={40} color="blue"/>
        },
      ];

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
              {serverData.map((card, index) => (
                <Card
                  key={index}
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  />
                  ))}
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
              />
            </div>
            </div>
        </div>
    );
  }
export default Analitica;