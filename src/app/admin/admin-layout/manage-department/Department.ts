export interface IDepartmentList {
    "departments":  IDepartment[]
}

export interface IDepartment {
    "departmentId"?: number,
    "departmentName": string,
    "departDesc": string,
    "editable"?: boolean
}