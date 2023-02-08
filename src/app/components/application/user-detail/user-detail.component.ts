import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { validations } from 'src/app/public/validations';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/application/users/users.service';
import { Subscription } from 'rxjs';
import { OrderModel } from 'src/app/models/order.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/application/order/order.service';
import { PaginationModel } from 'src/app/models/pagination.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SalesOrderPdfComponent } from 'src/app/public/components/sales-order-pdf/sales-order-pdf.component';
import { UpdateOrderDetailComponent } from '../update-order-detail/update-order-detail.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  user: UserModel = new UserModel();
  keywords: string = '';
  userForm: any = FormGroup
  lazyLoad!: LazyLoadEvent;
  isComponentShown: boolean = false;
  user_detail_subscription!: Subscription;
  order_subscription!: Subscription;
  sales_orders: Array<OrderModel> = [];
  loading: boolean = true;
  current_user: UserModel = new UserModel();

   // Pagination #1 start here 
   pagination: PaginationModel = new PaginationModel();
   page_detail: string = "";
   default_page: string = "page=1";
   current_page: string = "page=1";
   totalRecords: number = 0;

  user_types: Array<{label: string, value: string}> = [
    { label: 'Admin', value: 'Admin'},
    { label: 'User', value: 'User'}
  ];

  start_date: any = new Date();
  end_date: any = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private messageService: MessageService,
    private userService: UsersService,
    private orderService: OrderService,
    private authServie: AuthService,
    private dialogService: DialogService,
    private dialogRef: DynamicDialogRef,
    private datePipe: DatePipe
  ) {
    this.current_user = this.authServie.currentUser;
   }


   public firstPage() { this.getAllSalesOrder(this.pagination.first); }
   public prevPage() { this.getAllSalesOrder(this.pagination.prev); }
   public nextPage() { this.getAllSalesOrder(this.pagination.next); }
   public lastPage() { this.getAllSalesOrder(this.pagination.last); }

  ngOnInit(): void {
    this.loadUserDetail();
  }

  loadUserDetail() {
    this.userForm = this.formBuilder.group({
      id: [this.user.id],
      name: [this.user.name, [Validators.required]],
      username: [this.user.username, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.pattern(validations.emailValidation)]],
      password: [this.user.password, [Validators.required]],
      password_confirmation: [this.user.password_confirmation, [Validators.required]],
      user_type: [this.user.user_type, [Validators.required]],
      is_active: [this.user.is_active, [Validators.required]],
    });

    if(this.activatedRoute.snapshot.params.id > 0) {
      const user_id = this.activatedRoute.snapshot.params.id;
      this.user_detail_subscription = this.userService.getUserById(user_id).subscribe({
        next: async(response: any) => {
          const user = response.data;
          if(user !== null) {
            this.user = user;
            this.user.is_active = user.is_active === 1 ? true : false;
            this.userForm.setValue({
              id: this.user.id,
              name: this.user.name,
              username: this.user.username,
              email: this.user.email,
              password: this.user.password ?? null,
              password_confirmation: this.user.password ?? null,
              user_type: this.user.user_type,
              is_active: this.user.is_active,
            });
            this.userForm.controls.password.disable();
            this.userForm.controls.password_confirmation.disable();
          }
          
          this.isComponentShown = true;
        },
        error: async (error) => {
          this.messageService.add({
            severity: 'custom',
            detail: '' + error.error.message,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.isComponentShown = true;
          return
        }
      })
    } else {
      this.isComponentShown = true;
    }
  }

  save() {
    if(this.userForm.valid) {
      this.user = this.userForm.value;
      if(this.activatedRoute.snapshot.params.id == 0) {
        this.userService.addUser(this.user).subscribe({
          next: async (response: any) => {
            this.user = response.data;
            this.messageService.add({
              severity: 'custom',
              detail: 'New user added successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.location.go(
              '/application/users/' + this.user.id
            );
          },
          error: (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        })
      } else {
        const user_id = this.activatedRoute.snapshot.params.id;
        this.userService.updateUser(user_id, this.user).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'User updated successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            this.loadUserDetail();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        })
      }
    }
  }

  onSelectDate() {
    this.getAllSalesOrder(this.pagination.first);
  }

  showAllSalesOrder(event: LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllSalesOrder(this.pagination.first);
  }

  getAllSalesOrder(page: string) {
    const user_id  = this.activatedRoute.snapshot.params.id;
    this.loading = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');
    this.order_subscription = this.orderService.showOrderByUserPaginate(page, this.keywords, this.start_date, this.end_date, user_id).subscribe({
      next: async (response: any) => {
        // Pagination #2 
        this.pagination = response;
        this.pagination.meta = response.meta;
        this.pagination.first = response['links']['first'] != null ? response['links']['first'].split('?')[1] : null;
        this.pagination.prev = response['links']['prev'] != null ? response['links']['prev'].split('?')[1] : null;
        this.pagination.next = response['links']['next'] != null ? response['links']['next'].split('?')[1] : null;
        this.pagination.last = response['links']['last'] != null ? response['links']['last'].split('?')[1] : null;
        this.pagination.current_page = 'page=' + this.pagination.meta.current_page;
        this.page_detail = this.pagination.meta.current_page + ' / ' + this.pagination.meta.last_page;
        this.current_page = this.pagination.current_page;
        this.totalRecords = this.pagination.meta.total;
        // Pagination #2 

        this.sales_orders = this.pagination.data;
        this.loading = false;
      },
      error: async (error) => {
        this.messageService.add({
          severity: 'custom',
          detail: '' + error.error.message,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.loading = false;
      }
    });
  }

  viewReceipt(order: OrderModel) {
    this.orderService.generateSalesReport(order.id as number).subscribe(response => {
      const data = response;
      this.dialogRef = this.dialogService.open(
        SalesOrderPdfComponent,
        {
          header: 'SALES ORDER RECEIPT',
          width: '1200px',
          footer: ' ',
          contentStyle: {
            'max-height': '650px',
            'min-width': '475px',
            'overflow-y': 'auto',
          },
          baseZIndex: 10000,
          data: { data: data },
        }
      );
      this.dialogRef.onClose.subscribe((data) => {
        return;
      });
    })
  }

  updateSalesOrder(order: OrderModel) {
    this.dialogRef = this.dialogService.open(UpdateOrderDetailComponent, {
      header: 'SALES ORDER DETAILS',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "max-width" : "480px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: order,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '75px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {
      if(response.success) {
        if(response.code === 201) {
          this.messageService.add({
            severity: 'custom',
            detail: 'Order updated Successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
          this.getAllSalesOrder(this.current_page);
        }
      } else {
        this.messageService.add({
          severity: 'custom',
          detail: '' + response.data,
          life: 1500,
          styleClass: 'text-700 bg-red-600 border-y-3 border-white',
          contentStyleClass: 'p-2 text-sm'
        });
        this.getAllSalesOrder(this.current_page);
      }
        
    })
  }

  search() {
    this.getAllSalesOrder(this.pagination.first);
  }

  close() {
    this.router.navigate(['/application/users']);
  }

  resetPassword() {
    this.dialogRef = this.dialogService.open(ResetPasswordComponent, {
      header: 'RESET PASSWORD',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
      data: this.user.id as number,
      style: { 
        'align-self': 'flex-start', 
        'margin-top': '50px' 
      }
    });

    this.dialogRef.onClose.subscribe((response: any) => {

      if(response) {
        if(response.success) {
          this.messageService.add({
            severity: 'custom',
            detail: 'Password change successfully',
            life: 1500,
            styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
        } else {
          this.messageService.add({
            severity: 'custom',
            detail: '' + response.data.error.message,
            life: 1500,
            styleClass: 'text-700 bg-red-600 border-y-3 border-white',
            contentStyleClass: 'p-2 text-sm'
          });
        }
      } else {
        return;
      }
    })
  }

  ngOnDestroy(): void {
    if(this.user_detail_subscription != null) this.user_detail_subscription.unsubscribe();
  }

}
