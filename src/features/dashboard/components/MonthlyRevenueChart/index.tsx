"use client";

import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MonthlyRevenue } from '../../types/dashboard.types';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

interface MonthlyRevenueChartProps {
    data: MonthlyRevenue[];
}

const MonthlyRevenueChart = ({ data }: MonthlyRevenueChartProps) => {
    const currentMonth = dayjs().format('YYYY-MM');

    const chartData = useMemo(() => {
        const labels = data.map(item => dayjs(item.month).format('MMM YY'));
        const revenues = data.map(item => parseFloat(item.totalRevenue));
        const counts = data.map(item => item.count);

        const backgroundColors = data.map(item =>
            item.month === currentMonth ? '#1890ff' : '#ffffff'
        );
        const borderColors = data.map(() => '#1890ff');

        return {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: revenues,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    borderRadius: 6,
                    counts,
                },
            ],
        };
    }, [data, currentMonth]);

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#666',
                borderColor: '#ddd',
                borderWidth: 1,
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: (context) => context[0].label,
                    label: (context) => {
                        const dataset = context.dataset as typeof chartData.datasets[0];
                        const count = dataset.counts[context.dataIndex];
                        return [
                            `Ingresos: S/.${context.parsed.y?.toLocaleString()}`,
                            `Citas completadas: ${count}`,
                        ];
                    },
                },
            },
            datalabels: {
                anchor: 'center',
                align: 'center',
                color: (context) => {
                    const dataset = context.dataset as typeof chartData.datasets[0];
                    return dataset.backgroundColor[context.dataIndex] === '#ffffff'
                        ? '#1890ff'
                        : '#ffffff';
                },
                font: {
                    size: 11,
                    weight: 'bold',
                },
                formatter: (_value, context) => {
                    const dataset = context.dataset as typeof chartData.datasets[0];
                    return dataset.counts[context.dataIndex];
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f0f0',
                },
                ticks: {
                    callback: (value) => `S/.${(value as number).toLocaleString()}`,
                    color: '#666',
                },
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#666',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default MonthlyRevenueChart;
