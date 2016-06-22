import {Injectable} from '@angular/core';

import APIClient from './api-client.service';

@Injectable()
export default class ShortcutsService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient:APIClient) {
    }


}