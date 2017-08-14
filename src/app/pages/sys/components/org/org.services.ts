import { Injectable } from '@angular/core';
import { HttpService } from '../../../../providers/httpClient';
import * as _ from 'lodash';

@Injectable()
export class OrgService {
  private modelName = 'sysorg';  // URL to web api
  constructor(private _httpService: HttpService) {
  }

  getOrgs(fnCallBack) {
    const that = this;
    this._httpService.getModelList(this.modelName).then(function (orgs) {
      console.log(orgs);
      fnCallBack(that.createTree(orgs, 0));
    });
  }

  delete(id: any) {
    return this._httpService.delete(this.modelName, id);
  }
  create(pId: number, name: string) {
    return this._httpService.create(this.modelName, { parentId: pId, DeptName: name });
  }

  createTree(jsons, pid) {
    const tree = [];
    const that = this;
    if (jsons) {
      _.each(jsons, function (j) {
        if (j.parentId === pid) {
          tree.push({ id: j.id, name: j.deptName, children: that.createTree(jsons, j.id) });
        }
      });
    }
    return tree;
  }

}
