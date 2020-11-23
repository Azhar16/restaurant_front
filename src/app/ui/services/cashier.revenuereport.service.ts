import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class CashierRevenuereportService {

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

    getCounterList() {
        let servUrl = environment.apiUrl;
		let counterUrl = servUrl + 'Accounts/Billings/getCounters/' + this.userHotelID;
		console.log("counterUrl=="+counterUrl);
        return this._http.post(counterUrl,{}).pipe(map(res => res), catchError(this.errorHandler));
	}

	    getUserList() {
        let servUrl = environment.apiUrl;
		let getuserUrl = servUrl + 'Config/UserManagement/getUserList/' + this.userHotelID;
		console.log("getuserUrl=="+getuserUrl);
        return this._http.post(getuserUrl,{}).pipe(map(res => res), catchError(this.errorHandler));
	}

	 getCahsierDataList(options: any) {
        let servUrl = environment.apiUrl;
        let cashierReportUrl = servUrl + 'Report/CashierReport?hotelId='+ this.userHotelID+'&counterId='+options.counterId+'&posPoint='+options.posPoint+'&userName='+options.userName+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd;
		console.log("cashierReportUrl="+cashierReportUrl);
		return this._http.get(cashierReportUrl).pipe(map(res => res), catchError(this.errorHandler));
	}
}
