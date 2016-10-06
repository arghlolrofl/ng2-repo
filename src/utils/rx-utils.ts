import {Observable} from 'rxjs/Observable';

import {EARLY_FAIL_HTTP_STATUS_CODES} from '../config';

/**
 * RX Utilities.
 */
export default class RxUtils {

    /**
     * Error delay for reactive tasks.
     * @param {number} retries number of retries
     * @param {number} delay number of milliseconds to wait between retries
     * @returns {function(Observable): Observable<any>}
     */
    public static errorDelay(retries, delay) {
        return (errors: Observable<any>) =>
            Observable.range(1, retries)
                .zip(errors)
                .map((data: any) => {
                    console.info(data);

                    if (data[0] >= retries || (data[1] && EARLY_FAIL_HTTP_STATUS_CODES.indexOf(data[1].status) > -1)) {
                        throw data[1];
                    }
                })
                .mergeMap(() => Observable.timer(delay));
    }
}