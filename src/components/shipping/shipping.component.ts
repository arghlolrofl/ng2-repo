import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import ShippingSenderComponent from "./shipping.sender.component";
import ShippingOptionsComponent from "./shipping.options.component";
import ShippingProductCalculationComponent from "./shipping.product-calculation.component";
import ShippingRecipientComponent from "./shipping.recipient.component";
import ShippingCostCenterComponent from "./shipping.cost-center.component";
import ShippingAdditionalInformationComponent from "./shipping.additional-information.component";

import CostCenterInfo from "../../models/cost-center-info";
import ParcelProductInfo from "../../models/parcel-product-info";
import AddressDisplayInfo from "../../models/address-display-info";
import DimensionInfo from "../../models/dimension-info";
import WeightInfo from "../../models/weight-info";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping/shipping.component.html',
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
     * Additional Info 1.
     */
    private additionalInfo1:string;

    /**
     * Additional Info 2.
     */
    private additionalInfo2:string;

    /**
     * Parcel info.
     */
    private parcel:ParcelProductInfo;

    /**
     * Handle errors.
     * @param {any} error the error
     */
    public handleError(error:any) {
        console.warn((error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : error); // TODO error handling
    }
}