import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  @Output() menuButtonClick: EventEmitter<any> = new EventEmitter();

  @ViewChild('topbarMenu') topbarMenu!: ElementRef;

  hide: boolean = true;


  user_email: any = localStorage.getItem('email');
  // dateToday: any = localStorage.getItem('dateToday');
  dateToday: any = new Date();
  user_type: any = localStorage.getItem('user_type');
  warehouse_id: any = localStorage.getItem('warehouse_id');
  warehouse: string = 'Warehouse';
  constructor(
    private router: Router
  ) {

    setInterval(() => {
      this.dateToday = new Date();
    }, 1000);
  }

  logout() {
    localStorage.clear();
    location.reload();
  }

  onMenuButtonClick(event: Event) {
    this.hide = !this.hide;
    this.menuButtonClick.emit();
    event.preventDefault();
  }
  ngOnInit() {
   
  }

}
