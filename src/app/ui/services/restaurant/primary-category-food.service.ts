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
export class PrimaryCategoryFoodService {
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

  getCategoryList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategory";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  getCategoryMaster() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategoryTypeMst";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  addCategoryFood(categorydesp) {
    console.log(
      "addCategoryFoodType service",
      categorydesp.categoryDescription
    );
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl +
      "categoryCtrl/addCategory?category=" +
      categorydesp.categoryDescription +
      "&categoryTypeId=" +
      categorydesp.categotytype;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
  deleteCategoryFood(categoryId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "categoryCtrl/deteleCategory?categoryId=" + categoryId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map((res) => res),
      catchError(this.errorHandler)
    );
  }
}
