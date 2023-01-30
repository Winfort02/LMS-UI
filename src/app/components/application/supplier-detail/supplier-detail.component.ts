import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SupplierModel } from 'src/app/models/supplier.model';
import { UserModel } from 'src/app/models/user.model';
import { SupplierService } from 'src/app/services/application/supplier/supplier.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent implements OnInit {

  supplierForm: any = FormGroup;
  supplier: SupplierModel = new SupplierModel();
  current_user: UserModel = new UserModel();

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private authService: AuthService
  ) { 
    this.current_user = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.supplier = this.dialogConfig.data;
    this.supplier.is_active = this.supplier.is_active == true ? true : false;
    this.supplierForm = this.formBuilder.group({
      supplier_name: [this.supplier.supplier_name, [Validators.required]],
      contact_number: [this.supplier.contact_number, [Validators.required]],
      email: [this.supplier.email, [Validators.required]],
      address: [this.supplier.address, [Validators.required]],
      created_by: [this.current_user.name, [Validators.required]],
      is_active: [this.supplier.is_active, [Validators.required]],
    });
    this.supplierForm.controls.created_by.disable();
  }

  save() {
    if(this.supplierForm.valid) {
      if(this.supplier.id as number === 0) {
        this.supplier = this.supplierForm.value;
        this.supplier.created_by = this.current_user.name;
        this.supplierService.addSupplier(this.supplier).subscribe({
          next: async (response:any) => {
            this.dialogRef.close({ data: await response.data, code: 201, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return 
          }
        })
      } else {
        this.supplier.supplier_name = this.supplierForm.value.supplier_name;
        this.supplier.contact_number = this.supplierForm.value.contact_number;
        this.supplier.email = this.supplierForm.value.email;
        this.supplier.address = this.supplierForm.value.address;
        this.supplier.is_active = this.supplierForm.value.is_active;
        this.supplierService.updateSupplier(this.supplier.id as number, this.supplier).subscribe({
          next: async (response: any) => {
            this.dialogRef.close({ data: await response.data, code: 201, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return
          }
        });
      }
    }
  }

}
