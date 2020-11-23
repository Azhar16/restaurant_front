import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class SourceOfBusinessReportService {



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
    let searchUrl = servUrl + 'Report/businessSourceReport?hotelId='+ this.userHotelID+'&searchBasis='+options.radioOptions+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd;
console.log("searchUrl="+searchUrl);
return this._http.get(searchUrl).pipe(map(res => res), catchError(this.errorHandler));
}

}
