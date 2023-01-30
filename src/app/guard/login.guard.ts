import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): any {
    if(this.authService.isLogin()) {
      if(this.authService.currentUser.user_type === 'Admin') {
        this.router.navigate(['/application/dashboard']);
        return false
      } else if (this.authService.currentUser.user_type === 'User') {
        this.router.navigate(['/application/cashier']);
        return false
      }
    }else {
      return true
    }
  }

}