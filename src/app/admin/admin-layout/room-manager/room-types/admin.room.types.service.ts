import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

import { AdminResourceService } from '../../../services/admin.resource.service';
import { UserResolver } from '../../../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRoomTypesService extends AdminResourceService {

  constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
    super(httpClient, _userResolver.getHotelID());
  }

  public roomTypeDataList() {

    let roomTypeBasicDataListResponse = this.getDataList('Rooms/getRoomTypes/', 'roomTypes', false);
    let ratePlanDataListResponse = this.getDataList('Rateplans/getRateplans/', 'ratePlans', false);
    let roomUnitDataListResponse = this.getDataList('Config/RoomUnits/getRoomUnits/', 'roomUnits', false);
    let roomAmenityDataListResponse = this.getDataList('Config/Aminities/getAminities/', 'aminity', false);
    let roomUnitMappingDataListResponse = this.getDataList('Config/RoomTypeNumberMap/getRTRUMap/', 'rtrumaps', false);
    let ratePlanMappingDataListResponse = this.getDataList('RatePlans/getRoomRateMappings/', 'RTRPMappings', false);
    let roomAmenityMappingDataListResponse = this.getDataList('Config/RoomAminityMap/getRoomAminityMapping/', 'roomAminityMaps', false);

    return forkJoin(
      roomTypeBasicDataListResponse,
      ratePlanDataListResponse,
      roomUnitDataListResponse,
      roomAmenityDataListResponse,
      roomUnitMappingDataListResponse,
      ratePlanMappingDataListResponse,
      roomAmenityMappingDataListResponse
    );

  }
}