
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';


import { EmployeeComponent } from './employee.component';

const employeeRoutes: Routes = [
  {
    path: 'list',
    component: EmployeeComponent
  }
];

@NgModule({
  declarations: [
    EmployeeComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(employeeRoutes)
  ]
})
export class EmployeeModule { }
