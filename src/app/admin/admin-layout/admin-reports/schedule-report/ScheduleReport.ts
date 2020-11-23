export interface IScheduleReport {
    srID?: number,
    reportType: string,
    startDate: string,
    endDate: string,
    days: number,
    recurrence: string,
    recepiantEmail: string,
    status: boolean,
    editable?: boolean
}