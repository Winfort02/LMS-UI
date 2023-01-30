import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { StockInModel } from 'src/app/models/stockIn.model';

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
export class StockInService {

  constructor(private http: HttpClient) { }


  showAllStockInPaginate(page: string, keywords: string) : Observable<Array<StockInModel>> {
    return this.http.get<Array<StockInModel>>(`${DEFAULT_URL}/api/stock-in?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllStockInByProductPaginate(page: string, keywords: string, id: number) : Observable<Array<StockInModel>> {
    return this.http.get<Array<StockInModel>>(`${DEFAULT_URL}/api/stock-in/by-product/${id}?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }


  getStockInById(id: number) : Observable<Array<StockInModel>> {
    return this.http.get<Array<StockInModel>>(`${DEFAULT_URL}/api/stock-in/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  createStockIn(data: StockInModel) { 
    return this.http.post<StockInModel>(`${DEFAULT_URL}/api/stock-in`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateStockIn(id: number, data: StockInModel) {
    return this.http.put<StockInModel>(`${DEFAULT_URL}/api/stock-in/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }


  generateStockInReport(data: Object): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/stock-in/generate-report`, data, pdfOptions).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
