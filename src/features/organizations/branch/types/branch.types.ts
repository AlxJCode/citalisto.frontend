import { BaseModel, BaseModelCamel } from "@/types/base";
import { Business, BusinessApi } from "../../business/types/business.types";

export interface BranchApi extends BaseModel {
    business: number;
    business_model?: BusinessApi | null;
    name: string;
    address: string | null;
    phone: string | null;
}

export interface Branch extends BaseModelCamel {
    business: number;
    businessModel?: Business | null;
    name: string;
    address: string | null;
    phone: string | null;
}
