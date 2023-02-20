import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { PaymentHistoryModel } from 'src/app/models/payment-history.model';

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
export class PaymentHistoryService {

  constructor(
    private http: HttpClient
  ) { }


  showPaymentsHistoryByPayment(payment_id: number) : Observable<Array<PaymentHistoryModel>> {
    return this.http.get<Array<PaymentHistoryModel>>(`${DEFAULT_URL}/api/payment/history/${payment_id}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }


  generateCustomerPaymentReport(data: any): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/payment/generate-report/by/customer`, data, pdfOptions).pipe(catchError(this.httpError));
  }


  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
