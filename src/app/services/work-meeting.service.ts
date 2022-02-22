import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class WorkMeetingService {

  private key: string = 'work-meeting';

  constructor(private _commonService: CommonService) { }

  list(params?: string) {
    return this._commonService.list(this.key, params);
  }

  get(params: string) {
    return this._commonService.get(this.key, params);
  }

  add(params: any) {
    return this._commonService.add(this.key, params);
  }

  update(params: any) {
    return this._commonService.update(this.key, params);
  }

  delete(params: string) {
    return this._commonService.delete(this.key, params);
  }

  upload(params: string) {
    return this._commonService.upload(this.key, params);
  }

  extraData(param: string) {
    return this._commonService.getExtraData(param);
  }

  unique(params: string) {
    return this._commonService.taskGet(this.key, "unique", params);
  }

  findInvalidControls(control: any) {
    return this._commonService.findInvalidControlsRecursive(control);
  }

  agreement(params: string) {
    return this._commonService.taskPut(this.key, "agreement-save", params);
  }

}
