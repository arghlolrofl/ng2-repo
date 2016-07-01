"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var api_client_service_1 = require('./api-client.service');
/**
 * AddressGroup API.
 */
var AddressService = (function () {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    function AddressService(apiClient) {
        this.apiClient = apiClient;
    }
    AddressService.prototype.getFilteredAddressesByAddressGroupNameAndAddressInfo = function (groupName, firstName, lastName, city, company, start, num) {
        var _this = this;
        return this.getFilteredAddressGroups(groupName, start, num)
            .mergeMap(function (i) { return _this.getFilteredAddressesByAddressGroupAndAddressInfo(i.Id, firstName, lastName, city, company, start, num); });
    };
    /**
     * Get filtered address groups by group name.
     * @param {string} groupName the group name
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressGroupInfo>}
     */
    AddressService.prototype.getFilteredAddressGroups = function (groupName, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('AddressGroup/GetFiltered', {
            GroupName: groupName,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    /**
     * Get filtered address groups by group name.
     * @param {string} groupName the group name
     * @param {string} excludeGroup the group name to be excluded from the list
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressGroupInfo>}
     */
    AddressService.prototype.getFilteredAddressGroupsWithout = function (groupName, excludeGroup, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('AddressGroup/GetFiltered', {
            GroupName: groupName,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; })
            .filter(function (r) { return r.GroupName !== excludeGroup; });
    };
    /**
     * Get filtered addresses by AddressGroupInfo id.
     * @param {number} addressGroupId AddressGroupInfo id
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<AddressDisplayInfo>}
     */
    AddressService.prototype.getFilteredAddressesByAddressGroup = function (addressGroupId, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('Address/GetFiltered', {
            AddressGroup: addressGroupId,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    AddressService.prototype.getFilteredAddressesByAddressGroupAndAddressInfo = function (addressGroupId, firstName, lastName, city, company, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('Address/GetFiltered', {
            AddressGroup: addressGroupId,
            FirstName: firstName,
            LastName: lastName,
            City: city,
            Company: company,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    /**
     * Add new address.
     * @param {string} addressGroupName the name of the address group
     * @param {AddressCreationInfo} address the address to be stored
     * @returns {Observable<void>}
     */
    AddressService.prototype.addNewToAddressGroup = function (addressGroupName, address) {
        var _this = this;
        return this.getFilteredAddressGroups(addressGroupName, 0, 1)
            .first()
            .mergeMap(function (r) {
            address.AddressGroupIds = [r.Id];
            return _this.apiClient.postNoRes('Address/AddNew', address);
        });
    };
    AddressService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_client_service_1.default])
    ], AddressService);
    return AddressService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddressService;
