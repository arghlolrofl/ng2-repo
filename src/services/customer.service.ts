import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/base/paged-results";
import ConsumerInfo from "../models/consumer-info";

@Injectable()
export default class CustomerService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient: APIClient) {
    }

    /**
     * Get consumer info.
     * @returns {Observable<ConsumerInfo>}
     */
    public getConsumerInfo(): Observable<ConsumerInfo> {
        return this.apiClient.get('Customer/GetConsumerInfo');
    }
}