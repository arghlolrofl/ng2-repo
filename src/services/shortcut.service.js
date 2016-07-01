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
var ShortcutService = (function () {
    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    function ShortcutService(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Get all shortcuts.
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<ShortcutInfo>}
     */
    ShortcutService.prototype.getAll = function (start, num) {
        start = start || 0;
        num = num || 0;
        return this.apiClient.post('Shortcut/GetAll', {
            StartValue: start,
            ResultCount: num
        }).concatMap(function (r) {
            var items = r.ItemList;
            items.sort(function (a, b) {
                return a.DisplayPosition < b.DisplayPosition ? -1 : a.DisplayPosition > b.DisplayPosition ? 1 : 0;
            });
            return items;
        });
    };
    /**
     * Get all shortcuts matching a name (or partial match).
     * @param {string} name the name to be matched
     * @param {number} [start] the offset to start (starts at 0, default to 0)
     * @param {number} [num] the number of results to get (0 to get all, default to 0)
     * @returns {Observable<ShortcutInfo>}
     */
    ShortcutService.prototype.getFilteredByName = function (name, start, num) {
        return this.getAll(start, num)
            .filter(function (r) { return r.DisplayName.toLowerCase().indexOf(name.toLowerCase()) === 0; });
    };
    /**
     * Get last used shortcut.
     * @returns {Observable<ShortcutInfo>}
     */
    ShortcutService.prototype.getLast = function () {
        return this.apiClient.get('Shortcut/GetLast');
    };
    ShortcutService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [api_client_service_1.default])
    ], ShortcutService);
    return ShortcutService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ShortcutService;
