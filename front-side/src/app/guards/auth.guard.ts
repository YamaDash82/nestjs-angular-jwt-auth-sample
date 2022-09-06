import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor (
    private auth: AuthService, 
    private router: Router, 
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    const autenticated = await this.auth.isAutenticated();
    
    if (autenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);

      return false;
    }
  }
}
