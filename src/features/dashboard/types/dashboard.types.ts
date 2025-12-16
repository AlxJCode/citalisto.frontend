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
    };
    next_bookings: NextBookingApi[];
    bookings_origin: {
        widget: number;
        manual: number;
        widget_percentage: number;
    };
    attendance: {
        rate: number;
        completed: number;
        cancelled: number;
    };
    top_services: TopServiceApi[];
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
    };
    nextBookings: NextBooking[];
    bookingsOrigin: {
        widget: number;
        manual: number;
        widgetPercentage: number;
    };
    attendance: {
        rate: number;
        completed: number;
        cancelled: number;
    };
    topServices: TopService[];
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
    bookingsOrigin: {
        widget: api.bookings_origin.widget,
        manual: api.bookings_origin.manual,
        widgetPercentage: api.bookings_origin.widget_percentage,
    },
    attendance: {
        rate: api.attendance.rate,
        completed: api.attendance.completed,
        cancelled: api.attendance.cancelled,
    },
    topServices: api.top_services.map((service) => ({
        name: service.name,
        count: service.count,
        revenue: service.revenue,
    })),
});
