import { Customer, CustomerApi } from "@/features/customers/customer/types/customer.types";
import { Branch, BranchApi } from "@/features/organizations/branch/types/branch.types";
import { Business, BusinessApi } from "@/features/organizations/business/types/business.types";
import {
    Professional,
    ProfessionalApi,
} from "@/features/professionals/professional/types/professional.types";
import { Service, ServiceApi } from "@/features/services-catalog/service/types/service.types";
import { BaseModel, BaseModelCamel } from "@/types/base";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type BookingSource = "business" |"customer" | "widget";

export interface BookingApi extends BaseModel {
    business: number;
    business_model?: BusinessApi | null;
    branch: number;
    branch_model?: BranchApi | null;
    professional: number;
    professional_model?: ProfessionalApi | null;
    service: number;
    service_model?: ServiceApi | null;
    customer: number;
    customer_model?: CustomerApi | null;
    notify_by_whatsapp: boolean;
    notify_by_email: boolean;
    auto_confirmed: boolean;
    source: BookingSource;
    date: string;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    notes: string | null;
}

export interface Booking extends BaseModelCamel {
    business: number;
    businessModel?: Business | null;
    branch: number;
    branchModel?: Branch | null;
    professional: number;
    professionalModel?: Professional | null;
    service: number;
    serviceModel?: Service | null;
    customer: number;
    customerModel?: Customer | null;
    source: BookingSource;
    notifyByWhatsapp: boolean;
    notifyByEmail: boolean;
    autoConfirmed: boolean;
    date: string;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    notes: string | null;
}
