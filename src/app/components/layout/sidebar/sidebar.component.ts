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
    private messageService: MessageService
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
                  life: 1500,
                  styleClass: 'text-700 bg-red-600 border-y-3 border-white',
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
          icon:'pi pi-th-large',
          items: [
              {
                  label: 'Report',
                  icon:'pi pi-chart-pie',
                  routerLink: '/application/dashboard'
              },
          ]
        },
        {
          label: 'Master File',
          icon:'pi pi-desktop',
          items: [
              {
                  label: 'Users',
                  icon:'pi pi-users',
                  routerLink: '/application/users',
              },
              {
                label: 'Categories',
                icon:'pi pi-tags',
                routerLink: '/application/categories',
              },
              {
                label: 'Brands',
                icon:'pi pi-tag',
                routerLink: '/application/brands',
              },
              {
                label: 'Customers',
                icon:'pi pi-id-card',
                routerLink: '/application/customers',
              },
              {
                label: 'Suppliers',
                icon:'pi pi-sitemap',
                routerLink: '/application/suppliers',
              },
          ]
        },
        {
          label: 'Product Management',
          icon:'pi pi-briefcase',
          items: [
              {
                  label: 'Products',
                  icon:'pi pi-box',
                  routerLink: '/application/products',
              },
              {
                label: 'Stock In',
                icon:'pi pi-arrow-right',
                routerLink: '/application/product/stock-in',
              },
              {
                label: 'Stock Return',
                icon:'pi pi-arrow-left',
                routerLink: '/application/product/stock-return',
              },
              {
                label: 'Inventory',
                icon:'pi pi-file-pdf',
                routerLink: `/application/product/inventory`,
              }
          ]
        },
        {
          label: 'Sales',
          icon:'pi pi-folder-open',
          items: [
              {
                label: 'Sales',
                icon:'pi pi-chart-line',
                routerLink: '/application/orders',
              },
              {
                  label: 'Reports',
                  icon:'pi pi-print',
                  routerLink: '/application/order/sales-report',
              },
          ]
        },
        {
          label: 'Transaction',
          icon:'pi pi-dollar',
          items: [
              {
                  label: 'POS',
                  icon:'pi pi-window-maximize',
                  routerLink: '/application/order-detail/' + 0,
              },
          ]
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          items: [
            {
                label: 'End Session',
                icon: 'pi pi-power-off',
                command: (event) => {this.logout()}
            }
          ]
        }
      ];
    } else if ( this.current_user.user_type.toLocaleLowerCase() === 'user') {
      this.sideItems = [
        {
          label: 'Dashboard',
          icon:'pi pi-slack',
          items: [
              {
                  label: 'Dashboard',
                  icon:'pi pi-chart-pie',
                  routerLink: '/application/cashier'
              },
          ]
        },
        {
          label: 'Sales',
          icon:'pi pi-dollar',
          items: [
              {
                  label: 'Reports',
                  icon:'pi pi-print',
                  routerLink: '/application/order/sales-report',
                  command: () => { this.redirectTo('/application/order/sales-report')}
              },
          ]
        },
        {
          label: 'Transaction',
          icon:'pi pi-database',
          items: [
              {
                  label: 'POS',
                  icon:'pi pi-window-maximize',
                  routerLink: '/application/order-detail/' + 0,
                  command: () => { this.redirectTo('/application/order-detail/0')}
              },
          ]
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          items: [
            {
                label: 'End Session',
                icon: 'pi pi-power-off',
                command: (event) => {this.logout()}
            }
          ]
        }
      ];
    } else {
      this.sideItems = [];
    }
  }

  ngOnInit(): void {
    this.loadModules();
    // this.sideItems = [
    //   {
    //     label: 'Dashboard',
    //     icon:'berben-icon-dashboard',
    //     expanded: this.checkActiveState('/dashboard'),
    //     items: [
    //         {
    //             label: 'Storage Dashboard',
    //             icon:'fa-solid fa-chart-pie',
    //             routerLink: '/dashboard/storage'
    //         },
    //         {
    //             label: 'Dispatching Dashboard',
    //             icon:'fa-solid fa-dolly',
    //             routerLink: '/dashboard/receiving-dispaching' 
    //         },
    //         {
    //             label: 'Dispatching Location',
    //             icon:'fa-solid fa-boxes-packing',
    //             routerLink: '/dashboard/dispatch-location'
    //         },
    //         {
    //           label: 'Yard Management Dashboard',
    //           icon:'fa-solid fa-warehouse',
    //           routerLink: '/dashboard/yard-management'
    //         },
    //         {
    //             label: 'Branch Management Dashboard',
    //             icon:'fa-solid fa-balance-scale',
    //             routerLink: '/dashboard/branch-management'
    //         },
    //         {
    //           label: 'Warehouse Business Insights',
    //           icon:'fa-solid fa-chart-area',
    //           routerLink: '/dashboard/warehouse-business-insight'
    //         }
    //     ]
    //   },
    //   {
    //   label: 'Sales and Marketing',
    //   icon:'berben-icon-sales',
    //   expanded: this.checkActiveState('/sales/'),
    //   items: [
    //       {
    //           label: 'Customers',
    //           icon:'fa-solid fa-user-tie',
    //           routerLink: '/sales/customers'
    //       },
    //       {
    //           label: 'Services',
    //           icon:'fa-solid fa-briefcase',
    //           routerLink: '/sales/services'
    //       },
    //       {
    //           label: 'Reports',
    //           icon:'fa-solid fa-chalkboard-teacher',
    //           routerLink: '/sales/reports'
    //       }
    //     ]
    //   },
    //   {
    //   label: 'Yard Management',
    //   icon:'berben-icon-yard',
    //   expanded: this.checkActiveState('/yards'),
    //   items: [
    //       {
    //           label: 'Loading Docks',
    //           icon:'fa-solid fa-luggage-cart',
    //           routerLink: '/yards/loading-docks'

    //       },
    //       {
    //           label: 'Plugin Stations',
    //           icon:'fa-solid fa-door-open',
    //           routerLink: '/yards/plugin-stations'
    //       },
    //       {
    //         label: 'Truck Arrival Request (TR)',
    //         icon:'fa-solid fa-truck-medical',
    //         routerLink: '/yards/truck-arrival-request'
    //       },
    //       {
    //         label: 'Truck Arrival (TA)',
    //         icon:'fa-solid fa-truck',
    //         routerLink: '/yards/truck-arrival'
    //       },
    //       {
    //         label: 'Reports',
    //         icon:'fa-solid fa-chalkboard-teacher',
    //         routerLink: '/yards/reports'
    //       },
    //   ]
    //   },
    //   {
    //   label: 'Receiving',
    //   icon:'berben-icon-receiving',
    //   expanded: this.checkActiveState('/receiving/'),
    //   items: [
    //       {
    //           label: 'Customer Material',
    //           icon:'fa-solid fa-users-cog',
    //           routerLink: '/receiving/customer-material'
    //       },
    //       {
    //           label: 'Storage Rooms',
    //           icon:'fa-solid fa-boxes',
    //           routerLink: '/receiving/storage-rooms'
    //       },
    //       {
    //         label: 'Warehouse Receiving (WR)',
    //         icon:'fa-solid fa-truck-loading',
    //         routerLink: '/receiving/warehouse-receivings'
    //       },
    //       {
    //         label: 'Put Away (PA)',
    //         icon:'fa-solid fa-trailer',
    //         routerLink: '/receiving/put-aways'
    //       },
    //       {
    //         label: 'Reports',
    //         icon:'fa-solid fa-chalkboard-teacher',
    //         routerLink: '/receiving/reports'
    //       }
    //     ]
    //   },
    //   {
    //   label: 'Storage',
    //   icon:'berben-icon-storage',
    //   expanded: this.checkActiveState('/storage/'),
    //   items: [
    //       {
    //           label: 'Bin To Bin',
    //           icon:'fa-solid fa-exchange-alt',
    //           routerLink: '/storage/bin-to-bin'
    //       },
    //       {
    //           label: 'Partial Bin',
    //           icon:'fa-solid fa-cube',
    //           routerLink: '/storage/partial-bin'
    //       },
    //       {
    //         label: 'Physical Count',
    //         icon:'fa-solid fa-clipboard-list',
    //         routerLink: '/storage/physical-count' 
    //       },
    //       {
    //         label: 'Reports',
    //         icon:'fa-solid fa-chalkboard-teacher',
    //         routerLink: '/storage/reports'
    //       }
    //     ]
    //   },
    //   {
    //   label: 'Dispatching',
    //   icon:'berben-icon-dispatching',
    //   expanded: this.checkActiveState('/dispatching/'),
    //   items: [
    //       {
    //           label: 'Transfer Request',
    //           icon:'fa-solid fa-expand-alt',
    //           routerLink: '/dispatching/transfer-requests'
    //       },
    //       {
    //           label: 'Dispatch Request',
    //           icon:'fa-solid fa-dolly',
    //           routerLink: '/dispatching/dispatch-requests'
    //       },
    //       {
    //         label: 'Pick List',
    //         icon:'fa-solid fa-th-list',
    //         routerLink: '/dispatching/pick-lists'
    //       },
    //       {
    //         label: 'Dispatch Order',
    //         icon:'fa-solid fa-dolly-flatbed',
    //         routerLink: '/dispatching/dispatch-orders'
    //       },
    //       {
    //         label: 'Reports',
    //         icon:'fa-solid fa-chalkboard-teacher',
    //         routerLink: '/dispatching/reports'
    //       }
    //     ]
    //   },
    //   {
    //   label: 'Administration',
    //   icon:'berben-icon-admin',
    //   expanded: this.checkActiveState('/admin/'),
    //   items: [
    //       {
    //           label: 'Modules',
    //           icon:'fa-solid fa-diagram-project',
    //           routerLink: '/admin/modules'
    //       },
    //       {
    //           label: 'Users',
    //           icon:'fa-solid fa-users',
    //           routerLink: '/admin/users'
    //       },
    //       {
    //         label:' Companies',
    //         icon:'fa-solid fa-building',
    //         routerLink: '/admin/companies'
    //       },
    //       {
    //         label: 'Branches',
    //         icon:'fa-solid fa-code-branch',
    //         routerLink: '/admin/branches'
    //       },
    //       {
    //         label: 'Storages',
    //         icon:'fa-solid fa-boxes',
    //         routerLink: '/admin/storages'
    //       },
    //       {
    //         label: 'Materials',
    //         icon:'fa-solid fa-toolbox',
    //         routerLink: '/admin/materials'
    //       },
    //       {
    //         label: 'Selections',
    //         icon:'fa-regular fa-object-ungroup',
    //         routerLink: '/admin/selections'
    //       }
    //     ]
    //   },
    //   {
    //     label: 'End Session',
    //     icon:'fa-solid fa-power-off',
    //     routerLink: '/admin/modules',
    //     command: (event) => {this.logout()}
    //     }
    // ]
  }

}
