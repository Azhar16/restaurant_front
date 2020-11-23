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
export class RecipeService {
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

  getRecipeList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategoryItemList";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  getAllCatergoryList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllCategory";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  getAllMenutypeList() {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "categoryCtrl/getAllItem";
    console.log("counterUrl==" + counterUrl);
    return this._http.get(counterUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
  addRecipeDetails(recipeData) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "recipeCtrl/addRecipe";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        categoryId: recipeData.category,
        menuTypeId: recipeData.menuType,
        description: recipeData.comments,
        price: recipeData.price,
        restaurantId: localStorage.getItem("isCurrentRestaurantId")
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  editRecipeDetails(recipeData) {
    console.log("edit");
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl = servUrl + "recipeCtrl/addRecipe";
    console.log("counterUrl==" + counterUrl);
    return this._http
      .post(counterUrl, {
        categoryId: recipeData.category,
        menuTypeId: recipeData.menuType,
        description: recipeData.comments,
        price: recipeData.price,
        restaurantId: localStorage.getItem("isCurrentRestaurantId"),
        itemMastId: recipeData.itemMastId,
        categoryItemMapId: recipeData.categoryItemMapId
      })
      .pipe(
        map(res => res),
        catchError(this.errorHandler)
      );
  }
  deleteRecipe(recipeId) {
    let servUrl = this.configService.getConfig().baseUrl;
    let counterUrl =
      servUrl + "recipeCtrl/deleteCategoryItem?categoryItemId=" + recipeId;
    console.log("counterUrl==" + counterUrl);
    return this._http.post(counterUrl, {}).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }
}
