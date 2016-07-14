import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import AddressGroupInfo from '../models/address-group-info';
import AddressDisplayInfo from '../models/address-display-info';
import PagedResultsOf from "../models/paged-results";
import AddressCreationInfo from "../models/address-creation-info";

/**
 * AddressGroup API.
 */
@Injectable()
export default class AddressService {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    constructor(private apiClient: APIClient) {
    }

    /**
     * Get filtered addresses by AddressGroupInfo name and query.
     * @param {string} groupName name of the AddressGroup
     * @param {string} query the query to search for
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressDisplayInfo>}
     */
    public getFilteredAddressesByAddressGroupNameAndFastQuery(groupName: string,
        query: string,
        start?: number,
        num?: number): Observable<AddressDisplayInfo> {
        return this.getFilteredAddressGroups(groupName, start, num)
            .mergeMap((i: AddressGroupInfo) => this.getFilteredAddressesByAddressGroupAndFastQuery(
                i.Id, query, start, num));
    }

    /**
     * Get filtered address groups by group name.
     * @param {string} groupName the group name
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressGroupInfo>}
     */
    public getFilteredAddressGroups(groupName: string, start?: number, num?: number): Observable<AddressGroupInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('AddressGroup/GetFiltered', {
            GroupName: groupName,
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<AddressGroupInfo>) => r.ItemList);
    }

    /**
     * Get filtered address groups by group name.
     * @param {string} groupName the group name
     * @param {string} excludeGroup the group name to be excluded from the list
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressGroupInfo>}
     */
    public getFilteredAddressGroupsWithout(groupName: string,
        excludeGroup: string,
        start?: number,
        num?: number): Observable<AddressGroupInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('AddressGroup/GetFiltered', {
            GroupName: groupName,
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<AddressGroupInfo>) => r.ItemList)
            .filter((r: AddressGroupInfo) => r.GroupName !== excludeGroup);
    }

    /**
     * Get filtered addresses by AddressGroupInfo id.
     * @param {number} addressGroupId AddressGroupInfo id
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressDisplayInfo>}
     */
    public getFilteredAddressesByAddressGroup(addressGroupId: number,
        start?: number,
        num?: number): Observable<AddressDisplayInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Address/GetFiltered', {
            AddressGroup: addressGroupId,
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<AddressDisplayInfo>) => r.ItemList);
    }

    /**
     * Get filtered addresses by AddressGroupInfo id and query.
     * @param {number} addressGroupId AddressGroupInfo id
     * @param {string} query the query to search for
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressDisplayInfo>}
     */
    public getFilteredAddressesByAddressGroupAndFastQuery(addressGroupId: number,
        query: string,
        start?: number,
        num?: number): Observable<AddressDisplayInfo> {
        start = start || 0;
        num = num || 0;

        return this.apiClient.post('Address/GetFiltered', {
            AddressGroup: addressGroupId,
            FastQuery: query,
            StartValue: start,
            ResultCount: num
        }).concatMap((r: PagedResultsOf<AddressDisplayInfo>) => r.ItemList);
    }

    /**
     * Add new address.
     * @param {string} addressGroupName the name of the address group
     * @param {AddressCreationInfo} address the address to be stored
     * @returns {Observable<void>}
     */
    public addNewToAddressGroup(addressGroupName: string, address: AddressCreationInfo): Observable<void> {
        return this.getFilteredAddressGroups(addressGroupName, 0, 1)
            .first()
            .mergeMap((r: AddressGroupInfo) => {
                address.AddressGroupIds = [r.Id];
                return this.apiClient.postNoRes('Address/AddNew', address);
            });
    }
}