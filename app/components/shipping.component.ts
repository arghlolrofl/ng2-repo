import {Component, OnInit, OnDestroy} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping.component.html',
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService
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
     * Sender input field for autocomplete.
     */
    private sendersInputField:Control;

    /**
     * The form containing the input field (must exist).
     */
    private sendersForm:ControlGroup;

    /**
     * @constructor
     * @param {AddressService} addressService the address information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private addressService:AddressService,
                private formBuilder:FormBuilder) {
        this.senders = [];

        this.sendersInputField = new Control();
        this.sendersForm = formBuilder.group({
            sender: this.sendersInputField
        });

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.sendersInputField.valueChanges
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
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.senders = [];
    }
}