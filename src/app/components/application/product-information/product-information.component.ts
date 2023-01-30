import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-information',
  templateUrl: './product-information.component.html',
  styleUrls: ['./product-information.component.scss']
})
export class ProductInformationComponent implements OnInit {

  imgUrl: string = `${environment.imgUrl}/storage/images/`;

  product: ProductModel = new ProductModel();
  isComponentShown: boolean = false;
  imgSource: any;
  
  constructor(
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    if(this.dialogConfig.data) {
      this.product = this.dialogConfig.data;
      this.imgSource = this.imgUrl + this.product.image;
      this.isComponentShown = true;
    }
  }

}
