import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import PagedResultsOf from "../models/paged-results";
import ShortcutInfo from "../models/shortcut-info";

@Injectable()
export default class ShortcutService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient:APIClient) {
    }

    /**
     * Get all shortcuts.
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<ShortcutInfo>}
     */
    public getAll(start?:number, num?:number):Observable<ShortcutInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Shortcut/GetAll', {
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<ShortcutInfo>) => {
            const items = r.ItemList;
            items.sort((a:ShortcutInfo, b:ShortcutInfo) =>
                a.DisplayPosition < b.DisplayPosition ? -1 : a.DisplayPosition > b.DisplayPosition ? 1 : 0);
            return items;
        });
    }

    /**
     * Get last used shortcut.
     * @returns {Observable<ShortcutInfo>}
     */
    public getLast():Observable<ShortcutInfo> {
        return this.apiClient.get('Shortcut/GetLast');
    }
}