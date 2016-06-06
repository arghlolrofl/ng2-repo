import {Component, OnInit, OnDestroy} from '@angular/core';
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
     * @constructor
     * @param {AddressService} addressService the address information service
     */
    constructor(private addressService:AddressService) {
        this.senders = [];
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