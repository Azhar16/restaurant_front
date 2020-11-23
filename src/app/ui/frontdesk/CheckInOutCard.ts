export interface ICheckInCardData {
    hotelDetails: IHotelData,
    resData: IResponseData,
    totalbill: ITotalBillData
}

export interface ICheckOutCardData {
    hotelDetails: IHotelData,
    resData: IResponseData,
    billDetails: IBillDetails,
    dayWiseTransaction: IDayWiseTransaction[]
}

export interface IHotelData {
    hotelName: string,
    address: string,
    city: string,
    zipCode: string,
    phone: string,
    email: string,
    website: string
}

export interface IResponseData {
    "bookingID": number,
    "channelRefNum": string,
    "bookingDate": string,
    "arrivalDate": string,
    "departureDate": string,
    "los": number,
    "adult": number,
    "child": number,
    "roomtype": string,
    "ratePlan": string,
    "totalAmountAfterTax": number,
    "assignedRoomNumber": string,
    "guestDetail": IGuestDetails
}

export interface IGuestDetails {
    guestDetail: IGuestData[]
}

export interface IGuestData {
    "guestID": number,
    "namePrefix": string,
    "givenName": string,
    "middleName": string,
    "surName": string,
    "address1": string,
    "address2": string,
    "city": string,
    "state": string,
    "country": string,
    "zipCode": string,
    "phone": string,
    "email": string,
    "isPrimary": number,
    "guestRPH": string
}

export interface IBillDetails {
    "transactions": ITransactionData[],
    "totalBill": ITotalBillData
}

export interface ITransactionData {
    "tranxId": number,
    "bookingId": string,
    "tranxDesc": string,
    "tranxDate": string,
    "folioId": string,
    "roomId": string,
    "currency": string,
    "tranxAmount": number,
    "discount": number,
    "tax": number,
    "payment": number
}

export interface ITotalBillData {
    "billId": number,
    "bookingTotal": number,
    "roomCharge": number,
    "mealCharge": number,
    "otherCharges": number,
    "taxPercentage": number,
    "amountAfterTax": number,
    "taxAmount": number,
    "totalPaidAmount": number,
    "balanceAmount": number,
    "active": boolean
}

export interface IDayWiseTransaction {
    "date": string,
    "description": string,
    "tranxAmount": string
}


