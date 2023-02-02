import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CustomerModel } from 'src/app/models/customer.model';
import { UserModel } from 'src/app/models/user.model';
import { validations } from 'src/app/public/validations';
import { CustomerService } from 'src/app/services/application/customer/customer.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

  current_user: UserModel = new UserModel();

  customerForm: any = FormGroup;
  customer: CustomerModel = new CustomerModel();
  gender_option: Array<{label: string, value: string}> = [
    {label: 'Select', value: ''},
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
    {label: 'Other', value: 'Other'}
  ];


  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private customerService: CustomerService,
    private authService: AuthService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { 
    this.current_user = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    this.customer = this.dialogConfig.data;
    this.customer.is_active = this.customer.is_active == true ? true : false;
    this.customerForm = this.formBuilder.group({
      id: [this.customer.id],
      customer_name: [this.customer.customer_name, [Validators.required, Validators.pattern(validations.nameValidation)]],
      email: [this.customer.email],
      phone_number: [this.customer.phone_number, [Validators.required]],
      address: [this.customer.address, [Validators.required]],
      gender: [this.customer.gender, [Validators.required]],
      is_active: [this.customer.is_active, [Validators.required]],
      created_by: [this.current_user.name, [Validators.required]]
    });
    
    this.customerForm.controls.created_by.disable();
  }


  save() {
    if(this.customerForm.valid) {
      this.customer = this.customerForm.value;
      this.customer.created_by = this.current_user.name;
      if(this.customer.id as number == 0) {
        this.customerService.addCustomer(this.customer).subscribe({
          next: async (response: any) => {
            this.dialogRef.close({ data: await response.data, code: 201, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return 
          }
        })
      } else {
        this.customerService.updateCustomer(this.customer.id as number, this.customer).subscribe({
          next: async (response: any) => {
            this.dialogRef.close({ data: await response.data, code: 200, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return
          }
        })
      }
    }
  }

}
