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
/**
 * Formats the models to strings.
 */
var ModelFormatter = (function () {
    function ModelFormatter() {
    }
    //noinspection JSMethodCanBeStatic
    /**
     * Format the AddressDisplayInfo.
     * @param {AddressDisplayInfo} model the model to be formatted
     * @returns {string}
     */
    ModelFormatter.prototype.addressDisplayInfo = function (model) {
        if (!model) {
            return '';
        }
        return model.FirstName + " " + model.LastName;
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Format the AddressGroupInfo.
     * @param {AddressGroupInfo} model the model to be formatted
     * @returns {string}
     */
    ModelFormatter.prototype.addressGroupInfo = function (model) {
        if (!model) {
            return '';
        }
        return "" + model.GroupName;
    };
    //noinspection JSMethodCanBeStatic
    /**
     * Format the CostCenterInfo.
     * @param {CostCenterInfo} model the model to be formatted
     * @returns {any}
     */
    ModelFormatter.prototype.costCenterInfo = function (model) {
        if (!model) {
            return '';
        }
        return "" + model.Name;
    };
    ModelFormatter = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ModelFormatter);
    return ModelFormatter;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModelFormatter;
//# sourceMappingURL=model-formatter.service.js.map