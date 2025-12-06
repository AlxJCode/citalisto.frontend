import { Professional, ProfessionalApi } from "@/features/professionals/professional/types/professional.types";
import { BaseModel, BaseModelCamel } from "@/types/base";


export interface ProfessionalWeeklyAvailabilityApi extends BaseModel {
    professional: number;
    professional_model?: ProfessionalApi | null;
    day_of_week: number;
    start_time: string;
    end_time: string;
    enabled: boolean;
    break_start_time: string | null;
    break_end_time: string | null;
}

export interface ProfessionalWeeklyAvailability extends BaseModelCamel {
    professional: number;
    professionalModel?: Professional | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    enabled: boolean;
    breakStartTime: string | null;
    breakEndTime: string | null;
}
