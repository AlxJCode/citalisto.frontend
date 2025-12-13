export interface PublicBooking {
    date: string;
    start_time: string;
    end_time: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    business_name: string;
    professional_name: string;
    service_name: string;
    branch_name: string;
    branch_address: string;
    cancelled_at: string | null;
    cancellation_reason: string | null;
}
