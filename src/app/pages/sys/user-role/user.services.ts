import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { UserModel } from '../models/user.model';

import { sha1 } from 'sha1';

@Injectable()
export class UserService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private usersUrl = 'api/users';  // URL to web api
    constructor(private http: Http) { }
    getUsers(): Promise<UserModel[]> {
        return this.http.get(this.usersUrl)
            .toPromise()
            .then(response => response.json().data as UserModel[])
            .catch(this.handleError);
    }
    getUser(id: string): Promise<UserModel> {
        const url = `${this.usersUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as UserModel)
            .catch(this.handleError);
    }
    delete(id: string): Promise<void> {
        const url = `${this.usersUrl}/${id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }
    create(name: string): Promise<UserModel> {
        
        return this.http
            .post(this.usersUrl, JSON.stringify({ user_name: name }), { headers: this.headers })
            .toPromise()
            .then(res => res.json().data as UserModel)
            .catch(this.handleError);
    }
    update(user: UserModel): Promise<UserModel> {
        const url = `${this.usersUrl}/${user.user_id}`;
        return this.http
            .put(url, JSON.stringify(user), { headers: this.headers })
            .toPromise()
            .then(() => user)
            .catch(this.handleError);
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}