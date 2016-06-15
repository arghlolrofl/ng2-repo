import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/paged-results";
import CostCenterInfo from "../models/cost-center-info";

/**
 * CostCenter API.
 */
@Injectable()
export default class CostCenterService {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient:APIClient) {
    }

    /**
     * Get filtered cost centers by level and name.
     * @param {number} level the level of the cost center
     * @param {string} name the name of the cost center
     * @param {number} start the start offset
     * @param {number} num the number of results to get
     * @returns {Observable<CostCenterInfo>}
     */
    public getFilteredCostCenterByLevelAndName(level:number,
                                               name:string,
                                               start?:number,
                                               num?:number):Observable<CostCenterInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('CostCenter/GetFiltered', {
            Name: name,
            Level: level,
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<CostCenterInfo>) => r.ItemList);
    }
}