import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import ShippingSenderComponent from "./shipping.sender.component";
import ShippingOptionsComponent from "./shipping.options.component";
import ShippingProductCalculationComponent from "./shipping.product-calculation.component";
import AddressDisplayInfo from "../models/address-display-info";
import ShippingRecipientComponent from "./shipping.recipient.component";
import ShippingCostCenterComponent from "./shipping.cost-center.component";
import ShippingAdditionalInformationComponent from "./shipping.additional-information.component";
import CostCenterInfo from "../models/cost-center-info";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping.component.html',
    directives: [
        ShippingSenderComponent,
        ShippingRecipientComponent,
        ShippingCostCenterComponent,
        ShippingAdditionalInformationComponent,
        ShippingProductCalculationComponent,
        ShippingOptionsComponent
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Shipping component.
 */
export default class ShippingComponent {

    /**
     * Error if there is one.
     */
    private error:Error;

    /**
     * Selected sender.
     */
    private sender:AddressDisplayInfo;

    /**
     * Selected shipping point.
     */
    private shippingPoint:string;

    /**
     * Selected recipient.
     */
    private recipient:AddressDisplayInfo;

    /**
     * Cost Center level 1.
     */
    private costCenter1:CostCenterInfo;

    /**
     * Cost Center level 2.
     */
    private costCenter2:CostCenterInfo;

    /**
     * Cost Center level 3.
     */
    private costCenter3:CostCenterInfo;

    /**
     * Handle errors.
     * @param {any} error the error
     */
    public handleError(error:any) {
        console.warn((error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : error); // TODO error handling
    }
}