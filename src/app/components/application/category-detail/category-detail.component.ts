import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryModel } from 'src/app/models/category.model';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryService } from 'src/app/services/application/category/category.service';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent implements OnInit {

  categoryForm: any = FormGroup
  category: CategoryModel = new CategoryModel();

  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.category = this.dialogConfig.data;
    this.category.is_active = this.category.is_active == true ? true : false;
    this.categoryForm = this.formBuilder.group({
      category_name: [this.category.category_name, [Validators.required]],
      description: [this.category.description, [Validators.required]],
      is_active: [this.category.is_active, [Validators.required]],
    });
  }

  save() {
    if(this.categoryForm.valid) {
      if(this.category.id as number === 0) {
        this.category = this.categoryForm.value;
        this.categoryService.addCategory(this.category).subscribe({
          next: async (response:any) => {
            this.dialogRef.close({ data: await response.data, code: 201, success: true});
          },
          error: async (error) => {
            this.dialogRef.close({ data: await error.message, code: error.status, success: false});
            return 
          }
        })
      } else {
        this.category.category_name = this.categoryForm.value.category_name;
        this.category.description = this.categoryForm.value.description;
        this.category.is_active = this.categoryForm.value.is_active;
        this.categoryService.updateCategory(this.category.id as number, this.category).subscribe({
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
