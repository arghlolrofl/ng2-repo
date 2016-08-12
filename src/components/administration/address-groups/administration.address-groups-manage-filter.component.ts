import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from '../../../services/address.service';
import AddressGroupInfo from '../../../models/address-group-info';


@Component({
    selector: 'fp-administration-address-groups-manage-filter',
    templateUrl: 'assets/templates/administration/address-groups/administration.address-groups-manage-filter.html',
    providers: [
        AddressService
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups Manage Filter component.
 */
export default class AdministrationAddressGroupsManageFilterComponent {
    @Output() onError: EventEmitter<Error> = new EventEmitter();
    addressGroups: AddressGroupInfo[] = [];

    /**
     * 
     */
    constructor(
        private addressService: AddressService) {
        //addressService.getAllAddressGroups(0, 20)
        //    .subscribe(
        //    (addressGroup: AddressGroupInfo) => { this.addressGroups.push(addressGroup); },
        //    (error: Error) => { this.onError.emit(error); };
    }
}
