import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressGroupService from "../services/address-group.service";

@Component({
    selector: 'fp-shipping',
    templateUrl: 'app/templates/shipping.component.html',
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressGroupService
    ]
})

/**
 * Shipping component.
 */
export default class ShippingComponent {

    /**
     * @constructor
     * @param addressGroupService
     */
    constructor(private addressGroupService:AddressGroupService) {

        this.addressGroupService.getFiltered('Favorites')
            .subscribe(
                (addressGroupInfo) => console.log(addressGroupInfo),
                (error) => console.warn(error));
    }

}