import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { TaskComponent } from './task/task/task.component';

const taskManagementRoutes: Routes = [
  {
    path: 'task',
    component: TaskComponent
  }
];

@NgModule({
  declarations: [
    TaskComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(taskManagementRoutes)
  ]
})
export class TaskManagementModule { }
