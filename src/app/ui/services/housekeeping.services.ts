import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class HousekeepingService {

    userHotelID: String;

    constructor(
        private _userResolver: UserResolver,
        private _http: HttpClient
    ) {
        this.userHotelID = this._userResolver.getHotelID();
    }

    errorHandler(errorRes: Response) {
        console.log("error: ", errorRes, errorRes.status);
        return throwError(errorRes);
    }

    getHousekeepingDetails() {
        let servUrl = environment.apiUrl;
        let fetchHousekeepingDetailsUrl = servUrl + 'HouseKeeping/RoomUnits/getRoomUnits/' + this.userHotelID;
        //console.log("in house keeping services: ", fetchHousekeepingDetailsUrl);

        return this._http.post(fetchHousekeepingDetailsUrl, {})
            .pipe(
                map(res => {
                    return res['hkRoomUnits'].map(
                        (item: any) => {
                            item['checked'] = false;
                            return item;
                        }
                    )
                }), 
                catchError(this.errorHandler)
            );
    }

    updateHousekeepingDetails(options: any) {
        let servUrl = environment.apiUrl;
        let updateHousekeepingDetailsUrl = servUrl + 'HouseKeeping/RoomUnits/updateRoomUnit/' + this.userHotelID;
        //console.log("in house keeping services: ", fetchHousekeepingDetailsUrl);

        return this._http.post(updateHousekeepingDetailsUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    getAllHousekeepingEmployeeList() {
        let servUrl = environment.apiUrl;
        let getAllHousekeepingEmployeeListURL = servUrl + 'Housekeeping/Employee/getEmployees/' + this.userHotelID;
        //console.log("in house keeping services: ", fetchHousekeepingDetailsUrl);

        return this._http.post(getAllHousekeepingEmployeeListURL, {}).pipe(map(res => res), catchError(this.errorHandler));
    }

    getAllHotelEmployeeList() {
        let servUrl = environment.apiUrl;
        let getAllHotelEmployeeListURL = servUrl + 'Config/Operations/getEmployees/' + this.userHotelID;
        //console.log("in house keeping services: ", fetchHousekeepingDetailsUrl);

        return this._http.post(getAllHotelEmployeeListURL, {}).pipe(map(res => res), catchError(this.errorHandler));
    }
}