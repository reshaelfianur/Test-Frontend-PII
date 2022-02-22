import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkMeetingComponent } from './work-meeting.component';

describe('WorkMeetingComponent', () => {
  let component: WorkMeetingComponent;
  let fixture: ComponentFixture<WorkMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
