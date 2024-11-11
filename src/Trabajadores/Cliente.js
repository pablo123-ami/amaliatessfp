import React, { useEffect, useState } from 'react';
import '../App.css';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Registro de componentes de ChartJS
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

const Cliente = () => {
    // Estados de clientes y manejo de errores
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);

    // Fetch de datos de clientes cada 2 segundos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    // Conteo de clientes por sexo
    const sexoCount = clientes.reduce((acc, cliente) => {
        acc[cliente.sexo] = (acc[cliente.sexo] || 0) + 1;
        return acc;
    }, {});

    // Datos para gráfica de torta (Distribución por sexo)
    const pieChartData = {
        labels: Object.keys(sexoCount),
        datasets: [
            {
                label: 'Distribución por Sexo',
                data: Object.values(sexoCount),
                backgroundColor: [
                    'rgba(226, 125, 36, 0.6)', // Color para "F"
                    'rgba(123, 156, 255, 0.6)', // Color para "I"
                    'rgba(75, 192, 192, 0.6)' // Color para "M"
                ],
                borderColor: [
                    'rgba(226, 125, 36, 1)', // Color para "F"
                    'rgba(123, 156, 255, 1)', // Color para "I"
                    'rgba(75, 192, 192, 1)' // Color para "M"
                ],
                borderWidth: 1,
            },
        ],
    };

    // Datos para gráfica de barras verticales (Distribución de clientes por rango de teléfono)
    const phoneRanges = clientes.reduce((acc, cliente) => {
        const phoneRange = cliente.telefono.substring(0, 3); // Primeros 3 dígitos del teléfono
        acc[phoneRange] = (acc[phoneRange] || 0) + 1;
        return acc;
    }, {});

    const phoneBarChartData = {
        labels: Object.keys(phoneRanges),
        datasets: [
            {
                label: 'Clientes por Rango de Teléfono',
                data: Object.values(phoneRanges),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Opciones de configuración para todas las gráficas
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    boxWidth: 0,
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    padding: 10,
                }
            },
            x: {
                ticks: {
                    padding: 40,
                }
            }
        },
    };

    return (
        <div className="container">
            {/* Tarjetas de clientes */}
            <div className="card-container">
                {error ? (
                    <div className="error">Error: {error.message}</div>
                ) : (
                    clientes.map(cliente => (
                        <div key={cliente.id} className="card">
                            <div className="card-content">
                                <h2>ID: {cliente.id}</h2>
                                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                                <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                                <p><strong>Sexo:</strong> {cliente.sexo}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Contenedor para organizar las gráficas en fila */}
            <div className="charts-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                {/* Gráfica de torta para distribución por sexo */}
                <div className="pie-chart-container" style={{ maxWidth: '600px', height: '400px', margin: '20px' }}>
                    <h2>Distribución por Sexo</h2>
                    <Pie data={pieChartData} options={chartOptions} />
                </div>

                {/* Gráfica de barras verticales para distribución de clientes por teléfono */}
                <div className="phone-bar-chart-container" style={{ maxWidth: '600px', height: '400px', margin: '20px' }}>
                    <h2>Distribución por Rango de Teléfono</h2>
                    <Bar data={phoneBarChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default Cliente;
