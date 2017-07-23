import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { RoleModel } from '../models/role.model';
import { Config } from '../../../providers/config';

@Injectable()
export class RoleService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private rolesUrl = 'api/roles';  // URL to web api
  constructor(private http: Http, public config: Config) {
    this.rolesUrl = this.config.server + this.rolesUrl;
  }

  getRoles(): Promise<RoleModel[]> {
    return this.http.get(this.rolesUrl)
      .toPromise()
      .then(response => response.json() as RoleModel[])
      .catch(this.handleError);
  }
  getRole(id: number): Promise<RoleModel> {
    const url = `${this.rolesUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as RoleModel)
      .catch(this.handleError);
  }
  delete(id: number): Promise<void> {
    const url = `${this.rolesUrl}/${id}`;
    return this.http.delete(url, { headers: this.headers })
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }
  create(name: string): Promise<RoleModel> {
    return this.http
      .post(this.rolesUrl, JSON.stringify({ role_name: name }), { headers: this.headers })
      .toPromise()
      .then(res => res.json() as RoleModel)
      .catch(this.handleError);
  }
  update(role: RoleModel): Promise<RoleModel> {
    const url = `${this.rolesUrl}/${role.role_id}`;
    return this.http
      .put(url, JSON.stringify(role), { headers: this.headers })
      .toPromise()
      .then(() => role)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
