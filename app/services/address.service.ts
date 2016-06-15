import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import AddressGroupInfo from '../models/address-group-info';
import AddressDisplayInfo from '../models/address-display-info';
import PagedResultsOf from "../models/paged-results";

/**
 * AddressGroup API.
 */
@Injectable()
export default class AddressService {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient:APIClient) {
    }


    public searchAddressesByAddressGroupName(groupName:string, searchTerm:string):Observable<AddressDisplayInfo> {
        // TODO replace with actual search logic
        return this.getFilteredAddressesByAddressGroupName(groupName);
    }

    public getFilteredAddressesByAddressGroupName(groupName:string,
                                                  start?:number,
                                                  num?:number):Observable<AddressDisplayInfo> {
        return this.getFilteredAddressGroups(groupName, start, num)
            .mergeMap((i:AddressGroupInfo) => this.getFilteredAddressesByAddressGroup(i.Id, start, num));
    }

    /**
     * Get filtered address groups by group name.
     * @param {string} groupName the group name
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressGroupInfo>}
     */
    public getFilteredAddressGroups(groupName:string, start?:number, num?:number):Observable<AddressGroupInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('AddressGroup/GetFiltered', {
            GroupName: groupName,
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<AddressGroupInfo>) => r.ItemList);
    }

    /**
     * Get filtered addresses by AddressGroupInfo id.
     * @param {number} addressGroupId AddressGroupInfo id
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressDisplayInfo>}
     */
    public getFilteredAddressesByAddressGroup(addressGroupId:number,
                                              start?:number,
                                              num?:number):Observable<AddressDisplayInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Address/GetFiltered', {
            AddressGroupId: addressGroupId,
            StartValue: start,
            ResultCount: num
        }).concatMap((r:PagedResultsOf<AddressDisplayInfo>) => r.ItemList);
    }
}