import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/paged-results";
import RegionInfo from "../models/region-info";

/**
 * Region API.
 */
@Injectable()
export default class RegionService {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient:APIClient) {
    }

    /**
     * Get all regions.
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<RegionInfo>}
     */
    public getAll(start?:number, num?:number):Observable<PagedResultsOf<RegionInfo>> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Region/GetAll', {
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<RegionInfo>) => r.ItemList);
    }

    /**
     * Get regions by country id.
     * @param {number} countryId the country id
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<RegionInfo>}
     */
    public getFilteredByCountryId(countryId:string, start?:number, num?:number):Observable<PagedResultsOf<RegionInfo>> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Region/GetFiltered', {
            CountryId: countryId,
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<RegionInfo>) => r.ItemList);
    }
}