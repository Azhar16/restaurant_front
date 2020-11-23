import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class PriceManagerService {
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

    getRatePrice(options: any) {
        let servUrl = environment.apiUrl;
        let fetchRatePriceUrl = servUrl + 'PriceManager/getRateAmount/' + this.userHotelID;

        /*let responseData = {
            "roomRate": [
                {
                    "roomID": options.roomID,
                    "rateplanID": options.rateplanID,
                    "checkinDate": options.checkinDate,
                    "rateAmount": 2500,
                    "checkoutDate": options.checkoutDate
                }
            ]
        };

        return of(responseData);*/
        return this._http.post(fetchRatePriceUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }
}