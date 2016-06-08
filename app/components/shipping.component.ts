import {Component, OnInit, OnDestroy} from '@angular/core';
import {Control, ControlGroup, FormBuilder, Validators} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ShippingService from "../services/shipping.service";
import ParcelInfo from "../models/parcel-info";
import {ESizeUnit} from "../models/esize-info";
import {EWeightUnit} from "../models/eweight-unit";
import PostalProductInfo from "../models/postal-product-info";
import ParcelCharacteristikInfo from "../models/parcel-characteristic-info";
import DimensionInfo from "../models/dimension-info";
import WeightInfo from "../models/weight-info";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping.component.html',
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService,
        ShippingService
    ]
})

/**
 * Shipping component.
 */
export default class ShippingComponent implements OnInit, OnDestroy {

    /**
     * Error to display (if there is one).
     */
    private error:Error;

    /**
     * Senders to display.
     */
    private senders:AddressDisplayInfo[];

    /**
     * The form for sender.
     */
    private sendersForm:ControlGroup;

    /**
     * The form for product calculation.
     */
    private productCalculationForm:ControlGroup;

    /**
     * @constructor
     * @param {AddressService} addressService the address information service
     * @param {ShippingService} shippingService the shipping information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private addressService:AddressService,
                private shippingService:ShippingService,
                private formBuilder:FormBuilder) {
        // initialize sender
        this.senders = [];
        this.sendersForm = formBuilder.group({
            'sender': ['']
        });

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

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.sendersForm.controls['sender'].valueChanges
            .debounceTime(400)
            .do(() => this.senders = [])
            .mergeMap((term) => this.addressService.searchAddressesByAddressGroupName('Sender', term))
            .subscribe(
                (addressDisplayInfo:AddressDisplayInfo) => this.senders.push(addressDisplayInfo),
                (error) => this.error = error);
    }

    /**
     * OnInit.
     */
    public ngOnInit() {
        this.addressService.getFilteredAddressesByAddressGroupName('Sender', 0, 1)
            .subscribe(
                (addressDisplayInfo:AddressDisplayInfo) => this.senders.push(addressDisplayInfo),
                (error) => this.error = error);
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
        parcelInfo.Characteristic = new ParcelCharacteristikInfo();
        parcelInfo.Characteristic.Dimension = new DimensionInfo();
        parcelInfo.Characteristic.Dimension.Height = parseFloat(productInfos.height);
        parcelInfo.Characteristic.Dimension.Lenght = parseFloat(productInfos.length);
        parcelInfo.Characteristic.Dimension.Width = parseFloat(productInfos.width);
        parcelInfo.Characteristic.Dimension.Unit = ESizeUnit.Centimeter;
        parcelInfo.Characteristic.Weight = new WeightInfo();
        parcelInfo.Characteristic.Weight.Value = parseFloat(productInfos.weight);
        parcelInfo.Characteristic.Weight.Unit = EWeightUnit.Kg;

        this.shippingService.calculate(parcelInfo)
            .subscribe(
                (postalProductInfo:PostalProductInfo) => console.log(postalProductInfo),
                (error) => this.error = error);
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.senders = [];
    }
}