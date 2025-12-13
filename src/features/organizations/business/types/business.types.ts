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
}
