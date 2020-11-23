import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdminResourceService } from '../../../services/admin.resource.service';
import { UserResolver } from '../../../../shared/user.resolver.service';

@Injectable({
  providedIn: 'root'
})
export class AdminChildPolicyService extends AdminResourceService {

  constructor(httpClient: HttpClient, private _userResolver: UserResolver) {
    super(httpClient, _userResolver.getHotelID());
  }
}