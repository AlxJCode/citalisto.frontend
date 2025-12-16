import { apiClient } from '@/lib/api/client';
import { apiRequest, NormalizedResult } from '@/lib/api/apiRequest';
import {
    DashboardDataApi,
    DashboardData,
    mapDashboardData,
} from '../types/dashboard.types';

export const getDashboardApi = async (): Promise<NormalizedResult<DashboardData>> => {
    const res = await apiRequest<DashboardDataApi>(() =>
        apiClient.get('/api/v1/dashboard/overview/')
    );

    if (!res.success) {
        return res;
    }

    return {
        success: true,
        data: mapDashboardData(res.data!),
        message: res.message,
        status: res.status,
        meta: res.meta,
    };
};
