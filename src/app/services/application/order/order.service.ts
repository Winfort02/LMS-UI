import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { OrderModel } from 'src/app/models/order.model';

const DEFAULT_URL = environment.http_url;

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': ['application/json'],
    Authorization: 'Bearer ' + localStorage.getItem('access-token')
  })
}

const pdfOptions: any = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + localStorage.getItem('access-token')
  }),
  responseType: 'blob',
};

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }


  showAllSalesOrderPaginate(page: string, keywords: string, customer_id: number, start_date: string, end_date: string) : Observable<Array<OrderModel>> {
    return this.http.get<Array<OrderModel>>(`${DEFAULT_URL}/api/orders?${page}&keywords=${keywords}&customer_id=${customer_id}&start_date=${start_date}&end_date=${end_date}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showOrderByUserPaginate(page: string, keywords: string, start_date: string, end_date: string, id: number) : Observable<Array<OrderModel>> {
    return this.http.get<Array<OrderModel>>(`${DEFAULT_URL}/api/orders/by-user/${id}?${page}&keywords=${keywords}&start_date=${start_date}&end_date=${end_date}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }


  showOrderByCustomerPaginate(page: string, keywords: string, id: number) : Observable<Array<OrderModel>> {
    return this.http.get<Array<OrderModel>>(`${DEFAULT_URL}/api/orders/by-customer/${id}?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  createSalesOrder(data: OrderModel) { 
    return this.http.post<OrderModel>(`${DEFAULT_URL}/api/orders`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateSalesOrder(data: OrderModel, id: number) {
    return this.http.put<OrderModel>(`${DEFAULT_URL}/api/orders/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  generateSalesReport(id: number): Observable<any> {
    return this.http.get<any>(`${DEFAULT_URL}/api/orders/generate-pdf/${id}`, pdfOptions).pipe(catchError(this.httpError));
  }

  generateSalesOrder(data: Object): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/orders/generate/sales-report`, data, pdfOptions).pipe(catchError(this.httpError));
  }

  generateSalesOrderItemSummaryReport(data: Object): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/orders/order-item-summary-report`, data, pdfOptions).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
