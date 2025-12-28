export interface DashboardDataApi {
    business: {
        name: string;
        plan_name: string;
    };
    agenda: {
        today: number;
        upcoming: number;
    };
    revenue: {
        monthly: string;
        total: string;
    };
    whatsapp: {
        used: number;
        limit: number;
        remaining: number;
        percentage: number;
        period_start: string;
        period_end: string;
    };
    next_bookings: NextBookingApi[];
    top_services: TopServiceApi[];
    monthly_revenue: MonthlyRevenueApi[];
}

export interface NextBookingApi {
    id: number;
    date: string;
    start_time: string;
    service_name: string;
    customer_name: string;
    professional_name: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface TopServiceApi {
    name: string;
    count: number;
    revenue: string;
}

export interface MonthlyRevenueApi {
    month: string;
    count: number;
    total_revenue: string;
}

export interface DashboardData {
    business: {
        name: string;
        planName: string;
    };
    agenda: {
        today: number;
        upcoming: number;
    };
    revenue: {
        monthly: string;
        total: string;
    };
    whatsapp: {
        used: number;
        limit: number;
        remaining: number;
        percentage: number;
        periodStart: string;
        periodEnd: string;
    };
    nextBookings: NextBooking[];
    topServices: TopService[];
    monthlyRevenue: MonthlyRevenue[];
}

export interface NextBooking {
    id: number;
    date: string;
    startTime: string;
    serviceName: string;
    customerName: string;
    professionalName: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface TopService {
    name: string;
    count: number;
    revenue: string;
}

export interface MonthlyRevenue {
    month: string;
    count: number;
    totalRevenue: string;
}

export const mapDashboardData = (api: DashboardDataApi): DashboardData => ({
    business: {
        name: api.business.name,
        planName: api.business.plan_name,
    },
    agenda: {
        today: api.agenda.today,
        upcoming: api.agenda.upcoming,
    },
    revenue: {
        monthly: api.revenue.monthly,
        total: api.revenue.total,
    },
    whatsapp: {
        used: api.whatsapp.used,
        limit: api.whatsapp.limit,
        remaining: api.whatsapp.remaining,
        percentage: api.whatsapp.percentage,
        periodStart: api.whatsapp.period_start,
        periodEnd: api.whatsapp.period_end,
    },
    nextBookings: api.next_bookings.map((booking) => ({
        id: booking.id,
        date: booking.date,
        startTime: booking.start_time,
        serviceName: booking.service_name,
        customerName: booking.customer_name,
        professionalName: booking.professional_name,
        status: booking.status,
    })),
    topServices: api.top_services.map((service) => ({
        name: service.name,
        count: service.count,
        revenue: service.revenue,
    })),
    monthlyRevenue: api.monthly_revenue.map((item) => ({
        month: item.month,
        count: item.count,
        totalRevenue: item.total_revenue,
    })),
});
