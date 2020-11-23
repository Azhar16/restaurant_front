import { forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdminResourceService } from '../../services/admin.resource.service';
import { UserResolver } from '../../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGeneralPropertyService extends AdminResourceService {

  constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
    super(httpClient, _userResolver.getHotelID());
  }

  generalSettingsData() {
    let currencyResponse = this.getDataList('Config/Property/getCurrencyList/', 'Currencies', false);
    let languageResponse = this.getDataList('Config/Property/getLanguageList/', 'Languages', false);
    let generalSettingsResponse = this.getData('Config/Property/getPropertyConfiguration/');

    return forkJoin(
      currencyResponse,
      languageResponse,
      generalSettingsResponse
    );
  }
}