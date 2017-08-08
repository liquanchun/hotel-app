import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Config } from '../providers/config';
import { GlobalState } from '../global.state';
@Injectable()
export class HttpService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private baseUrl = 'api/';  // URL to web api
    constructor(private http: Http, public config: Config, private _state: GlobalState) {
        this.baseUrl = this.config.server + this.baseUrl;
    }

    getModelList(modelName: string): Promise<any[]> {
        return this.http.get(this.baseUrl + modelName)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    getModel(modelName: string, id: any): Promise<any> {
        const url = `${this.baseUrl}${modelName}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
    }

    delete(modelName: string, id: any): Promise<void> {
        const url = `${this.baseUrl}${modelName}/${id}`;
        const that = this;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(function (error) {
                //that.create('/common/log', { user_id: sessionStorage.getItem('userId'), desc: JSON.stringify(error) });
                return Promise.reject(error.message || error || 'Server error');
            });
    }

    create(modelName: string, model: any): Promise<any> {
        return this.http
            .post(this.baseUrl + modelName, JSON.stringify(model), { headers: this.headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    update(modelName: string, modelId: any, model: any): Promise<any> {
        const url = `${this.baseUrl}${modelName}/${modelId}`;
        return this.http
            .put(url, JSON.stringify(model), { headers: this.headers })
            .toPromise()
            .then(() => model)
            .catch(this.handleError);
    }

    handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error || 'Server error');
    }
}
