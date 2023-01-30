import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ProductModel } from 'src/app/models/product.model';

const DEFAULT_URL = environment.http_url;

const uploadOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('access-token')
  })
}

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
export class ProductService {

  constructor(private http: HttpClient) { }

  showAllProductsPagination(page: string, keywords: string, category_id: number) : Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${DEFAULT_URL}/api/products?${page}&keywords=${keywords}&category_id=${category_id}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllProductsBySupplierPagination(page: string, keywords: string, id: number) : Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${DEFAULT_URL}/api/products/by-supplier/${id}?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllProducts() : Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${DEFAULT_URL}/api/products/dropdown`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  getProductById(id: number) : Observable<Array<ProductModel>> {
    return this.http.get<Array<ProductModel>>(`${DEFAULT_URL}/api/products/${id}`, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  createProduct(data: FormData) {
    return this.http.post<FormData>(`${DEFAULT_URL}/api/products`, data, uploadOptions).pipe(
      catchError(this.httpError)
    );
  }

  updateProduct(id:number, data: FormData) {
    return this.http.post<FormData>(`${DEFAULT_URL}/api/products/update/${id}`, data, uploadOptions).pipe(
      catchError(this.httpError)
    );
  }

  deleteProduct(id: number) {
    return this.http.delete<ProductModel>(`${DEFAULT_URL}/api/products/${id}`, httpOptions).pipe(shareReplay(1),
      catchError(this.httpError)
    );
  }

  generateProductInventory(status: string, supplier_id: number): Observable<any> {
    const data = {
      status: status,
      supplier_id: supplier_id
    }
    return this.http.post<any>(`${DEFAULT_URL}/api/products/inventory/report`, data, pdfOptions).pipe(catchError(this.httpError));
  }


  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
