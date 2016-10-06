import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/base/paged-results";
import SortedPagedResults from "../models/base/sorted-paged-results";
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
    constructor(private apiClient: APIClient) {
    }

    public getDefaultCostCenter(): Observable<SortedPagedResults<CostCenterInfo>> {
        return this.apiClient.post('CostCenter/GetFiltered', {
            Level: 1,
            IsDefault: true
        });
    }

    /**
     * Get filtered cost centers by level and name.
     * @param {number} level the level of the cost center
     * @param {string} query the query to search for
     * @param {number} [start] the start offset
     * @param {number} [num] the number of results to get
     * @returns {Observable<CostCenterInfo>}
     */
    public getFilteredCostCenterByLevelAndFastQuery(level: number,
        query: string,
        start?: number,
        num?: number): Observable<CostCenterInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('CostCenter/GetFiltered', {
            FastQuery: query,
            Level: level,
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<CostCenterInfo>) => r.ItemList);
    }
}