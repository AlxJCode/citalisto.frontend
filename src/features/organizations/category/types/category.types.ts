import { BaseModel, BaseModelCamel } from "@/types/base";

export interface CategoryApi extends BaseModel {
    name: string;
    description: string | null;
    logo: string | null;
}

export interface Category extends BaseModelCamel {
    name: string;
    description: string | null;
    logo: string | null;
}
