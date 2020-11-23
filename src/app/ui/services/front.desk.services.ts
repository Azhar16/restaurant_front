import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class FrontDeskService {

    userHotelID: String;

    constructor(
        private _userResolver: UserResolver,
        private _http: HttpClient
    ) {
        this.userHotelID = this._userResolver.getHotelID();
    }

    errorHandler(errorRes: Response) {
        console.log("error: ", errorRes, errorRes.status);
        return throwError(errorRes);
    }

    getRoomDetails() {
        let servUrl = environment.apiUrl;
        let roomUrl = servUrl + 'Rooms/getRooms/' + this.userHotelID;
        return this._http.post(roomUrl, {}).pipe(
            map(res => { return res['rooms']; }),
            catchError(this.errorHandler)
        );
    }

    getRateDetails() {
        let servUrl = environment.apiUrl;
        let rateUrl = servUrl + 'Rateplans/getRateplans/' + this.userHotelID;
        return this._http.post(rateUrl, {}).pipe(
            map(res => { return res['ratePlans']; }),
            catchError(this.errorHandler)
        );
    }

    getRoomRateDetails() {
        let roomResponse = this.getRoomDetails();
        let rateResponse = this.getRateDetails();
        return forkJoin(
            roomResponse,
            rateResponse
        );
    }

    getMappedRoomRateList(roomId: number) {
        let servUrl = environment.apiUrl;
        let rateListUrl = servUrl + 'RatePlans/QuickRes/getRoomRateMappings/' + roomId + '/' + this.userHotelID;
        return this._http.post(rateListUrl, {}).pipe(map(res => res), catchError(this.errorHandler));
    }

    getReservationDetails(options) {
        let servUrl = environment.apiUrl;
        let gridInfoUrl = servUrl + 'gridInfo/' + this.userHotelID + '/' + options.startDate + '/' + options.endDate;

        return this._http.post(gridInfoUrl, {}).pipe(map(res => res), catchError(this.errorHandler));
    }

    createReservation(options) {
        let servUrl = environment.apiUrl;
        let createReservationUrl = servUrl + 'Bookings/createBookings/' + this.userHotelID;

        return this._http.post(createReservationUrl, options).pipe(map(res => res), catchError(this.errorHandler));
        //console.log("increate rev  function: ", JSON.stringify(options), createReservationUrl);
    }

    getReservationStatus(options: any) {
        //console.log("in get Reservation status: ", options);
        let servUrl = environment.apiUrl;
        let getReservationStatusUrl = servUrl + 'RoomOperations/getStatusbasedRes';
        let requestData = {
            "hotelCode": + this.userHotelID,
            "startDate": options.start_date,
            "endDate": options.end_date,
            "type": options.reqtype
        }
        return this._http.post(getReservationStatusUrl, requestData).pipe(map(res => res), catchError(this.errorHandler));
    }

    getGroupSourceList () {
        let servUrl = environment.apiUrl;
        let getGroupSourceListUrl = servUrl + 'GroupSource/getGrupSource/' + this.userHotelID;
        return this._http.post(getGroupSourceListUrl, {}).pipe(map(res => res), catchError(this.errorHandler));
    }

    assignOrCheckinReservation(options: any): Observable<any> {
        let servUrl = environment.apiUrl;
        let assignReservationRoomUrl = servUrl + 'Bookings/BookingOperations/assignNGuestcheckin';
        let requestData = {
            "bookingID": options.bookingID,
            "roomNumber": options.roomNumber,
            "action": options.action
        }
        return this._http.post(assignReservationRoomUrl, requestData).pipe(map(res => res), catchError(this.errorHandler));
    }

    checkOutReservation(options: any): Observable<any> {
        let servUrl = environment.apiUrl;
        let reservationCheckOutUrl = servUrl + 'Bookings/BookingOperations/guestcheckout';

        return this._http.post(reservationCheckOutUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    }
}