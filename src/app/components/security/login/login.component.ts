import { Component, OnInit } from '@angular/core';
import { loginModel } from 'src/app/models/login.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { validations } from 'src/app/public/validations';
import { Router } from '@angular/router';
import { ThemeServiceService } from 'src/app/services/application/theme/theme-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: loginModel = new loginModel();
  loginForm: any = FormGroup;
  isLoading: boolean = false;
  theme: any = localStorage.getItem('theme');

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeServiceService
  ) { }

  ngOnInit(): void {
    this.loginFormValidation();
    if(this.theme) {
      let theme = this.theme == 'true' ? 'dark' : 'light';
      this.themeService.switchTheme(theme);
    } else {
      this.themeService.switchTheme('dark');
    }
    
  }


  loginFormValidation() {
    this.loginForm = this.formBuilder.group({
      username: [null , [Validators.required]],
      password: [null , [Validators.required]]
    })
  }


  signIn() {
    if(this.loginForm.valid) {
      this.isLoading = true;
      this.user = this.loginForm.value;

      this.authService.login(this.user).subscribe({
        next: async (response: any ) => {
          this.messageService.add({
            severity: 'custom',
            detail: 'Welcome ' + response.data.name,
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
          this.isLoading = false;
          setTimeout(() => {
            if(this.authService.isLogin()) {
              // location.replace('/application');
              localStorage.setItem('theme', this.theme);
              location.reload();
            }
          }, 1000);
        },
        error: (error) => {
          
          this.messageService.add({
            severity: 'custom',
            detail: error.error.message,
            life: 2000,
            closable: false,
            icon: 'pi-exclamation-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          })
          this.loginForm.controls.password.reset();
          return
        }
      })
    }
  }

}
