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
export class RestaurantTaxService {
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
  getTaxList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/getTaxMasterDeatils";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getAllMenutypeList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllItem";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getTaxCodeList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategory";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
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
  addTaxDetails(taxData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addTaxMaster";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantId: taxData.restaurant,
        taxCode: taxData.taxcode,
        taxDescription: taxData.description,
        taxValue: taxData.value,
        itemTypeId: taxData.category,
        taxValueType: taxData.valueType,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  editTaxDetails(taxData) {
    console.log("edit");
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/addTaxMaster";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        restaurantId: taxData.restaurant,
        taxCode: taxData.taxcode,
        taxDescription: taxData.description,
        taxValue: taxData.value,
        itemTypeId: taxData.category,
        taxValueType: taxData.valueType,
        taxId: taxData.taxId,
        taxMapId: taxData.taxMapId,
      })
      .pipe(
        map((res) => res),
        catchError(this.errorHandler)
      );
  }
  deleteTax(taxId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "restaurantCtrl/deteleTaxDetails?taxId=" + taxId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
