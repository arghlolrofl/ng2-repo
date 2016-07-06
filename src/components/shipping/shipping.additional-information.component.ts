import {Component, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-shipping-additional-information',
    templateUrl: 'app/templates/shipping/shipping.additional-information.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping Additional Information component.
 */
export default class ShippingAdditionalInformationComponent {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Additional Information 1 changed.
     * @type {EventEmitter<string>}
     */
    @Output()
    public additionalInfo1Change:EventEmitter<string> = new EventEmitter();

    /**
     * Additional Information 2 changed.
     * @type {EventEmitter<string>}
     */
    @Output()
    public additionalInfo2Change:EventEmitter<string> = new EventEmitter();
}