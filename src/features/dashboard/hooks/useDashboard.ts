import { useState, useCallback } from 'react';
import { message } from 'antd';
import { getDashboardApi } from '../services/dashboard.api';
import { DashboardData } from '../types/dashboard.types';

export const useDashboard = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        const result = await getDashboardApi();

        if (!result.success) {
            message.error(`E-${result.status} - ${result.message}`);
            setLoading(false);
            return;
        }

        setData(result.data!);
        setLoading(false);
    }, []);

    return { data, loading, fetchDashboard };
};
