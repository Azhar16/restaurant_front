export interface IGeneral {
	"name": string,
    "phoneNO": string,
    "city": string,
    "state": string,
    "mobleno": string,
    "address": string,
    "zipCode": string,
    "country": string,
    "website":string,
    "email":string,
    "gstNo":string
}

export interface IBasic {
	"finYearFrom": string,
    "finYearTo": string,
    "counterTimingFrom": string,
    "counterTimingTo": string,
    "currency": string,
    "noOfRestaurant": string,
    "noOfBanquet": string,
    "defaultLanguage": string,
    "dateFormat":string,
    "timeZone":string,
    "decimalPlace":string
}

export interface IAdvance {
	"restName": string,
    "managerName": string,
    "noOfTable": string,
    "noOfStaff": string,
    "phoneNo": string,
    "restBanType": string
}