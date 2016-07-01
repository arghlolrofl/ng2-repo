"use strict";
var postal_product_price_info_1 = require("./postal-product-price-info");
/**
 * PostalProductInfo model.
 */
var PostalProductInfo = (function () {
    function PostalProductInfo() {
        this.Price = new postal_product_price_info_1.default();
    }
    return PostalProductInfo;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PostalProductInfo;
