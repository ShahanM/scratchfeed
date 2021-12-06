import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private auth: AuthService,
              private router: Router) { }
              
    canActivate(
      next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log(this.auth.isAuthenticated());
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}