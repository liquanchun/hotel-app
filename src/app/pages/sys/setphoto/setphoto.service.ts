import { Injectable } from '@angular/core';
import { HttpService } from '../../../providers/httpClient';
import { Headers, Http } from '@angular/http';
@Injectable()
export class SetPhotoService {
  private modelName = 'setphoto';  // URL to web api
  constructor(private _httpService: HttpService,
    private http: Http) {
  }

  getSetPhoto() {
    return this._httpService.getModelList(this.modelName);
  }
  getSetPhotoById(userId:any) {
    return this._httpService.getModelList(this.modelName + '/' + userId);
  }
  getSetPhotoByOrgId(orgId:any) {
    return this._httpService.getModelList(this.modelName + '/org/' + orgId);
  }

  upload(photo) {
    const formData = new FormData();
    formData.append('file', photo);
    return this.http.post(`/api/${this.modelName}`, formData);
  }

  delete(id: any) {
    return this._httpService.delete(this.modelName , id);
  }

  create(user: any) {
    return this._httpService.create(this.modelName, user);
  }
  update(id:any,user: any) {
    return this._httpService.update(this.modelName,id, user);
  }
  userAuth(modelName:any,user:any){
    return this._httpService.create(modelName, user);
  }
}
