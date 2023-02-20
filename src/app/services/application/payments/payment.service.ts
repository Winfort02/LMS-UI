import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { PaymentModel } from 'src/app/models/payment.model';

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
export class PaymentService {

  constructor(
    private http: HttpClient
  ) { }


  showAllPaymentPaginate(page: string, keywords: string, customer_id: number, start_date: string, end_date: string) : Observable<Array<PaymentModel>> {
    return this.http.get<Array<PaymentModel>>(`${DEFAULT_URL}/api/payments?${page}&keywords=${keywords}&customer_id=${customer_id}&start_date=${start_date}&end_date=${end_date}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  createPayment(data: PaymentModel) { 
    return this.http.post<PaymentModel>(`${DEFAULT_URL}/api/payments`, data, httpOptions).pipe(
      catchError(this.httpError)
    );
  }

  getPaymentByID(id: number) : Observable<Array<PaymentModel>> {
    return this.http.get<Array<PaymentModel>>(`${DEFAULT_URL}/api/payments/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }


  updatePayment(data: PaymentModel, id: number) {
    return this.http.put<PaymentModel>(`${DEFAULT_URL}/api/payments/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  generatePaymentReport(data: any): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/payments/generate-report`, data, pdfOptions).pipe(catchError(this.httpError));
  }


  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }


}
