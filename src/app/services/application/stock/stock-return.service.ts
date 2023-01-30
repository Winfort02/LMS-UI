import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { StockReturnModel } from 'src/app/models/stock-return.model';

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
export class StockReturnService {

  constructor(private http: HttpClient) { }

  showAllStockReturnPaginate(page: string, keywords: string) : Observable<Array<StockReturnModel>> {
    return this.http.get<Array<StockReturnModel>>(`${DEFAULT_URL}/api/stock-return?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllStockReturnByProductPaginate(page: string, keywords: string, id: number) : Observable<Array<StockReturnModel>> {
    return this.http.get<Array<StockReturnModel>>(`${DEFAULT_URL}/api/stock-return/by-product/${id}?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  getStockReturnById(id: number) : Observable<Array<StockReturnModel>> {
    return this.http.get<Array<StockReturnModel>>(`${DEFAULT_URL}/api/stock-return/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  createStockReturn(data: StockReturnModel) { 
    return this.http.post<StockReturnModel>(`${DEFAULT_URL}/api/stock-return`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateStockReturn(id: number, data: StockReturnModel) {
    return this.http.put<StockReturnModel>(`${DEFAULT_URL}/api/stock-return/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  generateStockReturnReport(data: Object): Observable<any> {
    return this.http.post<any>(`${DEFAULT_URL}/api/stock-return/generate-report`, data, pdfOptions).pipe(catchError(this.httpError));
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
