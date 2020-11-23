import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class DepositReportService {
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

  getSearchedDataList(options: any) {
    let servUrl = environment.apiUrl;
    let requestSearchtUrl = servUrl + 'Report/FinancialReport/DepositeReport?hotelId='+ this.userHotelID+'&searchBasis='+options.radioOptions+'&status='+options.statusName+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd;
    console.log("requestSearchtUrl="+requestSearchtUrl);
    return this._http.get(requestSearchtUrl).pipe(map(res => res), catchError(this.errorHandler));
}

}
