import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BrandService } from 'src/app/services/application/brand/brand.service';
import { BrandModel } from 'src/app/models/brand.model';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.scss']
})
export class BrandDetailComponent implements OnInit {

  brandForm: any = FormGroup;
  brand: BrandModel = new BrandModel();
  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private brandService: BrandService
  ) { }

  ngOnInit(): void {
    this.loadData();
  } 

  loadData() {
    this.brand = this.dialogConfig.data;
    this.brand.is_active = this.brand.is_active == true ? true : false;
    this.brandForm = this.formBuilder.group({
      brand_name: [this.brand.brand_name, [Validators.required]],
      description: [this.brand.description, [Validators.required]],
      is_active: [this.brand.is_active, [Validators.required]],
    });
  }

  save() {
    if(this.brandForm.valid) {
      if(this.brand.id as number === 0) {
        this.brand = this.brandForm.value;
        this.brandService.addBrand(this.brand).subscribe({
          next: async (response:any) => {
            this.dialogRef.close({ data: await response.data, code: 201, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return 
          }
        })
      } else {
        this.brand.brand_name = this.brandForm.value.brand_name;
        this.brand.description = this.brandForm.value.description;
        this.brand.is_active = this.brandForm.value.is_active;
        this.brandService.updateBrand(this.brand.id as number, this.brand).subscribe({
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
