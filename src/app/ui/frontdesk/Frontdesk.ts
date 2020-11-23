
export interface IRoom {
    "roomID"?: 1,
    "roomCode"?: string,
    "roomName"?: string,
    "roomDesc"?: string,
    "roomType"?: string,
    "basePax"?: number,
    "maxPax"?: number,
    "extraBedsAllowed"?: number,
    "isBaseRoom"?: boolean,
    "roomDetails"?: IRoomDetails[]
}

export interface IRatePlan {
    "ratePlanID": number,
    "ratePlanCode": string,
    "ratePlanName": string,
    "rateplanType": string,
    "ratePlanDesc": string,
    "los": number,
    "cancelPolicyID": number,
    "isBaseRate": number,
    "hotelId": number,
    "weight": number
}

export interface IRoomDetails {
    "ruid": number,
    "roomNumber": string,
    "roomStatus": string,
    "hotelId": number,
    "availableToAssign": number
}

export interface IReservationData {
    "pos": {
        "source": {
            "requestorID": IRequestorId,
            "bookingChannel": IBookingChannel
        }
    },
    "hotelReservations": {
        "hotelReservation": IHotelReservation[];
    }
    "resStatus": string,
    "timeStamp": string,
    "version": string
}

export interface IRequestorId {
    "id": string;
    "type": string;
}

export interface IBookingChannel {
    "primary": string;
    "type": string;
    "companyName": ICompanyName;
}

export interface ICompanyName {
    "value": string;
    "code": string;
}

export interface IHotelReservation {
    "uniqueID": {
        "id": string;
        "type": string;
        "groupID"?: {
            "id": string,
            "type": string,
            "code": string
        }
    },
    "roomStays": any;
    "resGuests": any;
    "resGlobalInfo": any;
    "createDateTime": string,
    "creatorID": string,
    "lastModifierID": string,
    "lastModifyDateTime": string,
    "reservationStatus": string
}
