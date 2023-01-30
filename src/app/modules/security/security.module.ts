import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecurityRoutingModule } from './security-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';

// Components
import { SecurityComponent } from './security.component';
import { LoginComponent } from 'src/app/components/security/login/login.component';


// PRIMENG
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

// // ROUTE GUARD
// import { LoginGuard } from 'src/app/guards/login.guard';

@NgModule({
  declarations: [
    SecurityComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    SecurityRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers: [
    MessageService,
    DialogService,
    DynamicDialogRef
  ]
})
export class SecurityModule { }