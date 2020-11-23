export interface ICheckInOutPolicy {
    policyID?: string,
    checkinPolicyID?: number,
    checkinPolicyName: string,
    checkinPolicyDesc: string,
    day: number,
    hours: number,
    duration: number,
    roomNight: number,
    percentOfBooking: boolean,
    amount: number,
    editable?: boolean
}