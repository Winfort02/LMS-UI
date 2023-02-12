import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { SidebarComponent } from 'src/app/components/layout/sidebar/sidebar.component';
import { TopBarComponent } from 'src/app/components/layout/top-bar/top-bar.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { LayoutComponent } from './layout.component';
import { LayoutRouterActivate } from './layout-router.activate';



// PRIMENG MODULES
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {PanelMenuModule} from 'primeng/panelmenu';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {InputSwitchModule} from 'primeng/inputswitch';


@NgModule({
  declarations: [
    SidebarComponent,
    TopBarComponent,
    FooterComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MenubarModule,
    SidebarModule,
    ButtonModule,
    MenuModule,
    FormsModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    InputNumberModule,
    RadioButtonModule,
    ToastModule,
    PanelMenuModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    InputSwitchModule
    
  ],
  exports: [
    SidebarComponent,
    TopBarComponent,
    FooterComponent,
    LayoutComponent,
  ],
  providers: [
    DatePipe, 
    LayoutRouterActivate,
    MessageService
  ],
})
export class LayoutModule {}
