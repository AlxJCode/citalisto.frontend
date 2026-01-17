import { Branch, BranchApi } from "@/features/organizations/branch/types/branch.types";
import { Service, ServiceApi } from "@/features/services-catalog/service/types/service.types";
import { BaseModel, BaseModelCamel } from "@/types/base";

export interface ProfessionalApi extends BaseModel {
    branch?: number;
    branch_model?: BranchApi | null;
    business?: number;
    name: string;
    last_name?: string | null;
    email: string | null;
    phone: string;
    profile_photo?: string | null;
    description: string | null;
    services: number[];
    services_model?: ServiceApi[] | null;
}

export interface Professional extends BaseModelCamel {
    branch?: number;
    branchModel?: Branch | null;
    business?: number;
    name: string;
    lastName?: string | null;
    email: string | null;
    phone: string;
    profilePhoto?: string | null;
    description: string | null;
    services: number[];
    servicesModel?: Service[] | null;
}
