import {Component, Output, EventEmitter} from '@angular/core';
import {ControlGroup, FormBuilder, Validators} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import ModelFormatter from "../services/model-formatter.service";
import ShippingService from "../services/shipping.service";
import ParcelInfo from "../models/parcel-info";
import {ESizeUnit} from "../models/esize-info";
import {EWeightUnit} from "../models/eweight-unit";
import PostalProductInfo from "../models/postal-product-info";

@Component({
    selector: 'fp-shipping-product-calculation',
    templateUrl: 'app/templates/shipping.product-calculation.component.html',
    pipes: [
        TranslatePipe
    ],
    providers: [
        ModelFormatter,
        AddressService,
        ShippingService
    ]
})

/**
 * Shipping Product Calculation component.
 */
export default class ShippingProductCalculationComponent {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * The form for product calculation.
     */
    private productCalculationForm:ControlGroup;

    /**
     * @constructor
     * @param {ShippingService} shippingService the shipping information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private shippingService:ShippingService,
                private formBuilder:FormBuilder) {
        // initialize product calculation
        this.productCalculationForm = formBuilder.group({
            'weight': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'length': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'width': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'height': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])]
        });
    }

    /**
     * Recalculate the currently entered product information.
     */
    public recalculateProduct() {
        if (!this.productCalculationForm.valid) {
            return;
        }
        const productInfos = this.productCalculationForm.value;

        let parcelInfo = new ParcelInfo();
        parcelInfo.Characteristic.Dimension.Height = parseFloat(productInfos.height);
        parcelInfo.Characteristic.Dimension.Lenght = parseFloat(productInfos.length);
        parcelInfo.Characteristic.Dimension.Width = parseFloat(productInfos.width);
        parcelInfo.Characteristic.Dimension.Unit = ESizeUnit.Centimeter;
        parcelInfo.Characteristic.Weight.Value = parseFloat(productInfos.weight);
        parcelInfo.Characteristic.Weight.Unit = EWeightUnit.Kg;

        this.shippingService.calculate(parcelInfo)
            .subscribe(
                (postalProductInfo:PostalProductInfo) => console.log(postalProductInfo),
                (error) => this.onError.emit(error));
    }
}