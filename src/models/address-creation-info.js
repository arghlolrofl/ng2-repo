"use strict";
var eaddress_type_1 = require("./eaddress-type");
/**
 * AddressCreationInfo model.
 */
var AddressCreationInfo = (function () {
    function AddressCreationInfo() {
        this.AddressType = eaddress_type_1.EAddressType.ApplicationAddress;
    }
    return AddressCreationInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddressCreationInfo;
