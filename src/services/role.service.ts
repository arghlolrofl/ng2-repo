import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import APIClient from './base/api-client.authentication.service';
import SortedPagedResults from '../models/base/sorted-paged-results';
import AccountRole from '../models/users/account-role';

@Injectable()
export default class AccountCustomerService {
    private apiClient: APIClient;

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
    }

    public getAllRoles(): Observable<SortedPagedResults<AccountRole>> {
        return this.apiClient.post('Role/GetAll', {
            "StartValue": 0
        });
    }
}