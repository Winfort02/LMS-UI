import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-product-report',
  templateUrl: './product-report.component.html',
  styleUrls: ['./product-report.component.scss']
})
export class ProductReportComponent implements OnInit {

  current_user: UserModel = new UserModel();

  constructor(
    private authService: AuthService
  ) {
    this.current_user = this.authService.currentUser;
   }

  ngOnInit(): void {
  }

}
