import { User, UserApi } from "@/features/users/user/types/user.api";
import { BaseModel, BaseModelCamel } from "@/types/base";
import { Category, CategoryApi } from "../../category/types/category.types";

export interface BusinessApi extends BaseModel {
    name: string;
    category: number;
    category_model?: CategoryApi | null;
    logo: string | null;
    phone: string | null;
    timezone: string;
    slug?: string | null;
    owner: number;
    whatsapp_monthly_limit: number;
    owner_model?: UserApi | null;
    enable_email_on_booking: boolean;
    enable_email_reminder_24h: boolean;
    enable_email_reminder_2h: boolean;
    enable_whatsapp_on_booking: boolean;
    enable_whatsapp_reminder_24h: boolean;
    enable_whatsapp_reminder_2h: boolean;
}

export interface Business extends BaseModelCamel {
    name: string;
    category: number;
    categoryModel?: Category | null;
    logo: string | null;
    phone: string | null;
    slug?: string | null;
    timezone: string;
    owner: number;
    whatsappMonthlyLimit: number;
    ownerModel?: User | null;
    enableEmailOnBooking: boolean;
    enableEmailReminder24h: boolean;
    enableEmailReminder2h: boolean;
    enableWhatsappOnBooking: boolean;
    enableWhatsappReminder24h: boolean;
    enableWhatsappReminder2h: boolean;
}
