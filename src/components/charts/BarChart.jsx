import React from 'react';
import Chart from 'react-apexcharts';
import styles from './barChart.module.css';

const BarChart = ({ data, labels, title }) => {
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      title: {
        text: 'Cantidad de Servidores',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' Servidores';
        },
      },
    },
  };

  const chartSeries = [
      {
          name: "Servidores",
          data: data
      }
  ]

  return (
    <div className={styles.barChartContainer}>
      <h2 className={styles.titulo}>{title}</h2>
      <Chart options={chartOptions} series={chartSeries} type="bar"/>
    </div>
  );
};

export default BarChart;