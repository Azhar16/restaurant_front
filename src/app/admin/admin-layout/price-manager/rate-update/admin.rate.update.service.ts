import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';

import { AdminResourceService } from '../../../services/admin.resource.service';
import { UserResolver } from '../../../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminRateUpdateService extends AdminResourceService {

  constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
    super(httpClient, _userResolver.getHotelID());
  }

  updatePriceManagerRates(servicePath: string, options: any) {
    options.rateplans.hotelCode = this._userResolver.getHotelID();
    options.timestamp = moment().toISOString();
    return this.updateData(servicePath, options);
  }
}