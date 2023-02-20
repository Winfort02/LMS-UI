import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { OrderModel } from 'src/app/models/order.model';
import { ProductModel } from 'src/app/models/product.model';

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
export class DashboardService {

  constructor(private http: HttpClient) { }

  
  countAll(start_date: any) : Observable<any> {
    return this.http.get<any>(`${DEFAULT_URL}/api/dashboard/count?&start_date=${start_date}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  generateearlySales(year: string) : Observable<any> {
    return this.http.get<any>(`${DEFAULT_URL}/api/dashboard/generate-yearly-sales/${year}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  generateProductStatus(id: number) : Observable<any> {
    return this.http.get<any>(`${DEFAULT_URL}/api/dashboard/product-status/${id}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showLatesTransaction() : Observable<Array<OrderModel>> {
    return this.http.get<Array<OrderModel>>(`${DEFAULT_URL}/api/dashboard/latest-transaction`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showProductLowQuantity() : Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${DEFAULT_URL}/api/dashboard/product-low-quantity`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
