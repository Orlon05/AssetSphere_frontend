import React from 'react';
import Chart from 'react-apexcharts';
import styles from './donutChart.module.css';

const DonutChart = ({ data, labels, title }) => {
    const chartOptions = {
        chart: {
            type: 'donut',
            toolbar: {
                show: false // Ocultar la barra de herramientas
              }
        },
        labels: labels,
        responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }],
        legend: {
            position: 'bottom', // Mover la leyenda abajo
            horizontalAlign: 'center'
          },
        tooltip: {
            y: {
              formatter: function(val) {
                return val + " Servidores"
              }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size:'70%',
                    labels: {
                        show: true,
                        name: {
                          show: true,
                          offsetY: 20, // Ajustar el espacio para el nombre
                          formatter: function (val) {
                            return val // Mantener el valor de labels
                          }
                        },
                        value: {
                          show: true,
                            offsetY: -20, // Ajustar el espacio para el valor
                          formatter: function (val) {
                              return val + " Servidores"
                            }
                        },
                         total: {
                             show: true,
                             showAlways: true,
                             label: 'Total',
                             formatter: (w) => {
                                 const sum = w.globals.seriesTotals.reduce((a, b) => {
                                     return a + b
                                 }, 0)
                                 return `${sum} Servidores`
                             }
                         }
                    }
                }
            }
        },
        dataLabels: {
          enabled: true, 
        },
    };

    const chartSeries = data;

    return (
      <div className={styles.donutChartContainer}>
        <h2 className={styles.titulo}>{title}</h2>
        <div className={styles.chartWrapper}>
          <Chart options={chartOptions} series={chartSeries} type="donut" />
        </div>
      </div>
    );
};

export default DonutChart;