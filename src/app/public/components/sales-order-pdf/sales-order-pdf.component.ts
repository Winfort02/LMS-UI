import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-sales-order-pdf',
  templateUrl: './sales-order-pdf.component.html',
  styleUrls: ['./sales-order-pdf.component.scss']
})
export class SalesOrderPdfComponent implements OnInit {

  constructor(
    public dialogService: DialogService,
    private dynamicDialogConfig: DynamicDialogConfig,
  ) { }

  pdfURL: string = '';
  
  pdf(){
    let binaryData = [];
    binaryData.push(this.dynamicDialogConfig.data.data);
    this.pdfURL = URL.createObjectURL(
      new Blob(binaryData,{ type: 'application/pdf' })
      )
  }
  ngOnInit(): void {
    this.pdf();
  }

}
