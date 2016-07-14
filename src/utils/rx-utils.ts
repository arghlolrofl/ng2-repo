import {Observable} from 'rxjs/Observable';

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
                    if (data[0] >= retries) {
                        throw data[1];
                    }
                })
                .mergeMap(() => Observable.timer(delay));
    }
}