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
// TODO remove if unnecessary
/**
 * Profile service.
 */
var ProfileService = (function () {
    function ProfileService() {
    }
    // TODO remove if unnecessary
    //noinspection JSMethodCanBeStatic
    /**
     * Gets a username (currently only mocked/fake/static data).
     * @returns {Promise<string>}
     */
    ProfileService.prototype.getUsername = function () {
        return Promise.resolve('sample-user');
    };
    ProfileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ProfileService);
    return ProfileService;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileService;
//# sourceMappingURL=profile.service.js.map