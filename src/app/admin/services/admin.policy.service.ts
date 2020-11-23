import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminPolicyService {

  userHotelID: String;

  constructor(
    private _userResolver: UserResolver,
    private _http: HttpClient
  ) {
    this.userHotelID = this._userResolver.getHotelID();
  }

  errorHandler(errorRes: Response) {
    console.log("error: ", errorRes, errorRes.status);
    //if(errorRes.headers.status)
    return throwError(errorRes);
  }

  /*getNoShowPolicyList() {
    let servUrl = environment.apiUrl;
    let noShowPolicyUrl = servUrl + 'Config/Policy/getNoShowPolicy/' + this.userHotelID;

    return this._http.post(noShowPolicyUrl, {}).pipe(map(res => {
      return res['noShowPolicies'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  addNoShowPolicy(addNoShowPolicyObject) {
    let servUrl = environment.apiUrl;
    let createNoShowPolicyUrl = servUrl + 'Config/Policy/createNoShowPolicy/' + this.userHotelID;
    console.log("in add child policy: ", addNoShowPolicyObject);
    return this._http.post(createNoShowPolicyUrl, addNoShowPolicyObject).pipe(map(res => res));
  }

  removeNoShowPolicy(options: any) {
    let servUrl = environment.apiUrl;
    let removeNoShowPolicyUrl = servUrl + 'Config/Policy/removeNoShowPolicy/' + this.userHotelID + '/' + options.noshowPolicyID;

    return this._http.delete(removeNoShowPolicyUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/


  /*getPetPolicyList() {
    let servUrl = environment.apiUrl;
    let petPolicyUrl = servUrl + 'Config/Policy/getPetPolicy/' + this.userHotelID;

    return this._http.post(petPolicyUrl, {}).pipe(map(res => {
      return res['petPolicies'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  addNewPetPolicy(addPetPolicyObject: any) {
    let servUrl = environment.apiUrl;
    let createPetPolicyUrl = servUrl + 'Config/Policy/createPetPolicy/' + this.userHotelID;
    console.log("in add pet policy: ", addPetPolicyObject);
    return this._http.post(createPetPolicyUrl, addPetPolicyObject).pipe(map(res => res));
  }

  removePetPolicy(options: any) {
    let servUrl = environment.apiUrl;
    let removePetPolicyUrl = servUrl + 'Config/Policy/removePetPolicy/' + this.userHotelID + '/' + options.petPolicyID;

    return this._http.delete(removePetPolicyUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/

  /*addChildPolicy(addChildPolicyRequestObject: any) {
    let servUrl = environment.apiUrl;
    let createChildPolicyUrl = servUrl + 'Config/Policy/createChildPolicy/' + this.userHotelID;
    console.log("in add child policy: ", addChildPolicyRequestObject);
    return this._http.post(createChildPolicyUrl, addChildPolicyRequestObject).pipe(map(res => res));
  }

  getChildPolicyList() {
    let servUrl = environment.apiUrl;
    let childPolicyUrl = servUrl + 'Config/Policy/getChildPolicy/' + this.userHotelID;

    return this._http.post(childPolicyUrl, {}).pipe(map(res => {
      return res['childPolicies'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  removeChildPolicy(options: any) {
    let servUrl = environment.apiUrl;
    let removeChildPolicyUrl = servUrl + 'Config/Policy/removeChildPolicy/' + this.userHotelID + '/' + options.childPolicyId;

    return this._http.delete(removeChildPolicyUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/

  /*getMealPlanList() {
    let servUrl = environment.apiUrl;
    let mealPlanUrl = servUrl + 'Config/Policy/getMealPlans/' + this.userHotelID;

    return this._http.post(mealPlanUrl, {}).pipe(map(res => {
      return res['mealplans'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  addNewMealPlan(addMealPlanRequestObject) {
    let servUrl = environment.apiUrl;
    let createMealPlanUrl = servUrl + 'Config/Policy/createMealPlans/' + this.userHotelID;
    console.log("in add meal plan: ", addMealPlanRequestObject);
    return this._http.post(createMealPlanUrl, addMealPlanRequestObject).pipe(map(res => res));
  }

  removeMealPlan(options) {
    let servUrl = environment.apiUrl;
    let removeMealPlanUrl = servUrl + 'Config/Policy/removeMealPlan/' + this.userHotelID + '/' + options.mealPlanId;

    return this._http.delete(removeMealPlanUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/

  getCheckInCheckOutPolicyList() {
    let servUrl = environment.apiUrl;
    let checkInCheckOutPolicyUrl = servUrl + 'Config/Policy/getCheckInOutPolicy/' + this.userHotelID;

    return this._http.post(checkInCheckOutPolicyUrl, {}).pipe(map(res => {
      return res['checkInOutPolicies'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

}