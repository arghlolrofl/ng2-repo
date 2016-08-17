import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import ShippingRecipientAddComponent from "./shipping.recipient.add.component";
import AddressService from "../../services/address.service";
import AddressDisplayInfo from "../../models/address-display-info";
import AddressGroupInfo from "../../models/address-group-info";
import {SuggestDirective, SuggestEvents} from "../../directives/suggest.directive";
import {MAX_AC_RESULTS} from "../../config";


@Component({
    selector: 'fp-shipping-recipient',
    templateUrl: 'assets/templates/shipping/shipping.recipient.component.html',
    directives: [
        SuggestDirective,
        ShippingRecipientAddComponent
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService
    ]
})

/**
 * Shipping Recipient component.
 */
export default class ShippingRecipientComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when recipient has been changed.
     * @type {EventEmitter<AddressDisplayInfo>}
     */
    recipientInput: string = '';
    recipientEvents: EventEmitter<any> = new EventEmitter<any>();
    @Output() recipientChange: EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();
    recipientSuggestions: AddressDisplayInfo[] = [];

    /**
     * AddressGroup.
     */
    addressGroupInput: string = '';
    addressGroup: AddressGroupInfo;
    addressGroupEvents: EventEmitter<any> = new EventEmitter<any>();
    addressGroupSuggestions: AddressGroupInfo[] = [];

    /**
     * Show modal dialog for adding new recipient.
     */
    showAddDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

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
        this.addressGroupEvents.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.addressGroupSuggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.addressGroup = event.data;
                    this.addressGroupInput = event.data.GroupName;
                    this.recipientEvents.emit({ type: SuggestEvents.CLEARED });
                    break;

                case SuggestEvents.CLEARED:
                    this.addressGroup = null;
                    this.addressGroupInput = '';
                    this.recipientEvents.emit({ type: SuggestEvents.CLEARED });
                    this.addressGroupSuggestions = [];
                    break;

                case SuggestEvents.SHOW:
                    this.addressGroupInput = event.data.GroupName;
                    break;
            }
        });

        this.recipientEvents.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.recipientSuggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.recipientChange.emit(event.data);
                    this.recipientInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`
                        + ` - ${event.data.PostalAddress} ${event.data.ZipCode} ${event.data.City}`;
                    break;

                case SuggestEvents.CLEARED:
                    this.recipientChange.emit(null);
                    this.recipientInput = '';
                    this.recipientSuggestions = [];
                    break;

                case SuggestEvents.SHOW:
                    this.recipientInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`
                        + ` - ${event.data.PostalAddress} ${event.data.ZipCode} ${event.data.City}`;
                    break;
            }
        });
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressGroupInfo>}
     */
    public mapAddressGroupSuggest(service: AddressService) {
        return (term: string) => {
            return service.getFilteredAddressGroupsWithout(term, 'Sender', 0, MAX_AC_RESULTS);
        }
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapRecipientSuggest(service: AddressService) {
        return (term: string) => {
            let groupId;
            if (this.addressGroup) {
                groupId = this.addressGroup.Id;
            }
            return service.getFilteredAddressesByAddressGroupAndFastQuery(groupId, term, 0, MAX_AC_RESULTS);
        }
    }
}