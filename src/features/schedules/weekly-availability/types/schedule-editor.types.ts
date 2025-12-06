import { Dayjs } from "dayjs";

export interface DaySchedule {
    id?: number;
    enabled: boolean;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    hasBreak: boolean;
    breakStartTime: Dayjs | null;
    breakEndTime: Dayjs | null;
}

export interface DayOfWeek {
    id: number;
    name: string;
}
