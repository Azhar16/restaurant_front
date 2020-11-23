import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class FinancialreportService {

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
	
	

	 getFinancialReportList(options: any) {
        let servUrl = environment.apiUrl;
        let financialReportUrl = servUrl + 'Report/FinancialReport?hotelId='+ this.userHotelID+'&counterId='+options.counterId+'&searchBasis='+options.radioOptions+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd;
		console.log("financialReportUrl="+financialReportUrl);
		return this._http.get(financialReportUrl).pipe(map(res => res), catchError(this.errorHandler));
	}
	
}
