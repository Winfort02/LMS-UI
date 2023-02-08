import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRouterActivate } from './application-router.active';
import { ApplicationRoutingModule } from './application-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import {ChartModule} from 'primeng/chart';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

// PRIMENG MODULES
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {ProgressBarModule} from 'primeng/progressbar';
import { SpeedDialModule } from 'primeng/speeddial';
import { CheckboxModule } from 'primeng/checkbox';
import {ToggleButtonModule} from 'primeng/togglebutton';
import { LayoutModule } from '../layout/layout.module';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ApplicationComponent } from './application.component';


//components
import { DashboardComponent } from 'src/app/components/application/dashboard/dashboard.component';
import { UsersComponent } from 'src/app/components/application/users/users.component';
import { UserDetailComponent } from 'src/app/components/application/user-detail/user-detail.component';
import { CategoryDetailComponent } from 'src/app/components/application/category-detail/category-detail.component';
import { CategoryComponent } from 'src/app/components/application/category/category.component';
import { BrandComponent } from 'src/app/components/application/brand/brand.component';
import { BrandDetailComponent } from 'src/app/components/application/brand-detail/brand-detail.component';
import { CustomerComponent } from 'src/app/components/application/customer/customer.component';
import { CustomerDetailComponent } from 'src/app/components/application/customer-detail/customer-detail.component';
import { SupplierComponent } from 'src/app/components/application/supplier/supplier.component';
import { SupplierDetailComponent } from 'src/app/components/application/supplier-detail/supplier-detail.component';
import { ProductComponent } from 'src/app/components/application/product/product.component';
import { ProductDetailComponent } from 'src/app/components/application/product-detail/product-detail.component';
import { ProductInformationComponent } from 'src/app/components/application/product-information/product-information.component';
import { StockInComponent } from 'src/app/components/application/stock-in/stock-in.component';
import { StockInDetailComponent } from 'src/app/components/application/stock-in-detail/stock-in-detail.component';
import { ProductQueryComponent } from 'src/app/public/components/product-query/product-query.component';
import { StockReturnComponent } from 'src/app/components/application/stock-return/stock-return.component';
import { StockReturnDetailComponent } from 'src/app/components/application/stock-return-detail/stock-return-detail.component';
import { OrderComponent } from 'src/app/components/application/order/order.component';
import { OrderDetailComponent } from 'src/app/components/application/order-detail/order-detail.component';
import { ProductSelectionItemsComponent } from 'src/app/public/components/product-selection-items/product-selection-items.component';
import { UpdateOrderDetailComponent } from 'src/app/components/application/update-order-detail/update-order-detail.component';
import { SalesOrderPdfComponent } from 'src/app/public/components/sales-order-pdf/sales-order-pdf.component';
import { ProductInventoryComponent } from 'src/app/public/components/product-inventory/product-inventory.component';
import { SalesOrderReportComponent } from 'src/app/public/components/sales-order-report/sales-order-report.component';
import { CashierDashboardComponent } from 'src/app/components/application/cashier-dashboard/cashier-dashboard.component';
import { ProductStockInComponent } from 'src/app/public/components/product-stock-in/product-stock-in.component';
import { ProductStockReturnComponent } from 'src/app/public/components/product-stock-return/product-stock-return.component';
import { UserLogComponent } from 'src/app/public/components/user-log/user-log.component';
import { SalesReportComponent } from 'src/app/components/application/sales-report/sales-report.component';
import { SalesOrderItemSummaryReportComponent } from 'src/app/public/components/sales-order-item-summary-report/sales-order-item-summary-report.component';
import { ProductReportComponent } from 'src/app/components/application/product-report/product-report.component';
import { ProductStockInReportComponent } from 'src/app/public/components/product-stock-in-report/product-stock-in-report.component';
import { PlaceOrderDetailComponent } from 'src/app/public/components/place-order-detail/place-order-detail.component';
import { StockReturnReportComponent } from 'src/app/public/components/stock-return-report/stock-return-report.component';
import { ChangePasswordComponent } from 'src/app/components/application/change-password/change-password.component';
import { ResetPasswordComponent } from 'src/app/components/application/reset-password/reset-password.component';

@NgModule({
  declarations: [
    ApplicationComponent,
    UsersComponent,
    DashboardComponent,
    UserDetailComponent,
    CategoryComponent,
    CategoryDetailComponent,
    BrandComponent,
    BrandDetailComponent,
    CustomerComponent,
    CustomerDetailComponent,
    SupplierComponent,
    SupplierDetailComponent,
    ProductComponent,
    ProductDetailComponent,
    ProductInformationComponent,
    StockInComponent,
    StockInDetailComponent,
    ProductQueryComponent,
    StockReturnComponent,
    StockReturnDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    ProductSelectionItemsComponent,
    UpdateOrderDetailComponent,
    SalesOrderPdfComponent,
    ProductInventoryComponent,
    SalesOrderReportComponent,
    CashierDashboardComponent,
    ProductStockInComponent,
    ProductStockReturnComponent,
    UserLogComponent,
    SalesReportComponent,
    SalesOrderItemSummaryReportComponent,
    ProductReportComponent,
    ProductStockInReportComponent,
    PlaceOrderDetailComponent,
    StockReturnReportComponent,
    ChangePasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    SpeedDialModule,
    ToggleButtonModule,
    LayoutModule,
    ProgressBarModule,
    BreadcrumbModule,
    ChartModule,
    NgxDocViewerModule
  ],
  providers: [
    ApplicationRouterActivate,
    DialogService,
    MessageService,
    ConfirmationService,
    DatePipe,
    DynamicDialogRef,
    DynamicDialogConfig,
    Location
  ]
})

export class ApplicationModule { }
