import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SessionService } from 'src/app/core/services/session.service';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';
import { RoomService } from 'src/app/services/room.service';
import { UserService } from 'src/app/services/user.service';
import { Room } from "src/app/models/room";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};

  public title: string = 'Facility';
  public module: string = 'Reference';
  public url: string = 'reference/room';

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
    private mainService: RoomService,
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

    this.permission = this.accessRights.role.permissions.find((key: any) => key.submod_id == 4);
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
    this.addFormGroup = this.formBuilder.group({
      room_name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      room_capacity: ['', [Validators.required, Validators.max(100), Validators.min(1), Validators.pattern("^[0-9]*$")]],
      room_description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      created_by: [this.accessRights.user.user_id],
    });

    const modal = this.modalService.open(form, { backdrop: 'static' });
  }

  onSaveAdd() {
    if (this.addFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data: Room = this.addFormGroup.getRawValue();

    this.mainService.unique(`?room_id=${data.room_id}&room_name=${data.room_name}&room_description=${data.room_description}`).subscribe(uniqueRes => {
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
      room_id: ['', [Validators.required]],
      room_name: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      room_capacity: ['', [Validators.required, Validators.max(100), Validators.min(1), Validators.pattern("^[0-9]*$")]],
      room_description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      updated_by: [''],
    });

    let row = this.contents.find((row: any) => row.room_id == id);

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

    const data: Room = this.editFormGroup.getRawValue();

    this.mainService.unique(`?room_id=${data.room_id}&room_name=${data.room_name}&room_description=${data.room_description}`).subscribe(uniqueRes => {
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

        this.mainService.delete(`?room_id=${id}&deleted_by=${this.accessRights.user.user_id}`).subscribe(res => {

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

    this.mainService.list().subscribe(res => {
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
