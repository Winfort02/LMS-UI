import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  menuActive!: boolean;
  home!: MenuItem;
  items: MenuItem[] = [];

  constructor(
      private router: Router
  ) {
    
  }

  onMenuButtonClick() {
      this.menuActive = true;
      this.addClass(document.body, 'blocked-scroll');
  }

  onMaskClick() {
      this.hideMenu();
  }

  hideMenu() {
      this.menuActive = false;
      this.removeClass(document.body, 'blocked-scroll');
  }

  addClass(element: any, className: string) {
      if (element.classList)
          element.classList.add(className);
      else
          element.className += ' ' + className;
  }

  removeClass(element: any, className: string) {
      if (element.classList)
          element.classList.remove(className);
      else
          element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  getAllItemsBreaCrumb() {
      this.home = { icon: '', routerLink: '/' }
      this.items = []
      let str = this.router.url.split('/')
      str.shift();
      if (str.length > 0) {
          for (let i = 0; i < str.length; i++) {
              if (str[i].search('-') < 0) {
                  str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
              } else {
                  if (str[i].split('-').join(' ').split(' ').length > 0) {
                      let words = str[i].split('-').join(' ').split(' ')
                      str[i] = '';
                      for (let x = 0; x < words.length; x++) {
                          str[i] += words[x].charAt(0).toUpperCase() + words[x].substring(1) + ' '
                      }
                  }
              }
              
              this.items.push({
                  label: str[i].length > 30 ? str[i].substring(0, 20) + '...' : str[i]
              })
          }

          // if (this.items[0].label == 'Dispatching') this.home = { icon: 'berben-icon-dispatching' };
          // if (this.items[0].label == 'Yards') this.home = { icon: 'berben-icon-yard' };
          // if (this.items[0].label == 'Storage') this.home = { icon: 'berben-icon-storage' };
          // if (this.items[0].label == 'Sales') this.home = { icon: 'berben-icon-sales' };
          // if (this.items[0].label == 'Receiving') this.home = { icon: 'berben-icon-receiving' };
          // if (this.items[0].label == 'Dashboard') this.home = { icon: 'berben-icon-dashboard' };
          // if (this.items[0].label == 'Admin') this.home = { icon: 'berben-icon-admin' };
      }
  }

  ngOnInit() {
  }

}
