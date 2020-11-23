import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let authToken = localStorage.getItem("token");
        if (authToken) {
            //console.log("in if jwt");
            request = request.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "authToken": `${authToken}`                    
                }
            });
        }else {
            //console.log("in else jwt");
            request = request.clone({
                setHeaders: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*"                                    
                }
            });
        }
 
        return next.handle(request);
    }
}