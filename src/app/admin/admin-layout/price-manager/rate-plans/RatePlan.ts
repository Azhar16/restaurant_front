export interface IRatePlan {
    "ratePlanID"?: number,
    "ratePlanCode": string,
    "ratePlanName": string,
    "rateplanType": string,
    "ratePlanDesc": string,
    "los"?: number,
    "cancelPolicyID"?: string,
    "editable"?: boolean,
    "isBaseRate"?: number,
    "hotelId"?: number,
    "weight"?: number,
    "weightIsPercent"?: boolean,
    "rtRPMapID"?: number, // for mapping screen
    "checked"?: boolean // for mapping screen
}