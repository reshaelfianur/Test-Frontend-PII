import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { WorkMeetingComponent } from './work-meeting.component';
import { WorkMeetingParticipantComponent } from './work-meeting-participant/work-meeting-participant.component';
import { MinutesOfMeetingComponent } from './minutes-of-meeting/minutes-of-meeting.component';

const workMeetingRoutes: Routes = [
  {
    path: 'list',
    component: WorkMeetingComponent
  },
  {
    path: 'participant',
    component: WorkMeetingParticipantComponent
  },
  {
    path: 'minutes-of-meeting',
    component: MinutesOfMeetingComponent
  }
];

@NgModule({
  declarations: [
    WorkMeetingComponent,
    WorkMeetingParticipantComponent,
    MinutesOfMeetingComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(workMeetingRoutes)
  ]
})
export class WorkMeetingModule { }
