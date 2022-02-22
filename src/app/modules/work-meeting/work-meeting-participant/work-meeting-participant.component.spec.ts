import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkMeetingParticipantComponent } from './work-meeting-participant.component';

describe('WorkMeetingParticipantComponent', () => {
  let component: WorkMeetingParticipantComponent;
  let fixture: ComponentFixture<WorkMeetingParticipantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkMeetingParticipantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkMeetingParticipantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
