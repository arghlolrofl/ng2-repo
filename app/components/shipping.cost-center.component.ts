import {Component, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-shipping-cost-center',
    templateUrl: 'app/templates/shipping.cost-center.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping Cost Center component.
 */
export default class ShippingCostCenterComponent {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

}