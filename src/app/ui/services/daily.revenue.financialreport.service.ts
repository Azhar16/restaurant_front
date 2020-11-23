import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';


 import 'moment-timezone';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DailyRevenueFinancialreportService {

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
	
	 getDailyRevenueFinancialReportList(options: any) {
		let servUrl = environment.apiUrl;
		let dailyRevenueUrl = servUrl + 'Report/FinancialReport/RevenueReport?hotelId='+this.userHotelID+'&startDate='+options.tcDatePickerStart;
		console.log('url =='+dailyRevenueUrl);
		return this._http.get(dailyRevenueUrl).pipe(map(res => res), catchError(this.errorHandler));
		
	}
	

}
