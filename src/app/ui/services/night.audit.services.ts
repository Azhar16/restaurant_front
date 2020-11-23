import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class NightAuditService {

    userHotelID: string;

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

    getLoggedUserList() {
        let servUrl = environment.apiUrl;
        let loggedUserUrl = servUrl + 'NightAudit/getLogedInUsers/' + this.userHotelID;
        return this._http.post(loggedUserUrl, {}).pipe(map(res => res), catchError(this.errorHandler));

        /*let res = {
            "users": [
                {
                    "userId": 2,
                    "userName": "Ram Mohan Patralekh",
                    "loginId": "RammohanP",
                    "password": null,
                    "userType": "Admin",
                    "isChainUser": 1,
                    "hotelId": 0,
                    "posUnlockPin": null,
                    "permittedIps": [],
                    "shiftFrom": null,
                    "shiftTo": null,
                    "counter": null,
                    "empId": null
                },
                {
                    "userId": 3,
                    "userName": "Suresh Kumar",
                    "loginId": "SureshK",
                    "password": null,
                    "userType": "Frontdesk Manager",
                    "isChainUser": 0,
                    "hotelId": 0,
                    "posUnlockPin": null,
                    "permittedIps": [],
                    "shiftFrom": null,
                    "shiftTo": null,
                    "counter": null,
                    "empId": null
                },
                {
                    "userId": 4,
                    "userName": "Mahesh Kumar",
                    "loginId": "MaheshK",
                    "password": null,
                    "userType": "Manager",
                    "isChainUser": 0,
                    "hotelId": 0,
                    "posUnlockPin": null,
                    "permittedIps": [],
                    "shiftFrom": null,
                    "shiftTo": null,
                    "counter": null,
                    "empId": null
                },
                {
                    "userId": 7,
                    "userName": "Vivek Gupta",
                    "loginId": "VivekG",
                    "password": null,
                    "userType": "Admin",
                    "isChainUser": 1,
                    "hotelId": 0,
                    "posUnlockPin": null,
                    "permittedIps": [],
                    "shiftFrom": null,
                    "shiftTo": null,
                    "counter": null,
                    "empId": null
                }
            ]
        };

        return of(res);*/
    }

    getOthersLoggedOut(options: any) {
        let servUrl = environment.apiUrl;
        let loggedOutUserUrl = servUrl + 'NightAudit/logoutUsers/' + this.userHotelID;
        return this._http.post(loggedOutUserUrl, options).pipe(map(res => res), catchError(this.errorHandler));

        /*let res = {
            successList: [
                {
                    "status": "Success",
                    "message": "all users logged out"
                }
            ]
        }

        return of(res);*/
    }

    getDueIns() {
        let servUrl = environment.apiUrl;
        let dueInUrl = servUrl + 'NightAudit/getDueIns/' + this.userHotelID;
        return this._http.post(dueInUrl, {}).pipe(map(res => res), catchError(this.errorHandler));

        /*let res = {
            "arrival": [
                {
                    "bookingID": 1061,
                    "channelRefNum": "19953988T",
                    "bookingDate": "2018-10-29",
                    "arrivalDate": "2018-10-29 00:00:00.0",
                    "departureDate": "2018-10-30 00:00:00.0",
                    "los": 0,
                    "adult": 2,
                    "child": 0,
                    "assignedRoomNumber": "104",
                    "guestNames": {
                        "guestNames": [
                            {
                                "namePrefix": "Mr.",
                                "givenName": "Ratan",
                                "middleName": "",
                                "surName": "test2"
                            }
                        ]
                    }
                },
                {
                    "bookingID": 1062,
                    "channelRefNum": "29953989T",
                    "bookingDate": "2018-10-29",
                    "arrivalDate": "2018-10-29 00:00:00.0",
                    "departureDate": "2018-10-30 00:00:00.0",
                    "los": 0,
                    "adult": 2,
                    "child": 0,
                    "assignedRoomNumber": "104",
                    "guestNames": {
                        "guestNames": [
                            {
                                "namePrefix": "Mr.",
                                "givenName": "Jibal",
                                "middleName": "",
                                "surName": "test2"
                            }
                        ]
                    }
                },
                {
                    "bookingID": 1063,
                    "channelRefNum": "39953989T",
                    "bookingDate": "2018-10-29",
                    "arrivalDate": "2018-10-29 00:00:00.0",
                    "departureDate": "2018-10-30 00:00:00.0",
                    "los": 0,
                    "adult": 2,
                    "child": 0,
                    "assignedRoomNumber": "104",
                    "guestNames": {
                        "guestNames": [
                            {
                                "namePrefix": "Mr.",
                                "givenName": "Madan",
                                "middleName": "",
                                "surName": "test2"
                            }
                        ]
                    }
                }
            ]
        };

        return of(res);*/
    }

    markNoShow(options: any) {
        let servUrl = environment.apiUrl;
        let noShowUserUrl = servUrl + 'NightAudit/markNoshow/' + this.userHotelID;
        return this._http.post(noShowUserUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    }

    markNextDayArrival(options: any) {
        let servUrl = environment.apiUrl;
        let nextDayArrivalUserUrl = servUrl + 'NightAudit/changeArrivalToNextDay/' + this.userHotelID;
        return this._http.post(nextDayArrivalUserUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    }

    // markCheckIn(options: any) {
    //     let servUrl = environment.apiUrl;
    //     let checkInUserUrl = servUrl + 'NightAudit/markCheckedIn/' + this.userHotelID;
    //     return this._http.post(checkInUserUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    // }

    getDueOuts() {
        let servUrl = environment.apiUrl;
        let dueOutUrl = servUrl + 'NightAudit/getDueOuts/' + this.userHotelID;
        return this._http.post(dueOutUrl, {}).pipe(map(res => res), catchError(this.errorHandler));
    }

    markCheckedOut(options: any) {
        let servUrl = environment.apiUrl;
        let checkedOutUrl = servUrl + 'NightAudit/markCheckedOut/' + this.userHotelID;
        return this._http.post(checkedOutUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    }
    
    extendStay(options: any) {
        let servUrl = environment.apiUrl;
        let extendStayUserUrl = servUrl + 'NightAudit/extendStay/' + this.userHotelID;
        return this._http.post(extendStayUserUrl, options).pipe(map(res => res), catchError(this.errorHandler));
    }

    closeCashCounter(options: any) {
        let servUrl = environment.apiUrl;
        let closeCashCounterUrl = servUrl + 'NightAudit/closeCashCounter/' + this.userHotelID;
        return this._http.post(closeCashCounterUrl, options).pipe(map(res => res), catchError(this.errorHandler));
        
    }
}