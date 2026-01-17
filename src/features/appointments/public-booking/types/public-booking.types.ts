// Types for Public Booking API (no auth required)

export interface PublicBranch {
    id: string;
    name: string;
    address?: string;
    phone?: string | null;
    business_name?: string | null;
    business_slug?: string | null;
    business_logo?: string | null;
}

export interface PublicProfessional {
    id: string;
    name: string;
    last_name: string;
    profile_photo: string | null;
    description: string | null;
    services: PublicService[];
}

export interface PublicService {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    price: string;
    duration_minutes: number;
    is_active: boolean;
    is_public: boolean;
}

export interface PublicAvailability {
    date: string;
    slots: string[];
}

export interface CreatePublicBookingPayload {
    professional_id: string;
    service_id: string;
    date: string;
    start_time: string;
    full_name: string;
    email: string;
    phone: string;
    notes?: string;
}

export interface PublicBookingResponse {
    id: string;
    confirmation_code: string;
    date: string;
    start_time: string;
    end_time: string;
    professional_name: string;
    service_name: string;
    branch_name: string;
    status: string;
}
