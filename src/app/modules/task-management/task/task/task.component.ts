import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SessionService } from 'src/app/core/services/session.service';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};

  public title: string = 'Task';
  public module: string = 'Task Management';
  public url: string = 'task-management/task';

  public editFormGroup: FormGroup;
  public addFormGroup: FormGroup;

  public users: any = null;
  public accessRights: any = null;
  public permission: any = null;
  public contents: any = null;
  public viewContent: any = null;
  public viewMode: string = 'view';

  public isStillLoading: boolean = false;
  public isLockUser: boolean = true;

  constructor(
    private mainService: TaskService,
    private userService: UserService,
    private confirmationDialogService: ConfirmationDialogService,
    private sessionService: SessionService,

    private formBuilder: FormBuilder,
    private router: Router,

    private toastr: ToastrService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;

    this.accessRights = this.sessionService.getAccessRights();

    this.permission = this.accessRights.role.permissions.find((key: any) => key.submod_id == 2);
  }

  ngOnInit() {
    if (this.accessRights.role.id == 1 || this.permission != undefined) {
      this.isLockUser = false;

      this.loadRequiredData();
      this.fetchClientSide();

      this.dtOptions = {
        order: []
      };
    } else {
      this.router.navigate(['404']);
      return;
    }
  }

  loadRequiredData() {
    let args: null | any = this.accessRights.role.id == 1 ? null : `?user_id=${this.accessRights.user.user_id}`;

    this.userService.list(args).subscribe(res => {
      if (!res.status) {
        this.toastr.error(res.message);
        this.users = null;
        return;
      }
      this.users = res.data;
    });
  }

  onBack(mode: string) {
    this.viewMode = mode;
  }

  onAdd(form: any) {
    let userId = this.accessRights.user.user_id;

    this.addFormGroup = this.formBuilder.group({
      user_id: [this.accessRights.role.id != 1 ? userId : '', [Validators.required]],
      task_title: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      task_description: ['', [Validators.required, Validators.minLength(3)]],
      task_status: [1, [Validators.required]],
      task_hours: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      task_planned_start_date: [null],
      task_planned_end_date: [null],
      task_actual_start_date: [null],
      task_actual_end_date: [null],
      task_notes: [''],
      created_by: [this.accessRights.user.user_id],
    });

    const modal = this.modalService.open(form, { backdrop: 'static' });
  }

  onSaveAdd() {
    console.log(this.mainService.findInvalidControls(this.addFormGroup));

    if (this.addFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data = this.addFormGroup.getRawValue();

    const plannedStartDate = data.task_planned_start_date;
    const plannedEndDate = data.task_planned_end_date;

    const actualStartDate = data.task_actual_start_date;
    const actualEndDate = data.task_actual_end_date;

    if (plannedStartDate != null && plannedEndDate != null && new Date(plannedStartDate) >= new Date(plannedEndDate)) {
      this.toastr.warning('Planned start date can not greater than Planned end date');
      return;
    }

    if (actualStartDate != null && actualEndDate != null && new Date(actualStartDate) >= new Date(actualEndDate)) {
      this.toastr.warning('Actual start date can not greater than Actual end date');
      return;
    }

    this.mainService.unique(`?task_id=${data.task_id}&task_title=${data.task_title}&task_dscription=${data.task_dscription}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.add(data).subscribe(addRes => {
        this.modalService.dismissAll();

        if (addRes.status) {
          this.toastr.success(addRes.message);
          this.fetchClientSide();
        }
      });
    });
  }

  onEdit(form: any, id: number) {
    this.editFormGroup = this.formBuilder.group({
      task_id: ['', [Validators.required]],
      user_id: ['', [Validators.required]],
      task_title: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      task_description: ['', [Validators.required, Validators.minLength(3)]],
      task_status: ['', [Validators.required]],
      task_hours: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      task_planned_start_date: [null],
      task_planned_end_date: [null],
      task_actual_start_date: [null],
      task_actual_end_date: [null],
      task_notes: [''],
      updated_by: [''],
    });

    let row = this.contents.find((row: any) => row.task_id == id);

    row.updated_by = this.accessRights.user.user_id;

    this.viewContent = row;
    this.editFormGroup.patchValue(row);

    this.modalService.open(form, { backdrop: 'static' }).result.then((result) => {
      this.viewMode = 'view';
    }, (reason) => {
      this.viewMode = 'view';
    });
  }

  onSaveEdit() {
    if (this.editFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data = this.editFormGroup.getRawValue();

    const plannedStartDate = data.task_planned_start_date;
    const plannedEndDate = data.task_planned_end_date;

    const actualStartDate = data.task_actual_start_date;
    const actualEndDate = data.task_actual_end_date;

    if (plannedStartDate != null && plannedEndDate != null && new Date(plannedStartDate) >= new Date(plannedEndDate)) {
      this.toastr.warning('Planned start date can not greater than Planned end date');
      return;
    }

    if (actualStartDate != null && actualEndDate != null && new Date(actualStartDate) >= new Date(actualEndDate)) {
      this.toastr.warning('Actual start date can not greater than Actual end date');
      return;
    }

    this.mainService.unique(`?task_id=${data.task_id}&task_title=${data.task_title}&task_dscription=${data.task_dscription}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.update(data).subscribe(updateRes => {
        this.modalService.dismissAll();

        if (updateRes.status) {
          this.toastr.success(updateRes.message);
          this.fetchClientSide();
        }
      });
    });
  }

  onDelete(id: number) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete this data?')
      .then((confirmed) => {
        if (!confirmed) {
          this.confirmationDialogService.dismiss();
          return;
        }

        this.modalService.dismissAll();

        this.mainService.delete(`?task_id=${id}&deleted_by=${this.accessRights.user.user_id}`).subscribe(res => {

          if (res.status) {
            this.toastr.success(res.message);
            this.fetchClientSide();
          }
        });
      })
      .catch();
  }

  fetchClientSide() {
    this.isStillLoading = true;

    let args: null | any = this.accessRights.role.id == 1 ? null : `?created_by=${this.accessRights.user.user_id}`;

    this.mainService.list(args).subscribe(res => {
      this.isStillLoading = false;

      if (!res.status) {
        this.toastr.error(res.message);
        this.contents = null;
        return;
      }

      this.toastr.success('Successfully load data.');
      this.contents = res.data;
    });
  }

}
