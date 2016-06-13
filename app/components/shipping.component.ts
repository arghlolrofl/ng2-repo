import {Component, OnDestroy, EventEmitter} from '@angular/core';
import {Control, ControlGroup, FormBuilder, Validators} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ShippingService from "../services/shipping.service";
import ParcelInfo from "../models/parcel-info";
import {ESizeUnit} from "../models/esize-info";
import {EWeightUnit} from "../models/eweight-unit";
import PostalProductInfo from "../models/postal-product-info";
import ModelFormatter from "../services/model-formatter.service";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping.component.html',
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
 * Shipping component.
 */
export default class ShippingComponent implements OnDestroy {

    /**
     * Error to display (if there is one).
     */
    private error:Error;

    /**
     * The actual selected sender.
     */
    private sender:AddressDisplayInfo;

    /**
     * Eventhandler if the sender changes.
     * @type {EventEmitter}
     */
    private senderChanged:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Eventhandler if the sender is selected from the input box.
     * @type {EventEmitter}
     */
    private senderSelect:EventEmitter<any> = new EventEmitter<any>();
    private senderOffset = 0;

    /**
     * Sender suggestions (autocomplete) to display.
     */
    private senderSuggestions:AddressDisplayInfo[];

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
     * @param {ModelFormatter} modelFormatter the model formatting service
     * @param {AddressService} addressService the address information service
     * @param {ShippingService} shippingService the shipping information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private modelFormatter:ModelFormatter,
                private addressService:AddressService,
                private shippingService:ShippingService,
                private formBuilder:FormBuilder) {
        // initialize sender
        this.senderSuggestions = [];
        this.sendersForm = formBuilder.group({
            'sender': [''],
            'shippingPoint': ['']
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
        // sender has been changed
        this.senderChanged.subscribe((data) => {
            const sender = <Control> this.sendersForm.controls['sender'];
            const shippingPoint = <Control> this.sendersForm.controls['shippingPoint'];
            this.sender = data.sender;
            sender.updateValue(this.modelFormatter.addressDisplayInfo(this.sender), {emitEvent: false});
            shippingPoint.updateValue(this.sender.ZipCode);
            if (data.clear) {
                this.senderSuggestions = [];
            }
        });
        // something has been typed in the senders input field
        this.sendersForm.controls['sender'].valueChanges
            .debounceTime(400)
            .do(() => this.senderSuggestions = [])
            .mergeMap((term) => this.addressService.searchAddressesByAddressGroupName('Sender', term))
            .subscribe(
                (addressDisplayInfo:AddressDisplayInfo) => {
                    this.senderSuggestions.push(addressDisplayInfo);
                    this.senderOffset = 0;
                },
                (error) => this.error = error);
        // the arrow keys has been used for the suggestion list
        this.senderSelect.subscribe((keyCode) => {
            if (this.senderSuggestions.length === 0) {
                return;
            }
            if (!this.sender || (keyCode === 40 && (this.senderOffset + 1) >= this.senderSuggestions.length)) {
                this.senderOffset = 0;
            } else if (keyCode === 40) {
                this.senderOffset++;
            } else if (keyCode === 38 && (this.senderOffset - 1) < 0) {
                this.senderOffset = this.senderSuggestions.length - 1;
            } else if (keyCode === 38) {
                this.senderOffset--;
            }

            this.senderChanged.emit({
                sender: this.senderSuggestions[this.senderOffset],
                clear: keyCode === 13
            });
        });
    }

    /**
     * Select a sender and makes it active.
     * @param {AddressDisplayInfo} sender the sender to set active
     */
    public selectSender(sender:AddressDisplayInfo) {
        this.senderChanged.emit({
            sender: sender,
            clear: true
        });
    }

    public senderKeypress(keyEvent) {
        if (keyEvent.keyCode === 40 || keyEvent.keyCode === 38 || keyEvent.keyCode === 13) {
            keyEvent.preventDefault();
            this.senderSelect.emit(keyEvent.keyCode);
        }
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
                (error) => this.error = error);
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.senderSuggestions = [];
    }
}