import { Component, OnInit } from '@angular/core';
import { loginModel } from 'src/app/models/login.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { validations } from 'src/app/public/validations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: loginModel = new loginModel();
  loginForm: any = FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginFormValidation();
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
            life: 2500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.isLoading = false;
          setTimeout(() => {
            if(this.authService.isLogin()) {
              location.replace('/application');
              // location.reload();
            }
          }, 1000);
        },
        error: (error) => {
          
          this.messageService.add({
            severity: 'custom',
            detail: error.error.message,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          })
          this.loginForm.controls.password.reset();
          return
        }
      })
    }
  }

}
