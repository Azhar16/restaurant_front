import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class GuestTrialBalanceReportService {
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
    let searchrequestUrl = servUrl + 'Report/guestReport/guestTrialBalanceReport?hotelId='+ this.userHotelID+'&businessDate='+options.tcDatePickerStart+'&status='+options.statusName;
    console.log("searchrequestUrl="+searchrequestUrl);
    return this._http.get(searchrequestUrl).pipe(map(res => res), catchError(this.errorHandler));
}
}
