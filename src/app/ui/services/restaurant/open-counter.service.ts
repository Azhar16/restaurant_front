import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, forkJoin, Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { environment } from "../../../../environments/environment";
import { UserResolver } from "../../../shared/user.resolver.service";

import { ConfigService } from "../../../config.service";

@Injectable({
  providedIn: "root"
})
export class OpenCounterService {
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

  getOpenCounterList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "counterCtrl/getOpenCounterDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  getRestaurantType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllRestaurant";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  addOpenCounterDetails(openCounterData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "counterCtrl/addOpenCounterDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        date: openCounterData.date,
        restaurant: openCounterData.restaurant,
        openingBal: openCounterData.openingBal
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  editOpenCounterDetails(openCounterData) {
    http: let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "counterCtrl/addOpenCounterDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        date: openCounterData.date,
        restaurant: openCounterData.restaurant,
        openingBal: openCounterData.openingBal,
        counterId: openCounterData.counterId
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }

  deleteOpenCounter(counterId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "counterCtrl/deleteOpenCloseCounter?counterId=" + counterId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
}
