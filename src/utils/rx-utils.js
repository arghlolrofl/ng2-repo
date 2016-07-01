"use strict";
var Observable_1 = require('rxjs/Observable');
/**
 * RX Utilities.
 */
var RxUtils = (function () {
    function RxUtils() {
    }
    /**
     * Error delay for reactive tasks.
     * @param {number} retries number of retries
     * @param {number} delay number of milliseconds to wait between retries
     * @returns {function(Observable): Observable<any>}
     */
    RxUtils.errorDelay = function (retries, delay) {
        return function (errors) {
            return Observable_1.Observable.range(1, retries)
                .zip(errors)
                .mergeMap(function () { return Observable_1.Observable.timer(delay); });
        };
    };
    return RxUtils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RxUtils;
