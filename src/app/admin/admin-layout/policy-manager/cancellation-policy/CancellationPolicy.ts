export interface ICancellationPolicy {
    cancelPolicyId?: string,
    policyCode: string,
    policyDesc: string,
    offsetTimeUnit: any,
    offsetUnitMultiplier: string,
    offsetDropTime: string,
    penaltyType: string,
    penalityAmount: number,
    editable?: boolean,
    applied?: boolean //for mapping with rate
}
