import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class HouseCountReportService {

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

  getRoomTypesList() {
      let servUrl = environment.apiUrl;
  let searchUrl = servUrl + 'Rooms/getRoomTypes/' + this.userHotelID;
  console.log("counterUrl=="+searchUrl);
      return this._http.post(searchUrl,{}).pipe(map(res => res), catchError(this.errorHandler));
}

 

getSearchedDataList(options: any) {
      let servUrl = environment.apiUrl;
      let searchedReportUrl = servUrl + 'Report/OccupancyReport/houseCountReport?hotelId='+ this.userHotelID+'&roomtypes='+options.roomType+'&startDate='+options.tcDatePickerStart+'&endDate='+options.tcDatePickerEnd;
  console.log("cashierReportUrl="+searchedReportUrl);
  return this._http.get(searchedReportUrl).pipe(map(res => res), catchError(this.errorHandler));
}
}
