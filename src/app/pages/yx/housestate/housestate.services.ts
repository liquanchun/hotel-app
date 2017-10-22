import { Injectable } from '@angular/core';
import { HttpService } from '../../../providers/httpClient';
import * as _ from 'lodash';

@Injectable()
export class HouseStateService {
  private modelName = 'yxhouseState';  // URL to web api
  constructor(private _httpService: HttpService) {
  }

  getHouseStates() {
    return this._httpService.getModelList(this.modelName);
  }

  create(model: any) {
    delete model.id;
    return this._httpService.create(this.modelName, model);
  }

  update(modelId: number, model: any) {
    return this._httpService.update(this.modelName, modelId, model);
  }

  delete(id: any) {
    return this._httpService.delete(this.modelName, id);
  }
}
