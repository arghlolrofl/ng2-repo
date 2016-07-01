"use strict";
var dimension_info_1 = require("./dimension-info");
var weight_info_1 = require("./weight-info");
/**
 * ParcelCharacteristicInfo model.
 */
var ParcelCharacteristikInfo = (function () {
    function ParcelCharacteristikInfo() {
        this.Dimension = new dimension_info_1.default();
        this.Weight = new weight_info_1.default();
    }
    return ParcelCharacteristikInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParcelCharacteristikInfo;
