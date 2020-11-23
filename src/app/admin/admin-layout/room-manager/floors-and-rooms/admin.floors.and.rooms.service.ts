import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import { AdminResourceService } from '../../../services/admin.resource.service';
import { UserResolver } from '../../../../shared/user.resolver.service';

@Injectable({
    providedIn: 'root'
})
export class AdminFloorsAndRoomsService extends AdminResourceService {

    constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
        super(httpClient, _userResolver.getHotelID());
    }

    public getFloorComponentDetails() {
        // getting floor list response
        let floorListResponse = this.getDataList('Config/Floors/getFloors/', 'floors', false);
        // getting floor-room map list response
        let mappedRoomFloorList = this.getDataList('Config/FloorRoomMap/getFloorRoomMap/', 'floorRoomMap', false);

        return forkJoin(
            floorListResponse,
            mappedRoomFloorList
        );
    }
}