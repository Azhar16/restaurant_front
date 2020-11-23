import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, forkJoin, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { UserResolver } from "../../../shared/user.resolver.service";
import { ConfigService } from "../../../config.service";

@Injectable({
  providedIn: "root",
})
export class CalenderBusinessService {
  userHotelID: String;

  constructor(
    private _userResolver: UserResolver,
    private _http: HttpClient,
    public configService: ConfigService
  ) {
    this.userHotelID = this._userResolver.getHotelID();
  }

  errorHandler(errorRes: Response) {
    console.log("error: ", errorRes, errorRes.status);
    return throwError(errorRes);
  }

  getCalenderDetails(restaurantId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "businessCtrl/getCalenderViewSummaryData?restaurantId=" +
      restaurantId;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getCalenderView(restaurantId, cDate) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "businessCtrl/getCalenderViewDetailsData?restaurantId=" +
      restaurantId +
      "&sysDate=" +
      cDate;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
