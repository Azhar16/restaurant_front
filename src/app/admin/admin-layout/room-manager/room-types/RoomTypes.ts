export interface IRoomType {
    basePax: number,
    basePrice: number,
    extraBedPrice: number,
    extraBedsAllowed: number,
    extraPersonPrice: number,
    isBaseRoom: boolean,
    maxPax: number,
    numberOfRooms: number,
    roomCode: string,
    roomDesc: string,
    roomID?: number,
    roomName: string,
    roomType: string,
    checked?: boolean // for manage room & availability
}