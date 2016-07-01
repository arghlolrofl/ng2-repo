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
 * Region API.
 */
var RegionService = (function () {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    function RegionService(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get all regions.
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<RegionInfo>}
     */
    RegionService.prototype.getAll = function (start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('Region/GetAll', {
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    /**
     * Get regions by country id.
     * @param {number} countryId the country id
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<RegionInfo>}
     */
    RegionService.prototype.getFilteredByCountryId = function (countryId, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('Region/GetFiltered', {
            CountryId: countryId,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    RegionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_client_service_1.default])
    ], RegionService);
    return RegionService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegionService;
