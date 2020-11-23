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
export class CloseCounterService {
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

  getClosecounterList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "counterCtrl/getCloseCounterDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  deleteCloseCounter(counterId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "counterCtrl/deleteOpenCloseCounter?counterId=" + counterId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getRestaurantType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllRestaurant";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  getrodayCounter(restaurantId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "counterCtrl/getCounterDetailsByRestaurantId?restaurantId=" +
      restaurantId;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addCloseCounterService(closeCounterData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "counterCtrl/addCloseCounter";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        counterId: closeCounterData.counterId,
        openingBalance: closeCounterData.openingBal,
        restaurantId: closeCounterData.restaurant,
        closingBalance: closeCounterData.closingBal,
        adjustment: closeCounterData.adjustment,
        comments: closeCounterData.comments,
        businessDate: closeCounterData.businessDate,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
}
