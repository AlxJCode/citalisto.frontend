'use client';

import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BookingsOriginChartProps {
    widget: number;
    manual: number;
    widgetPercentage: number;
}

export const BookingsOriginChart = ({
    widget,
    manual,
    widgetPercentage,
}: BookingsOriginChartProps) => {
    const data = {
        labels: ['Público', 'Manual'],
        datasets: [
            {
                data: [widget, manual],
                backgroundColor: ['#1890ff', '#52c41a'],
                borderColor: ['#1890ff', '#52c41a'],
                borderWidth: 1,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 8,
                    font: {
                        size: 11,
                    },
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        const backgrounds = datasets[0].backgroundColor;
                        return chart.data.labels?.map((label, i) => {
                            const value = datasets[0].data[i];
                            const percentage = i === 0 ? widgetPercentage : 100 - widgetPercentage;
                            const bgColor = Array.isArray(backgrounds) ? backgrounds[i] : backgrounds;
                            return {
                                text: `${label}: ${value} (${percentage.toFixed(1)}%)`,
                                fillStyle: bgColor as string,
                                hidden: false,
                                index: i,
                            };
                        }) || [];
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage =
                            context.dataIndex === 0
                                ? widgetPercentage
                                : 100 - widgetPercentage;
                        return `${label}: ${value} (${percentage.toFixed(1)}%)`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ height: '100%', maxHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', overflow: 'hidden' }}>
            <div style={{ width: '100%', maxWidth: '200px', height: '100%', maxHeight: '200px' }}>
                <Doughnut data={data} options={options} />
            </div>
        </div>
    );
};
