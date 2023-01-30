import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CustomerModel } from 'src/app/models/customer.model';

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
export class CustomerService {

  constructor(private http: HttpClient) { }

  showAllCustomerPaginate(page: string, keywords: string) : Observable<Array<CustomerModel>> {
    return this.http.get<Array<CustomerModel>>(`${DEFAULT_URL}/api/customers?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllCustomer() : Observable<Array<CustomerModel>> {
    return this.http.get<Array<CustomerModel>>(`${DEFAULT_URL}/api/customers/dropdown`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  getCustomerById(id: number) : Observable<Array<CustomerModel>> {
    return this.http.get<Array<CustomerModel>>(`${DEFAULT_URL}/api/customers/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  addCustomer(data: CustomerModel) { 
    return this.http.post<CustomerModel>(`${DEFAULT_URL}/api/customers`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateCustomer(id: number, data: CustomerModel) {
    return this.http.put<CustomerModel>(`${DEFAULT_URL}/api/customers/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  deleteCustomer(id: number) {
    return this.http.delete<CustomerModel>(`${DEFAULT_URL}/api/customers/${id}`, httpOptions).pipe(shareReplay(1),
    catchError(this.httpError))
  }


  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
