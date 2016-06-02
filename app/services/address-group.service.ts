import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";

import APIClient from "./api-client.service";
import PagedResultOfAddressGroupInfo from "../models/paged-result-of-address-group-info";
import AddressGroupInfo from "../models/address-group-info";

/**
 * AddressGroup API.
 */
@Injectable()
export default class AddressGroupService {

    /**
     * The number of results to be fetched in paged results.
     * @type {number}
     */
    private batchSize:number = 5;

    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient:APIClient) {
    }

    /**
     * Set the batch size to be fetched per request.
     * @param {number} size
     */
    public setBatchSize(size:number) {
        this.batchSize = size;
    }

    public getFiltered(groupName:string, start?:number, num?:number):Observable<AddressGroupInfo> {
        start = start || 0;
        num = num || 0;

        return new Observable((observer) => {
            this.apiClient.post('AddressGroup/GetFiltered', {
                GroupName: groupName,
                StartValue: start,
                ResultCount: num
            }).map((pagedResultOfAddressGroupInfo:PagedResultOfAddressGroupInfo) => {
                return pagedResultOfAddressGroupInfo.ItemList;
            }).subscribe(
                (itemList) => {
                    for (let item of itemList) {
                        observer.next(item);
                    }
                    observer.complete();
                },
                (error) => observer.error(error)
            );
        });
    }
}