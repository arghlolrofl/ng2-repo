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
import PostalProductOptionInfo from "../../models/postal-product-option-info";
import ShippingService from "../../services/shipping.service";
import ShipmentRequest from "../../models/shipment-request";
import {LabelOutputFormat} from "../../models/label-output-format";
import WeightInfo from "../../models/weight-info";
import DimensionInfo from "../../models/dimension-info";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping/shipping.component.html',
    providers: [
        ShippingService
    ],
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
     * Sending information.
     */
    sender:AddressDisplayInfo;
    shippingPoint:string;
    recipient:AddressDisplayInfo;
    costCenter1:CostCenterInfo;
    costCenter2:CostCenterInfo;
    costCenter3:CostCenterInfo;
    additionalInfo1:string;
    additionalInfo2:string;
    parcel:ParcelProductInfo;
    dimensions:DimensionInfo;
    weight:WeightInfo;
    options:Array<PostalProductOptionInfo>;

    /**
     * @constructor
     * @param {ShippingService} shippingService the shipping service client
     */
    constructor(private shippingService:ShippingService) {
    }

    /**
     * Checks if buy request could work.
     * @returns {boolean}
     */
    public canBuy(parcel, shippingPoint, sender, recipient, weight, costCenter1):() => boolean {
        return () => {
            return !!parcel && !!shippingPoint && !!sender && !!recipient && !!weight && !!costCenter1;
        }
    }

    /**
     * Executed when label should be bought.
     */
    public buyLabel() {
        const request = this.generateShipmentRequest();
        this.shippingService.create(request).subscribe(
            () => {
                console.log('success');
            },
            this.handleError.bind(this));
    }

    /**
     * Handle errors.
     * @param {any} error the error
     */
    public handleError(error:any) {
        console.warn((error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : error); // TODO error handling
    }

    /**
     * Generate shipment request.
     * @returns {ShipmentRequest}
     */
    private generateShipmentRequest():ShipmentRequest {
        const request = new ShipmentRequest();
        request.ShippingPoint = this.shippingPoint.replace(/ /g, '');
        request.AdditionalInfo1 = this.additionalInfo1;
        request.AdditionalInfo2 = this.additionalInfo2;
        request.IsPickup = false;
        request.Product.Code = this.parcel.Code;
        request.Product.Options = this.options;
        request.SenderContactID = this.sender.Id;
        request.DestinationContactID = this.recipient.Id;
        request.Characteristic.Dimension = this.dimensions;
        request.Characteristic.Weight = this.weight;
        request.LabelFormat = LabelOutputFormat.Label;
        request.CostCentre.Level1 = this.costCenter1.Id;
        if (this.costCenter2) {
            request.CostCentre.Level2 = this.costCenter2.Id;
        }
        if (this.costCenter3) {
            request.CostCentre.Level3 = this.costCenter3.Id;
        }
        return request;
    }
}