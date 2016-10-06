import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import MailOneSettings from './../models/settings/mailone-settings';

@Injectable()
export default class SettingsService {
    private apiClient: APIClient;

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get consumer info.
     * @returns {Observable<MailOneSettings>}
     */
    public getAllSettings(): Observable<MailOneSettings> {
        return this.apiClient.get('Settings');
    }

    public postAllSettings(settings: MailOneSettings): Observable<MailOneSettings> {
        return this.apiClient.post('Settings/AddOrUpdate', settings);
    }
}