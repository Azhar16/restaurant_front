
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private _auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // this will be passed from the route config
    // on the data property
    if (!this._auth.isAccessableModule(route.data)){
      console.log("role guard: ", route.data);
      if (route.data.moduleName === 'Admin') {
        this.router.navigate(['admin/dashboard']);
      } else {
        this.router.navigate(['ui/dashboard']);
      }
      return false;
    }
    return true;
  }

}