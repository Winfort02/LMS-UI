import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { loginModel } from 'src/app/models/login.model';

const DEFAULT_URL = environment.http_url;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': ['application/json'],
  })
}

const authorization = {
  headers: new HttpHeaders({
    'Content-Type': ['application/json'],
    Authorization: 'Bearer ' + localStorage.getItem('access-token')
  })
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private userSubject = new BehaviorSubject<UserModel>(this.getUserFromLocalStorage());
  public userObservable!: Observable<UserModel>;


  constructor(
    private httpClient: HttpClient
  ) { this.userObservable = this.userSubject.asObservable(); }

  
  public get currentUser(): UserModel {
    return this.userSubject.value;
  }

  private setUserToLocalStorage(user: UserModel) {
    localStorage.setItem('current_user', JSON.stringify(user))
  }

  private getUserFromLocalStorage(): UserModel {
    const user = localStorage.getItem('current_user');
    if(user) return JSON.parse(user) as UserModel;

    return new UserModel()
  }

  isLogin(): boolean {
    return !!localStorage.getItem('access-token');
  }

  login(data: loginModel) {
    return this.httpClient.post<loginModel>(`${DEFAULT_URL}/api/login`, data, httpOptions).pipe(
      tap({
        next: async (response: any) => {
          const user = response.data;
          localStorage.setItem('access-token', response.token);
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
        }
      }),
      catchError(this.httpError)
    );
  }

  checkAPiToken(): Observable<Boolean> {
    return this.httpClient.get<any>(DEFAULT_URL + '/api/check-token', authorization).pipe(catchError(this.httpError));
  }


  logout(user: UserModel) {
    return this.httpClient.post<any>(DEFAULT_URL + '/api/logout', user, authorization).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }

}