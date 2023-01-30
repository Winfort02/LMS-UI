import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { BrandModel } from 'src/app/models/brand.model';

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
export class BrandService {

  constructor(private http: HttpClient) { }

  showAllBrandPaginate(page: string, keywords: string) : Observable<Array<BrandModel>> {
    return this.http.get<Array<BrandModel>>(`${DEFAULT_URL}/api/brands?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllBrands() : Observable<Array<BrandModel>> {
    return this.http.get<Array<BrandModel>>(`${DEFAULT_URL}/api/brands/dropdown`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  addBrand(data: BrandModel) { 
    return this.http.post<BrandModel>(`${DEFAULT_URL}/api/brands`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateBrand(id: number, data: BrandModel) {
    return this.http.put<BrandModel>(`${DEFAULT_URL}/api/brands/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  deleteBrand(id: number) {
    return this.http.delete<BrandModel>(`${DEFAULT_URL}/api/brands/${id}`, httpOptions).pipe(shareReplay(1),
    catchError(this.httpError))
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
