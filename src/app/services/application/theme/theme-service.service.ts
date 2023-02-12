import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeServiceService {

  private theme = new BehaviorSubject<any>(this.getTheme());
  public themeObservable!: Observable<any>;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { 
    this.themeObservable = this.theme.asObservable();
  }

  public get currentUser(): any {
    let current_them = this.theme.value == 'dark' ? true : false;
    return current_them;
  }

  private getTheme(): Boolean {
    const user = localStorage.getItem('theme') as string;
    let theme = user == 'true' ? true : false;
    return theme;
  }

  switchTheme(theme: string = 'dark') {
    let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink) {
      themeLink.href = theme + '.css';
  
      this.theme.next(theme);
    }
  }
}
