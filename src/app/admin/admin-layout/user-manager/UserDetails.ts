export interface IUserList {
	"empID": number,
	"empName": string,
	"department": string
}

export interface IEmployee {
	"empId"?: number,
	"empName": string,
	"lastName": string,
	"address1": string,
	"address2": string,
	"city": string,
	"state": string,
	"country": string,
	"email": string,
	"phone": string,
	"department": string,
	"designation": string,
	"zipCode": string,
	"mobile": string,
	"emergencyNumber": string,
	"gender": string,
	"dOB": string,
	"iDType": string,
	"iD": string,
	"bloodGroup": string,
	"dOJ": string
}

export interface IUser {
	"UserId"?: number
	"userName": string,
	"loginId": string,
	"password": string,
	"userType": string,
	"isChainUser": string,
	"hotelId": string,
	"posUnlockPin": string,
	"permittedIps": [any],
	"shiftFrom": string,
	"shiftTo": string,
	"counter": string,
	"empId"?: string
}

export interface IUsersDetails {
	"Employee": IEmployee,
	"User": IUser
}