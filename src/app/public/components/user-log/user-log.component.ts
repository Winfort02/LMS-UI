import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { LogModel } from 'src/app/models/log.model';
import { PaginationModel } from 'src/app/models/pagination.model';
import { UserModel } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/application/users/users.service';

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})
export class UserLogComponent implements OnInit, OnDestroy {

  @Input() user: UserModel = new UserModel();

  start_date: any = new Date();
  end_date: any = new Date();

  keywords: string = '';
  logs: Array<LogModel> = [];
  logs_subscription!: Subscription;
  lazyLoad!: LazyLoadEvent;
  loading: boolean = true;
   // Pagination #1 start here 
   pagination: PaginationModel = new PaginationModel();
   page_detail: string = "";
   default_page: string = "page=1";
   current_page: string = "page=1";
   totalRecords: number = 0;

   
  constructor(
    private messageService: MessageService,
    private userServie: UsersService,
    private datePipe: DatePipe,

  ) { }

  public firstPage() { this.getAllLogs(this.pagination.first); }
  public prevPage() { this.getAllLogs(this.pagination.prev); }
  public nextPage() { this.getAllLogs(this.pagination.next); }
  public lastPage() { this.getAllLogs(this.pagination.last); }

  ngOnInit(): void {
  }

  showLogLazyLoad(event : LazyLoadEvent) {
    this.lazyLoad = event;
    this.getAllLogs(this.pagination.first);
  }

  
  onSelectDate() {
    this.getAllLogs(this.pagination.first);
  }

  getAllLogs(page: string) {
    this.loading = true;
    this.start_date = this.datePipe.transform(this.start_date, 'Y-MM-dd');
    this.end_date = this.datePipe.transform(this.end_date, 'Y-MM-dd');
    this.logs_subscription = this.userServie.showUserLogs(page, this.keywords, this.start_date, this.end_date, this.user.id as number).subscribe({
      next: async (response: any) => {
        // Pagination #2 
        console.log(response)
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

        this.logs = this.pagination.data;
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


  ngOnDestroy(): void {
    if(this.logs_subscription != null) this.logs_subscription.unsubscribe();
  }

}
