import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-shipping-options',
    templateUrl: 'app/templates/shipping.options.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping options component.
 */
export default class ShippingOptionsComponent {
    
}