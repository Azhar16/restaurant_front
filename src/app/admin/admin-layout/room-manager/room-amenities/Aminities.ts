export interface IAminityList {
    "aminity":  IAminity[]
}

export interface IAminity {
    "aminityID"?: number,
    "aminityName"?: string,
    "aminityDesc"?: string,
    "editable"?: boolean,
    "checked"?: boolean
}