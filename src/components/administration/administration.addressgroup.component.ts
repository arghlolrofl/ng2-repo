import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AdministrationAddressGroupAddComponent from "./administration.addressgroup.add.component";
import AddressService from "../../services/address.service";
import AddressGroupInfo from "../../models/address-group-info";
import {SuggestDirective, SuggestEvents} from "../../directives/suggest.directive";
import {MAX_AC_RESULTS} from "../../config";


@Component({
    selector: 'fp-administration-addressgroup',
    templateUrl: 'assets/templates/administration/administration.addressgroup.component.html',
    directives: [
        SuggestDirective,
        AdministrationAddressGroupAddComponent
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService
    ]
})

/**
 * Administration Adressgroup component.
 */
export default class AdministrationAddressgroupComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

    /**
     * Addressgroup.
     */
    addressgroupInput: string = '';
    addressgroupEvents: EventEmitter<any> = new EventEmitter();
    addressgroupSuggestions: AddressGroupInfo[] = [];

    /**
     * Show modal dialog for adding new addressgroup.
     */
    showAddDialogChange: EventEmitter<boolean> = new EventEmitter();

    /**
     * @constructor
     * @param {AddressService} addressService the address information service
     */
    constructor(private addressService: AddressService) {
        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.addressgroupEvents.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.addressgroupSuggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.addressgroupInput = `${event.data.GroupName} ${event.data.IsDefault} (${event.data.AddressCount})`;
                    break;

                case SuggestEvents.CLEARED:
                    this.addressgroupInput = '';
                    break;

                case SuggestEvents.SHOW:
                    this.addressgroupInput = `${event.data.GroupName} ${event.data.IsDefault} (${event.data.AddressCount})`;
                    break;
            }
        });

    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressGroup>}
     */
    public mapSuggest(service: AddressService) {
        return (term: string) => {
            return service.getFilteredAddressesByAddressGroupNameAndFastQuery('AddressGroup', term, 0, MAX_AC_RESULTS)
        }
    }
}
