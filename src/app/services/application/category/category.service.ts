import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, share, shareReplay, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { CategoryModel } from 'src/app/models/category.model';

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
export class CategoryService {

  constructor(private http: HttpClient) { }

  showAllCategoryPaginate(page: string, keywords: string) : Observable<Array<CategoryModel>> {
    return this.http.get<Array<CategoryModel>>(`${DEFAULT_URL}/api/categories?${page}&keywords=${keywords}`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  showAllCategories() : Observable<Array<CategoryModel>> {
    return this.http.get<Array<CategoryModel>>(`${DEFAULT_URL}/api/categories/dropdown`, httpOptions).pipe(shareReplay(1), catchError(this.httpError));
  }

  addCategory(data: CategoryModel) { 
    return this.http.post<CategoryModel>(`${DEFAULT_URL}/api/categories`, data, httpOptions).pipe(
      shareReplay(1),
      catchError(this.httpError)
    );
  }

  updateCategory(id: number, data: CategoryModel) {
    return this.http.put<CategoryModel>(`${DEFAULT_URL}/api/categories/${id}`, data, httpOptions).pipe(
      catchError(this.httpError)
    )
  }

  deleteCategory(id: number) {
    return this.http.delete<CategoryModel>(`${DEFAULT_URL}/api/categories/${id}`, httpOptions).pipe(shareReplay(1),
    catchError(this.httpError))
  }

  httpError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
