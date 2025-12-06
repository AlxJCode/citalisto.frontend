import { Professional, ProfessionalApi } from "@/features/professionals/professional/types/professional.types";
import { BaseModel, BaseModelCamel } from "@/types/base";

export type AvailabilityExceptionStatus = "available" | "unavailable";

export interface ProfessionalAvailabilityExceptionApi extends BaseModel {
    professional: number;
    professional_model?: ProfessionalApi | null;
    date: string;
    status: AvailabilityExceptionStatus;
    start_time: string | null;
    end_time: string | null;
    break_start_time: string | null;
    break_end_time: string | null;
    notes: string | null;
}


export interface ProfessionalAvailabilityException extends BaseModelCamel {
    professional: number;
    professionalModel?: Professional | null;
    date: string;
    status: AvailabilityExceptionStatus;
    startTime: string | null;
    endTime: string | null;
    breakStartTime: string | null;
    breakEndTime: string | null;
    notes: string | null;
}
