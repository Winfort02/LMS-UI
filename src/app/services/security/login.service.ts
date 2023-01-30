import { Injectable } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { loginModel } from 'src/app/models/login.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const DEFAULT_URL = environment.http_url; // http://127.0.0.1:8000

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }


  login(user: loginModel) {
    return this.http.post<loginModel>(`${DEFAULT_URL}/api/login`, user).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}