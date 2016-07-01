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
 * CostCenter API.
 */
var CostCenterService = (function () {
    /**
     * @constructor
     * @param {APIClient} apiClient the APIClient
     */
    function CostCenterService(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get filtered cost centers by level and name.
     * @param {number} level the level of the cost center
     * @param {string} name the name of the cost center
     * @param {number} start the start offset
     * @param {number} num the number of results to get
     * @returns {Observable<CostCenterInfo>}
     */
    CostCenterService.prototype.getFilteredCostCenterByLevelAndName = function (level, name, start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('CostCenter/GetFiltered', {
            Name: name,
            Level: level,
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) { return r.ItemList; });
    };
    CostCenterService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_client_service_1.default])
    ], CostCenterService);
    return CostCenterService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CostCenterService;
