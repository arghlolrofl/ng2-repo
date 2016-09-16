import {Component, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'fp-shipping-additional-information',
    templateUrl: 'assets/templates/shipping/shipping.additional-information.component.html'
})

/**
 * Shipping Additional Information component.
 */
export default class ShippingAdditionalInformationComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Additional Information.
     */
    @Output() additionalInfo1Change: EventEmitter<string> = new EventEmitter<string>();
    @Output() additionalInfo2Change: EventEmitter<string> = new EventEmitter<string>();
}