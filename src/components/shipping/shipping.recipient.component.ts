import {Component, EventEmitter, Output, Input} from '@angular/core';

import AddressService from "../../services/address.service";
import AddressDisplayInfo from "../../models/address-display-info";
import AddressGroupInfo from "../../models/address-group-info";
import {SuggestEvents} from "../../directives/suggest.directive";
import {MAX_AC_RESULTS} from "../../config";


@Component({
    selector: 'fp-shipping-recipient',
    templateUrl: 'assets/templates/shipping/shipping.recipient.component.html',
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
    @Input() recipient: AddressDisplayInfo;
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
                    this.recipient = event.data;
                    this.recipientChange.emit(event.data);
                    this.recipientInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`;
                    break;

                case SuggestEvents.CLEARED:
                    this.recipient = null;
                    this.recipientChange.emit(null);
                    this.recipientInput = '';
                    this.recipientSuggestions = [];
                    break;

                case SuggestEvents.SHOW:
                    this.recipient = event.data;
                    this.recipientInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`;
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