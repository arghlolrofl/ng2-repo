import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import AccountCustomerFilterRequest from '../models/users/account-customer-filter-request';
import SortedPagedResults from '../models/base/sorted-paged-results';
import AccountCustomer from '../models/users/account-customer';

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

    public getAllAccountCustomers(): Observable<SortedPagedResults<AccountCustomer>> {
        return this.apiClient.post('AccountCustomer/GetAll', {
            "StartValue": 0
        });
    }

    /**
     * Get consumer info.
     * @returns {Observable<SortedPagedResults<AccountCustomer>>}
     */
    public getFilteredAccountCustomers(request: AccountCustomerFilterRequest): Observable<SortedPagedResults<AccountCustomer>> {
        return this.apiClient.post('AccountCustomer/GetFiltered', request);
    }

    public create(accountCustomerRegistration: any) {
        return this.apiClient.post('AccountCustomer/Register', accountCustomerRegistration);
    }

    public delete(id: number): Observable<Response> {
        return this.apiClient.delete('AccountCustomer/Delete?id=' + id);
    }

    public update(accountCustomer: AccountCustomer) {
        return this.apiClient.put('AccountCustomer/Update', accountCustomer);
    }

    public assignRole(userId: string, roleId: string) {
        return this.apiClient.post('AccountCustomer/AddUserRole', {
            UserId: userId,
            RoleId: roleId
        });
    }

    public removeRole(userId: string, roleId: string) {
        return this.apiClient.post('AccountCustomer/RemoveUserRole', {
            UserId: userId,
            RoleId: roleId
        });
    }

    public getAccountCustomerDetails(id: string): Observable<AccountCustomer> {
        return this.apiClient.get('AccountCustomer/GetDetails?id=' + id);
    }
}