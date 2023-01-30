import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { SupplierModel } from 'src/app/models/supplier.model';


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
export class SupplierService {

  constructor(private http: HttpClient) { }

  showAllSupplierPaginate(page: string, keywords: string) : Observable<Array<SupplierModel>> {
    return this.http.get<Array<SupplierModel>>(`${DEFAULT_URL}/api/suppliers?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllSupplier() : Observable<Array<SupplierModel>> {
    return this.http.get<Array<SupplierModel>>(`${DEFAULT_URL}/api/suppliers/dropdown`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  getSupplierById(id: number) : Observable<Array<SupplierModel>> {
    return this.http.get<Array<SupplierModel>>(`${DEFAULT_URL}/api/suppliers/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  addSupplier(data: SupplierModel) { 
    return this.http.post<SupplierModel>(`${DEFAULT_URL}/api/suppliers`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateSupplier(id: number, data: SupplierModel) {
    return this.http.put<SupplierModel>(`${DEFAULT_URL}/api/suppliers/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  
  deleteSupplier(id: number) {
    return this.http.delete<SupplierModel>(`${DEFAULT_URL}/api/suppliers/${id}`, httpOptions).pipe(shareReplay(1),
    catchError(this.httpError))
  }


  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
