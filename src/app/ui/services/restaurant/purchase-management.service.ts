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
export class PurchaseManagementService {
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

  getPurchaseList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "purchaseCtrl/getAllPurchaseDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  getPurchaseType() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategory";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  addPurchaseDetails(purchaseData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "purchaseCtrl/addPurchaseDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        categoryId: purchaseData.prodType,
        description: purchaseData.prodDesc,
        quantity: purchaseData.prodQuantity,
        price: purchaseData.prodPricing
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  editPurchaseDetails(purchaseData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "purchaseCtrl/addPurchaseDetails";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        categoryId: purchaseData.prodType,
        description: purchaseData.prodDesc,
        quantity: purchaseData.prodQuantity,
        price: purchaseData.prodPricing,
        purchaseId: purchaseData.purchaseid
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  deletePurchase(purchaseId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "purchaseCtrl/deletePurchase?purchaseId=" + purchaseId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
}
