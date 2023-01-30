import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginationModel } from 'src/app/models/pagination.model';
import { UserModel } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/application/users/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {


  keywords: string = '';
  users: Array<UserModel> = [];
  LazyLoading!: LazyLoadEvent;
  loading: boolean = true;
  user_subscription!: Subscription;


   // Pagination #1 start here 
   pagination: PaginationModel = new PaginationModel();
   page_detail: string = "";
   default_page: string = "page=1";
   current_page: string = "page=1";
   totalRecords: number = 0;

  constructor(
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  public firstPage() { this.getAllUsers(this.pagination.first); }
  public prevPage() { this.getAllUsers(this.pagination.prev); }
  public nextPage() { this.getAllUsers(this.pagination.next); }
  public lastPage() { this.getAllUsers(this.pagination.last); }

  ngOnInit(): void {
  }

  showUserLazyalod(event: LazyLoadEvent) {
    this.LazyLoading = event;
    this.getAllUsers(this.pagination.first);
  }

  getAllUsers(page: string) {
    this.loading = true;
    this.user_subscription = this.userService.showAllUsers(page, this.keywords).subscribe({
      next: async (response: any) => {

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

        this.users = this.pagination.data;
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


  search() {
    this.showUserLazyalod(this.LazyLoading);
  }

  addUser() {
    this.router.navigate(['/application/user-detail/'+ 0]);
  }

  updateUser(user: UserModel) {
    this.router.navigate(['/application/user-detail/'+ user.id]);
  }

  deleteUser(id: number) {
    this.confirmationService.confirm({
      header: 'Delete Confirmation',
      message: 'Are you sure you want to delete this record ?',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-trash',
      acceptLabel: 'Delete',
      acceptButtonStyleClass: 'p-button-danger p-button-text text-xs',
      rejectButtonStyleClass: 'p-button-primary p-button-text text-xs',
      rejectLabel: 'Cancel',
      accept: () => {
        this.userService.deleteuser(id).subscribe({
          next: async (response: any) => {
            this.messageService.add({
              severity: 'custom',
              detail: 'Student deleted successfully',
              life: 1500,
              styleClass: 'text-700 bg-teal-700 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });

            // Pagination #5
            let dataLength = this.users.length - 1;
            let current_page = dataLength == 0 ? this.pagination.prev : this.current_page;
            this.current_page = current_page;

            this.getAllUsers(this.current_page);
          },
          error: async (error) => {
            this.messageService.add({
              severity: 'custom',
              detail: '' + error.message,
              life: 1500,
              styleClass: 'text-700 bg-red-600 border-y-3 border-white',
              contentStyleClass: 'p-2 text-sm'
            });
            return
          }
        })
      }
    })
  }


  ngOnDestroy(): void {
    if(this.user_subscription !== null) this.user_subscription.unsubscribe();
  }

}
