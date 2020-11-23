import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import moment from 'moment';

import { AdminResourceService } from '../../../services/admin.resource.service';
import { UserResolver } from '../../../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAvailAndRestrictService extends AdminResourceService {

  constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
    super(httpClient, _userResolver.getHotelID());
  }

  getAvailAndRestrictData() {
    let ratePlanResponse = this.getDataList('Rateplans/getRateplans/', 'ratePlans', false);
    let roomTypeResponse = this.getDataList('Rooms/getRoomTypes/', 'roomTypes', false);
    let ratePlanMappingResponse = this.getDataList('RatePlans/getRoomRateMappings/', 'RTRPMappings', false);

    return forkJoin(
      ratePlanResponse,
      roomTypeResponse,
      ratePlanMappingResponse
    );
  }

  updateAvailAndRestrictData(servicePath: string, options: any) {
    options.availStatusMessages.hotelCode = this._userResolver.getHotelID();
    options.timestamp = moment().toISOString();
    return this.updateData(servicePath, options);
  }
}