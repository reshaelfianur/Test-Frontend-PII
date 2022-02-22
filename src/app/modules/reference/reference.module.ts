import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { RoomComponent } from './room/room.component';
import { FacilityComponent } from './facility/facility.component';

const referenceRoutes: Routes = [
  {
    path: 'room',
    component: RoomComponent
  },
  {
    path: 'facility',
    component: FacilityComponent
  }
];

@NgModule({
  declarations: [
    RoomComponent,
    FacilityComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(referenceRoutes)
  ]
})
export class ReferenceModule { }
