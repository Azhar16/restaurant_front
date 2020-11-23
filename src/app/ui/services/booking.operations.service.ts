import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';
import { ICheckInCardData, ICheckOutCardData } from '../frontdesk/CheckInOutCard';

@Injectable({
    providedIn: 'root'
})
export class BookingOperationsService {
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

    getBookingDetails(bookingId: any) {
        let servUrl = environment.apiUrl;
        let fetchBookingDetailsUrl = servUrl + 'Bookings/getBookingDetails/' + this.userHotelID + '/' + bookingId;
        return this._http.post(fetchBookingDetailsUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    getCheckInCardDetails(bookingId: string) {
        let servUrl = environment.apiUrl;
        let fetchCheckInDetailsUrl = servUrl + 'Bookings/BookingOperations/getCheckinCard/' + bookingId + '/' + this.userHotelID;

        return this._http.post(fetchCheckInDetailsUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }

    getCheckOutCardDetails(bookingId: string) {
        let servUrl = environment.apiUrl;
        let fetchCheckOutDetailsUrl = servUrl + 'Bookings/BookingOperations/getCheckoutCard/' + bookingId + '/' + this.userHotelID;

        return this._http.post(fetchCheckOutDetailsUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );
    }
}