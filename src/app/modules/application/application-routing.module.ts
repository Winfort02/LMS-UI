import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { UsersComponent } from 'src/app/components/application/users/users.component';
import { DashboardComponent } from 'src/app/components/application/dashboard/dashboard.component';
import { UserDetailComponent } from 'src/app/components/application/user-detail/user-detail.component';
import { CategoryComponent } from 'src/app/components/application/category/category.component';
import { BrandComponent } from 'src/app/components/application/brand/brand.component';
import { CustomerComponent } from 'src/app/components/application/customer/customer.component';
import { SupplierComponent } from 'src/app/components/application/supplier/supplier.component';
import { ProductComponent } from 'src/app/components/application/product/product.component';
import { ProductDetailComponent } from 'src/app/components/application/product-detail/product-detail.component';
import { StockInComponent } from 'src/app/components/application/stock-in/stock-in.component';
import { StockInDetailComponent } from 'src/app/components/application/stock-in-detail/stock-in-detail.component';
import { StockReturnComponent } from 'src/app/components/application/stock-return/stock-return.component';
import { StockReturnDetailComponent } from 'src/app/components/application/stock-return-detail/stock-return-detail.component';
import { OrderComponent } from 'src/app/components/application/order/order.component';
import { OrderDetailComponent } from 'src/app/components/application/order-detail/order-detail.component';

import { AdminGuard } from 'src/app/guard/admin.guard';
import { CashierDashboardComponent } from 'src/app/components/application/cashier-dashboard/cashier-dashboard.component';
import { SalesReportComponent } from 'src/app/components/application/sales-report/sales-report.component';
import { ProductReportComponent } from 'src/app/components/application/product-report/product-report.component';
import { PaymentComponent } from 'src/app/components/application/payment/payment.component';
import { PaymentDetailComponent } from 'src/app/components/application/payment-detail/payment-detail.component';
import { CustomerPaymentSummaryReportComponent } from 'src/app/public/components/customer-payment-summary-report/customer-payment-summary-report.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'cashier', component: CashierDashboardComponent},
      {path: 'users', component: UsersComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'user-detail/:id', component: UserDetailComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']}  },
      {path: 'categories', component: CategoryComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'brands', component: BrandComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'customers', component: CustomerComponent},
      {path: 'suppliers', component: SupplierComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'products', component: ProductComponent},
      {path: 'product-detail/:id', component: ProductDetailComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'product/stock-in', component: StockInComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'product/stock-in-detail/:id', component: StockInDetailComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'product/stock-return', component: StockReturnComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'product/stock-return-detail/:id', component: StockReturnDetailComponent, canActivate: [AdminGuard], data: { user_type: ['Admin']} },
      {path: 'product/inventory', component: ProductReportComponent},
      {path: 'orders', component: OrderComponent},
      {path: 'order-detail/:id', component: OrderDetailComponent},
      {path: 'order/sales-report', component: SalesReportComponent },
      {path: 'payments', component: PaymentComponent},
      {path: 'payments/detail/:id', component: PaymentDetailComponent},
      {path: 'payments/reports', component: CustomerPaymentSummaryReportComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }