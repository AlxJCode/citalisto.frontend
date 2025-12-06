import { Business, BusinessApi } from "@/features/organizations/business/types/business.types";
import { BaseModel, BaseModelCamel } from "@/types/base";

export interface CustomerApi extends BaseModel {
    business: number;
    business_model?: BusinessApi | null;
    name: string;
    last_name?: string | null;
    email?: string | null;
    phone?: string;
}

export interface Customer extends BaseModelCamel {
    business: number;
    businessModel?: Business | null;
    name: string;
    lastName?: string | null;
    email?: string | null;
    phone?: string;
}
