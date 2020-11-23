import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

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

  /* *********** Room Amenity related services ******************* */
  
  /*createAminity(options) {
    let servUrl = environment.apiUrl;
    let createAmenityUrl = servUrl + 'Config/Aminities/createAminity/' + this.userHotelID;

    return this._http.post(createAmenityUrl, options).pipe(map(res => res));
  }

  getAllAmenities() {
    let servUrl = environment.apiUrl;
    let amenityUrl = servUrl + 'Config/Aminities/getAminities/' + this.userHotelID;

    return this._http.post(amenityUrl, {}).pipe(map(res => {
      return res['aminity'].map(
        item => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  updateAminity(options: any) {
    let servUrl = environment.apiUrl;
    let updateAmenityUrl = servUrl + 'Config/Aminities/updateAminity/' + this.userHotelID;

    return this._http.post(updateAmenityUrl, options).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }

  removeAminity(options: any) {
    let servUrl = environment.apiUrl;
    let removeAmenityUrl = servUrl + 'Config/Aminities/removeAminity/' + this.userHotelID + '/' + options.aminityId;

    return this._http.delete(removeAmenityUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/


  /* ********* Room Unit related services ********* */
  /*getRoomUnitList() {
    let servUrl = environment.apiUrl;
    let roomUnitUrl = servUrl + 'Config/RoomUnits/getRoomUnits/' + this.userHotelID;

    return this._http.post(roomUnitUrl, {}).pipe(map(res => res['roomUnits']),
      catchError(this.errorHandler));
  }*/

  /*createRoomUnit(options: any) {
    let servUrl = environment.apiUrl;
    let createRoomUnitUrl = servUrl + 'Config/RoomUnits/createRoomUnit/' + this.userHotelID;

    return this._http.post(createRoomUnitUrl, options).pipe(map(res => res),
      catchError(this.errorHandler));
  }

  removeRoomUnit(options: any) {
    let servUrl = environment.apiUrl;
    let removeRoomUnitUrl = servUrl + 'Config/RoomUnits/removeRoomUnit/' + this.userHotelID + '/' + options['ruid'];

    return this._http.delete(removeRoomUnitUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }*/

  /* ********** Floor Management related services *********** */
  /*getFloorList(){
    let servUrl = environment.apiUrl;
    let floorListUrl = servUrl + 'Config/Floors/getFloors/' + this.userHotelID;
    
    return this._http.post(floorListUrl, {}).pipe(map(res => res['floors']),
    catchError(this.errorHandler));
  }
  
  getFloorRoomMapDetails(){
    let servUrl = environment.apiUrl;
    let getFloorRoomMapUrl = servUrl + 'Config/FloorRoomMap/getFloorRoomMap/' + this.userHotelID;

    return this._http.post(getFloorRoomMapUrl, {}).pipe(map(res => res['floorRoomMap']),
      catchError(this.errorHandler));
  }

  getFloorComponentDetails() {  
    let floorListResponse = this.getFloorList();
    let mappedRoomFloorList = this.getFloorRoomMapDetails();

      return forkJoin(
        floorListResponse,
        mappedRoomFloorList
    );
  }

  createFloor(options: any) {
    let servUrl = environment.apiUrl;
    let createFloorUrl = servUrl + 'Config/floors/' + this.userHotelID;

    return this._http.post(createFloorUrl, options).pipe(map(res => res),
      catchError(this.errorHandler));
  }

  removeFloor(options: any) {
    let servUrl = environment.apiUrl;
    let removeRoomUnitUrl = servUrl + 'Config/floors/removefloors/' + this.userHotelID + '/' + options['floorID'];

    return this._http.delete(removeRoomUnitUrl).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }


  createFloorRoomMap(options: any): Observable<any> {
    let servUrl = environment.apiUrl;
    let createFloorRoomMapUrl = servUrl + 'Config/FloorRoomMap/' + this.userHotelID;

    return this._http.post(createFloorRoomMapUrl, options).pipe(map(res => res),
      catchError(this.errorHandler));
  }*/


  /*getTaxesList(): Observable<any> {
    let servUrl = environment.apiUrl;
    let getTaxListUrl = servUrl + 'Config/Taxes/getTaxes/' + this.userHotelID;

    return this._http.post(getTaxListUrl, {}).pipe(map(res => {
      return res['taxes'].map(
        (item: any) => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }

  createTax(options: any): Observable<any> {
    let servUrl = environment.apiUrl;
    let createTaxUrl = servUrl + 'Config/Taxes/saveTax/' + this.userHotelID;

    return this._http.post(createTaxUrl, options).pipe(map(res => res),
      catchError(this.errorHandler));
  }

  updateTaxDetails(options: any): Observable<any> {
    let servUrl = environment.apiUrl;
    let updateTaxUrl = servUrl + 'Config/Taxes/updateTax/' + this.userHotelID;

    return this._http.post(updateTaxUrl, options).pipe(
      map(res => res),
      catchError(this.errorHandler)
    );
  }

  removeTax(taxID: string): Observable<any> {
    let servUrl = environment.apiUrl;
    let removeTaxUrl = servUrl + 'Config/Taxes/removeTax/' + this.userHotelID + '/' + taxID;

    return this._http.delete(removeTaxUrl).pipe(map(res => res),
      catchError(this.errorHandler));
  }*/

  /*************admin department services  ************* */
  /*getDepartmentList(): Observable<any> {
    let servUrl = environment.apiUrl;
    let getDepartmentListUrl = servUrl + 'Config/Departments/getDepartments/' + this.userHotelID;

    return this._http.post(getDepartmentListUrl, {}).pipe(map(res => {
      return res['departments'].map(
        (item: any) => {
          item['editable'] = false;
          return item;
        }
      )
    }),
      catchError(this.errorHandler));
  }*/


}
