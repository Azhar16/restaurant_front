import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class OpenCloseCashCounterService {

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

    openCashCounter(options: any) {
        let servUrl = environment.apiUrl;
        let openCashCounterUrl = servUrl + 'Config/Billings/openCashCounter/' + this.userHotelID;
        //let openCashCounterUrl = servUrl + 'NightAudit/openCashCounter/' + this.userHotelID;

        return this._http.post(openCashCounterUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    closeCashCounter(options: any) {
        let servUrl = environment.apiUrl;
        let closeCashCounterUrl = servUrl + 'Config/Billings/closeCashCounter/' + this.userHotelID;
        //let closeCashCounterUrl = servUrl + 'NightAudit/closeCashCounter/' + this.userHotelID;

        return this._http.post(closeCashCounterUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    getTransactionSummary(optinons: any) {
        let servUrl = environment.apiUrl;
        let fetchTransactionSummaryUrl = servUrl + 'Accounts/Billings/getTransactionSummary/' + this.userHotelID;
        
        return this._http.post(fetchTransactionSummaryUrl, optinons)
        .pipe(
            map(res => res),
            catchError(this.errorHandler)
        );
    }
}