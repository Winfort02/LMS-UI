import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserModel } from 'src/app/models/user.model';
import { async } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../../application/change-password/change-password.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  animations: [
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
          opacity: 0,
        })
      ),
      state(
        'visible',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
    ]),
  ],
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {


  @Input() active!: boolean;
  position: string = '';

  activeSubmenus: { [key: string]: boolean } = {};

  sideItems: MenuItem[] = [];

  adminSidNavItems: any[] = [
    { name: 'Sales/ Marketing', link: '/application/sales', authorized: false },
    { name: 'Yard Management', link: '/application/yards', authorized: false },
    {
      name: 'Receiving Management',
      link: '/application/receiving',
      authorized: false,
  
    },
    {
      name: 'Storage Management',
      link: '/application/storage',
      authorized: false,
    },
    {
      name: 'Dispatching Management',
      link: '/application/dispatching',
      authorized: false,
    },
  ];

  adminSubItems: any[] = [];

  salesAndMarketingSubItems: any[] = [];

  yardsManagementSubItems: any[] = [];

  receivingSubItems: any[] = [];
  storageSubItems: any[] = [];

  userSideNavItems: any[] = [
    // {name: 'Profile', link: '/applicant/applicant-information'},
  ];

  userSideNavSubItems: any[] = [{ name: '', link: '' }];

  sideNavItems: any[] = this.userSideNavItems;
  sideNavSubItems: any[] = this.userSideNavSubItems;
  warehouse_id: any = localStorage.getItem('warehouse_id');
  warehouse: string = 'Warehouse';

  scrollable = true;

  user_type: any = localStorage.getItem('user_type');
  current_user: UserModel = new UserModel();

  isComponentShown: boolean = false;

  constructor(
    private el: ElementRef,
    private router: Router,
    private confirmService: ConfirmationService,
    private authService: AuthService,
    private messageService: MessageService,
    private dialogRef: DynamicDialogRef,
    private dialogService: DialogService
  ) { 
    this.current_user = this.authService.currentUser;
  }


  toggleSubmenu(event: Event, name: string) {
    this.activeSubmenus[name] = this.activeSubmenus[name] ? false : true;
    event.preventDefault();
  }

  isSubmenuActive(name: string) {
    if (this.activeSubmenus.hasOwnProperty(name)) {
      return this.activeSubmenus[name];
    } else if (this.router.isActive(name, false)) {
      this.activeSubmenus[name] = true;
      return true;
    }

    return false;
  }

  checkActiveState(givenLink: any) {
    if (this.router.url.indexOf(givenLink) === -1) {
      return false;
    } else {
      return true;
    }
  }

  logout() {
    this.confirmService.confirm({
      header: 'End Session',
      message: 'Are you sure you want to end your session ?',
      acceptIcon: 'pi pi-power-off',
      acceptLabel: 'End Session',
      acceptButtonStyleClass: 'p-button-danger p-button-text text-xs',
      rejectButtonStyleClass: 'p-button-warining p-button-text text-xs',
      rejectLabel: 'Cancel',
      accept: () => {
        setTimeout(() => {
            this.authService.logout(this.authService.currentUser).subscribe({
              next: async (response: any) => {
                localStorage.clear();
                location.replace('/security/login');
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'custom',
                  detail: '' + error.error.message,
                  life: 2000,
                  closable: false,
                  icon: 'pi-exclamation-circle text-lg mt-2 text-white',
                  styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
                  contentStyleClass: 'p-2 text-sm'
                });
              }
            })
            
        }, 1000);
      }
    })
    
  }

  redirectTo(route: string) {
    this.router.navigate([route], { queryParams: { returnUrl: `${this.router.url}`}});
  }

  loadModules() {
    if(this.current_user.user_type.toLocaleLowerCase() === 'admin') {
      this.sideItems = [
        {
          label: 'Dashboard',
          icon:'lms-dashboard-icon',
          items: [
              {
                  label: 'Report',
                  icon:'lms-dashboard-report-icon',
                  routerLink: '/application/dashboard'
              },
          ]
        },
        {
          label: 'Master File',
          icon:'lms-master-file-icon',
          items: [
              {
                  label: 'Users',
                  icon:'lms-users-icon',
                  routerLink: '/application/users',
              },
              {
                label: 'Categories',
                icon:'lms-category-icon',
                routerLink: '/application/categories',
              },
              {
                label: 'Brands',
                icon:'lms-brands-icon',
                routerLink: '/application/brands',
              },
              {
                label: 'Customers',
                icon:'lms-customer-icon',
                routerLink: '/application/customers',
              },
              {
                label: 'Suppliers',
                icon:'lms-supplier-icon',
                routerLink: '/application/suppliers',
              },
          ]
        },
        {
          label: 'Product Management',
          icon:'lms-product-icon',
          items: [
              {
                  label: 'Products',
                  icon:'lms-sales-order-icon',
                  routerLink: '/application/products',
              },
              {
                label: 'Stock In',
                icon:'lms-stock-in-icon',
                routerLink: '/application/product/stock-in',
              },
              {
                label: 'Stock Return',
                icon:'lms-stock-out-icon',
                routerLink: '/application/product/stock-return',
              },
              {
                label: 'Inventory',
                icon:'lms-product-report-icon',
                routerLink: `/application/product/inventory`,
              }
          ]
        },
        {
          label: 'Sales',
          icon:'lms-sales-icon',
          items: [
              {
                label: 'Sales Order',
                icon:'lms-sales-order-icon',
                routerLink: '/application/orders',
              },
              {
                  label: 'Reports',
                  icon:'lms-sales-report-icon',
                  routerLink: '/application/order/sales-report',
              },
          ]
        },
        {
          label: 'Transaction',
          icon:'lms-transaction-icon',
          items: [
              {
                  label: 'POS',
                  icon:'lms-pos-icon',
                  routerLink: '/application/order-detail/' + 0,
              },
          ]
        },
        {
          label: 'Settings',
          icon: 'lms-settings-icon',
          items: [
            {
              label: 'Change Password',
              icon: 'lms-change-password-icon',
              command: (event) => {this.changePassword()}
            },
            {
                label: 'End Session',
                icon: 'lms-end-session-icon',
                command: (event) => {this.logout()}
            }
          ]
        }
      ];
    } else if ( this.current_user.user_type.toLocaleLowerCase() === 'user') {
      this.sideItems = [
        {
          label: 'Dashboard',
          icon:'lms-dashboard-icon',
          items: [
              {
                  label: 'Dashboard',
                  icon:'lms-dashboard-report-icon',
                  routerLink: '/application/cashier'
              },
          ]
        },
        {
          label: 'Sales',
          icon:'lms-sales-icon',
          items: [
              {
                  label: 'Reports',
                  icon:'lms-sales-report-icon',
                  routerLink: '/application/order/sales-report',
                  command: () => { this.redirectTo('/application/order/sales-report')}
              },
          ]
        },
        {
          label: 'Transaction',
          icon:'lms-transaction-icon',
          items: [
              {
                  label: 'POS',
                  icon:'lms-pos-icon',
                  routerLink: '/application/order-detail/' + 0,
                  command: () => { this.redirectTo('/application/order-detail/0')}
              },
          ]
        },
        {
          label: 'Settings',
          icon: 'lms-settings-icon',
          items: [
            {
              label: 'Change Password',
              icon: 'lms-change-password-icon',
              command: (event) => {this.changePassword()}
            },
            {
                label: 'End Session',
                icon: 'lms-end-session-icon',
                command: (event) => {this.logout()}
            }
          ]
        }
      ];
    } else {
      this.sideItems = [];
    }
  }

  changePassword() {
    this.dialogRef = this.dialogService.open(ChangePasswordComponent, {
      header: 'CHANGE PASSWORD',
      styleClass: 'text-sm text-primary',
      width: '480px',
      contentStyle: { "max-height": "600px", "overflow": "auto", "border-bottom-left-radius": "6px", "border-bottom-right-radius": "6px" },
      baseZIndex: 10000,
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
            life: 2000,
            closable: false,
            icon: 'pi pi-check-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-teal-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });

            setTimeout(() => {
              this.authService.logout(this.authService.currentUser).subscribe({
                next: async (response: any) => {
                  localStorage.clear();
                  location.replace('/security/login');
                },
                error: (error) => {
                  this.messageService.add({
                    severity: 'custom',
                    detail: '' + error.error.message,
                    life: 2000,
                    closable: false,
                    icon: 'pi-exclamation-circle text-lg mt-2 text-white',
                    styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
                    contentStyleClass: 'p-2 text-sm'
                  });
                }
              })
              
          }, 1000);
        } else {
          this.messageService.add({
            severity: 'custom',
            detail: '' + response.data.error.message,
            life: 2000,
            closable: false,
            icon: 'pi-exclamation-circle text-lg mt-2 text-white',
            styleClass: 'text-700 bg-red-700 text-white flex justify-content-start align-items-center pb-2 w-full',
            contentStyleClass: 'p-2 text-sm'
          });
        }
      } else {
        return;
      }
    })
  }

  ngOnInit(): void {
    this.loadModules();
  }

}
