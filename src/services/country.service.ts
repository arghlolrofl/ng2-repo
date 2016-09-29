import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/base/paged-results";
import CountryInfo from "../models/country-info";

/**
 * Country API.
 */
@Injectable()
export default class CountryService {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient: APIClient) {
    }

    /**
     * Get all countries.
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<CountryInfo>}
     */
    public getAll(start?: number, num?: number): Observable<CountryInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Country/GetAll', {
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<CountryInfo>) => r.ItemList);
    }
}