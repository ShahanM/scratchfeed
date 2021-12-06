import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment'


const REGISTER_API = environment.appServer + '/api/auth'
const LOGIN_API = environment.appServer + '/api/auth/login';
const LOGOUT_API = environment.appServer + '/api/auth/logout';
const REFRESH_API = environment.appServer + '/api/auth/refresh';


interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

interface RefreshResponse {
    accessToken: string;
}

interface UserInfo {
    username: string;
    enabled: boolean;
    email: string;
}


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private jwt: JwtHelperService = new JwtHelperService();
    private authStatus: BehaviorSubject<boolean> = 
        new BehaviorSubject(this.isAuthenticated());
    
    private headers: HttpHeaders = new HttpHeaders();

    constructor(private http: HttpClient) {
        this.headers.append('Access-Control-Allow-Origin', '*');
        this.headers.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
        this.headers.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    }

    // Handle authentication error
    private errorHandler(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error(`authentication error: ${error.error.message}`);
        } else {
            console.error(`bad auth response: ${error.status}: ${error.statusText} ${JSON.stringify(error.error)}`);
        }
        return throwError('Loging attempt failed');
    }

    // subscribe to get authentication status updated
    subscribe(next: (status: boolean) => void) {
        this.authStatus.subscribe(next);
    }

    register(username: string, email: string, firstname: string, 
        lastname: string, password: string){
            return this.http.post(REGISTER_API, { username, email, 
            firstname, lastname, password }, { headers: this.headers })
            .pipe(
                mergeMap(_response => {
                    return this.authenticate(username, password);
                }),
                catchError(this.errorHandler)
            );
    }

    // Log user in and get refresh/access tokens
    authenticate(username: string, password: string){
        return this.http.post<LoginResponse>(LOGIN_API, { username, password })
            .pipe(
                mergeMap(response => {
                    //store JWTs
                    console.log('storing tokens');
                    localStorage.setItem('accessToken', response.accessToken);
                    localStorage.setItem('refreshToken', response.refreshToken);

                    // get user info
                    // const opts = {
                    //     headers: new HttpHeaders({
                    //         'Authorization': 'Bearer ' + localStorage.getItem('accessToken') 
                    //     })
                    // };
                    this.headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'))
                    return this.http.get<UserInfo>(LOGIN_API, {headers: this.headers}).pipe(
                        map(userInfo => {
                            localStorage.setItem('username', userInfo.username);
                            localStorage.setItem('enabled', String(userInfo.enabled));
                            localStorage.setItem('email', String(userInfo.email));
                            this.authStatus.next(true);
                        })
                    )
                }),
                catchError(this.errorHandler)
            );
    }

    // Log user out, clear stored tokens
    deauthenticate() {
        // const opts = {
        //     headers: new HttpHeaders({
        //         'Authorization': ' Bearer ' + localStorage.getItem('refreshToken')
        //     })
        // };
        localStorage.clear();
        this.authStatus.next(false);
        // return this.http.post(LOGOUT_API, {}, opts)
        //     .pipe(
        //         map(response => null),
        //         catchError(this.errorHandler)
        //     );
    }

    // Get access token, automatically refresh if necessary
    getAccessToken(): Observable<string> {
        const accessToken = localStorage.getItem('accessToken') || '';
        const refreshToken = localStorage.getItem('refreshToken') || '';
        if (!this.jwt.isTokenExpired(accessToken)) {
            return new BehaviorSubject(accessToken);
        } else if (this.jwt.isTokenExpired(refreshToken)) {
            console.log('refreshing access token');
            const headers = new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': "DELETE, POST, GET, OPTIONS",
                'Access-Control-Allow-Headers': "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                'Authorization': 'Bearer ' + refreshToken
            });
            // const headers = new HttpHeaders();
            // headers.append("Access-Control-Allow-Origin", "*");
            // headers.append("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
            // headers.append("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
            // headers.append("Authorization", "Bearer " + refreshToken)
            console.log(headers);
            // const opts = {
            //     headers: new HttpHeaders({
            //         'Access-Control-Allow-Origin': '*',
            //         'Authorization': 'Bearer ' + refreshToken
            //     })
            // };
            return this.http.post<RefreshResponse>(REFRESH_API, {}, {headers: headers}).pipe(
                map(response => {
                    localStorage.setItem('accessToken', response.accessToken);
                    console.log('authentication refresh successful');
                    return response.accessToken;
                })
            );
        } else {
            return throwError('refresh token is expired');
        }
    }

    // User is logged in
    isAuthenticated(): boolean {
        console.log(localStorage.getItem('enabled') === 'True');
        return localStorage.getItem('username') !== null &&
                localStorage.getItem('enabled') === 'True' &&
                !this.jwt.isTokenExpired(localStorage.getItem('refreshToken') || '');
    }

    // User is an administrator
    isAdmin(): boolean {
        return localStorage.getItem('isAdmin') == 'true';
    }

    // Get username
    getUsername(): string {
        return localStorage.getItem('username') || '';
    }
}
