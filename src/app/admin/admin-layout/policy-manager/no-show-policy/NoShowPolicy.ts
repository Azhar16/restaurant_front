export interface INoShowPolicy { 
    noshowPolicyID?: number,
    policyID?: number,
    applied?: boolean, 
    nsPolicyName: string,
    hours: number,
    hoursDesc: string,
    charge: number,
    roomNights: number,
    percent: boolean,
    editable?: boolean
}