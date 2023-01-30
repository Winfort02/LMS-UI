import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';

const DEFAULT_URL = environment.http_url;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': ['application/json'],
    Authorization: 'Bearer ' + localStorage.getItem('access-token')
  })
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }


  showAllUsers(page: string, keywords: string) : Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>(`${DEFAULT_URL}/api/users?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }


  showUserLogs(page: string, keywords: string, start_date: string, end_date: string, user_id: number) : Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>(`${DEFAULT_URL}/api/user-logs/by-user/${user_id}?${page}&keywords=${keywords}&start_date=${start_date}&end_date=${end_date}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }


  addUser(data: UserModel) { 
    return this.http.post<UserModel>(`${DEFAULT_URL}/api/users`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  getUserById(id: number) : Observable<Array<UserModel>> {
    return this.http.get<Array<UserModel>>(`${DEFAULT_URL}/api/users/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }


  updateUser(id: number, data: UserModel) {
    return this.http.put<UserModel>(`${DEFAULT_URL}/api/users/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  deleteuser(id: number) {
    return this.http.delete<UserModel>(`${DEFAULT_URL}/api/users/${id}`, httpOptions).pipe(shareReplay(1),
    catchError(this.httpError))
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
