"use strict";
var parcel_characteristic_info_1 = require("./parcel-characteristic-info");
var destination_info_1 = require("./destination-info");
/**
 * ParcelInfo model.
 */
var ParcelInfo = (function () {
    function ParcelInfo() {
        this.Characteristic = new parcel_characteristic_info_1.default();
        this.Destination = new destination_info_1.default();
    }
    return ParcelInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParcelInfo;
