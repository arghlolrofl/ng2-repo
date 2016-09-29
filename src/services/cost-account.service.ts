import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import SortedPagedRequest from '../models/base/sorted-paged-request';
import SortedPagedResults from '../models/base/sorted-paged-results';
import CostAccountInfo from '../models/cost-account/cost-account-info';

@Injectable()
export default class CostAccountService {
    private apiClient: APIClient;

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get list of cost accounts.
     * @returns {Observable<SortedPagedResults<CostAccountInfo>>}
     */
    public getAllCostCenters(): Observable<SortedPagedResults<CostAccountInfo>> {
        return this.apiClient.post('CostCenter/GetAll', {
            "StartValue": 0
        });
    }

    public getCostCenters(sortedPagedRequest: SortedPagedRequest): Observable<SortedPagedResults<CostAccountInfo>> {
        return this.apiClient.post('CostCenter/GetAll', sortedPagedRequest);
    }

    public delete(id: number): Observable<Response> {
        return this.apiClient.delete('CostCenter/Delete?id=' + id);
    }

    public update(costAccount: CostAccountInfo) {
        return this.apiClient.put('CostCenter/Update', costAccount);
    }

    public create(costAccount: CostAccountInfo) {
        return this.apiClient.post('CostCenter/AddNew', costAccount);
    }
}