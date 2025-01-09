import React from 'react';
import Chart from 'react-apexcharts';
import styles from './donutChart.module.css';

const DonutChart = ({ data, labels, title, totalServers }) => {
    const chartOptions = {
        chart: {
            type: 'donut',
            toolbar: {
                show: false
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
            position: 'bottom',
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
                            offsetY: 20,
                            formatter: function (val) {
                                return val
                            }
                        },
                        value: {
                            show: true,
                            offsetY: -20,
                            formatter: function (val) {
                                return val + " Servidores"
                            }
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            formatter: () => {
                                return `${totalServers} Servidores`;
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