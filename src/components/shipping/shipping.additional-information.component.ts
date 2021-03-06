import {Component, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-shipping-additional-information',
    templateUrl: 'assets/templates/shipping/shipping.additional-information.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping Additional Information component.
 */
export default class ShippingAdditionalInformationComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Additional Information.
     */
    @Output() additionalInfo1Change: EventEmitter<string> = new EventEmitter();
    @Output() additionalInfo2Change: EventEmitter<string> = new EventEmitter();
}