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
export class KitchenOrderService {
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

  getRestaurantType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getAllRestaurant";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getKitchenOrder(kitchenOrder) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "orderMgntCtlr/getAllKotDtlsforListAndTileView?restaurantId=" +
      kitchenOrder.restaurant +
      "&period=" +
      kitchenOrder.period +
      "&status=" +
      kitchenOrder.status +
      "&limitValue=" +
      kitchenOrder.limitValue +
      "&viewName=" +
      kitchenOrder.view;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  getOrderItemDetailsBykotid(kotid) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "orderMgntCtlr/getOrerItemDetailsByKot?kot=" + kotid;
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }

  setKotStatus(item, setStatus, getStatus) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "orderMgntCtlr/changeKotStatus?setStatus=" +
      setStatus +
      "&kot=" +
      item.ticketNo +
      "&currentStatus=" +
      getStatus;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  deleteTicketItem(tpeid, type) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "orderMgntCtlr/deleteItemORTicket?orderItemId=" +
      tpeid +
      "&type=" +
      type;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
