import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class ApplicationGuard implements CanActivate {

  constructor(private router: Router, private messageService: MessageService, private authService: AuthService ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const routeData = route.data;
    const type = routeData.user_type;
    if(this.authService.isLogin()) {
      let check_type = false;
      for(let i = 0; i < type.length; i++) {
        if(type[i] === this.authService.currentUser.user_type) {
          check_type = true;
        }
      }

      if(this.authService.currentUser.user_type === 'Admin' || this.authService.currentUser.user_type === 'User') {
        if(this.authService.isLogin() && check_type) return true;
        this.messageService.add({
          severity: 'custom',
          detail: 'Unauthorized ',
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.router.navigate(['/application']);
        return false;
      } else {
        localStorage.clear();
        this.router.navigate(['/security/login']);
        return false;
      }
    } else {
      localStorage.clear();
      this.router.navigate(['/security/login']);
      return false;
    }
  }

}