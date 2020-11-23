import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationBySourcereportService {

 
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

    getSourceList() {
        let servUrl = environment.apiUrl;
		let sourceUrl = servUrl + 'BookingSource/getSource/' + this.userHotelID;
		console.log("sourceUrl=="+sourceUrl);
        return this._http.get(sourceUrl,{}).pipe(map(res => res), catchError(this.errorHandler));
    }
    
    getSearchDataList(options: any) {
        let servUrl = environment.apiUrl;
        let searchReportUrl = servUrl + 'Report/ReservationReport/ReservationbySource?hotelId='+ this.userHotelID+'&searchBasis='+options.radioOptions+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd+'&source='+options.sourceId+'&status='+options.statusId+'&ShowMarketSegment='+options.segmentCheck;
		console.log("searchReportUrl="+searchReportUrl);
		return this._http.get(searchReportUrl).pipe(map(res => res), catchError(this.errorHandler));
	}
   
}
