import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { validations } from 'src/app/public/validations';
import { UsersService } from 'src/app/services/application/users/users.service';

interface ChangePassword {
  new_password: string;
  confirm_password: string;
}


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  changePasswordForm: any = FormGroup;

  password_details: ChangePassword = {
    new_password: '',
    confirm_password: ''
  }

  constructor(
    private userService: UsersService, 
    private formBuilder: FormBuilder, 
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) { }

  

  ngOnInit(): void {
    this.loadForm();
    
  }

  loadForm() {
    this.changePasswordForm = this.formBuilder.group({
      new_password: [this.password_details.new_password, [Validators.required]],
      confirm_password: [this.password_details.confirm_password, [Validators.required]]
    });
  }

  changePassword() {
    const user_id = this.dialogConfig.data;
    if(!user_id) {
      this.dialogRef.close({success: false, data: { error: { message: 'USER NOT FOUND'} }});
      return;
    }
    if(this.changePasswordForm.valid) {
      this.password_details = this.changePasswordForm.value;
      
      this.userService.resetPassword(this.password_details, user_id).subscribe({
        next: async (response: any) => {
          this.dialogRef.close({success: true, data: response.data})
        },
        error: (error) => {
          this.dialogRef.close({success: false, data: error})
        }
      })
    }
  }
}
