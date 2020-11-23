import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private _auth: AuthService, private _router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!this._auth.isAuthenticated()) {
            this._router.navigate(['/login']);
            console.log("you are not authorized to view this page ");
            return false;
        }
        return true;
    }
}


// https://www.youtube.com/watch?v=k3_6a7anWBQ
// canActivate
// CanActivateChild
// CanDeactivate
// Resolve
// CanLoad