import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UserResolver } from '../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

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

    getBillingsDetails(billNo: any, roomNo: any) {
        let servUrl = environment.apiUrl;
        let fetchBillingUrl = servUrl + 'Accounts/Billings/getBill/' + billNo + '/' + roomNo;

        /*let responseData = {
            "transactions": [
                {
                    "tranxId": 30016,
                    "bookingId": "16090",
                    "tranxDesc": "Room rate charged",
                    "tranxDate": "2019-02-27 02:18:17.4",
                    "folioId": "20004",
                    "roomId": "2",
                    "currency": "INR",
                    "tranxAmount": 978,
                    "discount": 0,
                    "tax": 0,
                    "payment": 0
                },
                {
                    "tranxId": 30017,
                    "bookingId": "16090",
                    "tranxDesc": "Room rate charged",
                    "tranxDate": "2019-02-27 02:19:20.623",
                    "folioId": "20004",
                    "roomId": "2",
                    "currency": "INR",
                    "tranxAmount": 978,
                    "discount": 0,
                    "tax": 0,
                    "payment": 978
                }
            ],
            "totalBill": {
                "billId": 30004,
                "bookingTotal": 978,
                "roomCharge": 978,
                "mealCharge": 0,
                "otherCharges": 0,
                "taxPercentage": 0,
                "amountAfterTax": 0,
                "taxAmount": 0,
                "totalPaidAmount": 978,
                "balanceAmount": 0,
                "active": true
            }
        };*/
        //return of(responseData);

        return this._http.post(fetchBillingUrl, {})
            .pipe(
                map(res => res),
                catchError(this.errorHandler)
            );            
    }

    makeBillPayment(options: any) {
        let servUrl = environment.apiUrl;
        let makeBillPaymentUrl = servUrl + 'Accounts/Billings/makePayment/' + this.userHotelID;

        return this._http.post(makeBillPaymentUrl, options)
            .pipe(
                map(res => res), 
                catchError(this.errorHandler)
            );
    }

    /*getHousekeepingDmakeBillPaymenttails() {
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
    }*/
}