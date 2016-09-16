import {Component, EventEmitter, Output, Input} from '@angular/core';

import AddressService from "../../services/address.service";
import AddressDisplayInfo from "../../models/address-display-info";
import {SuggestDirective, SuggestEvents} from "../../directives/suggest.directive";
import {MAX_AC_RESULTS} from "../../config";


@Component({
    selector: 'fp-shipping-sender',
    templateUrl: 'assets/templates/shipping/shipping.sender.component.html',
    providers: [
        AddressService
    ]
})

/**
 * Shipping Sender component.
 */
export default class ShippingSenderComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Sender.
     */
    @Input() sender: AddressDisplayInfo;
    senderInput: string = '';
    @Output() senderChange: EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();
    senderEvents: EventEmitter<any> = new EventEmitter<any>();
    senderSuggestions: AddressDisplayInfo[] = [];

    /**
     * Shipping Point.
     */
    @Input() shippingPoint: string = '';
    @Output() shippingPointChange: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Show modal dialog for adding new sender.
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
        this.senderEvents.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.senderSuggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.sender = event.data;
                    this.senderChange.emit(event.data);
                    this.shippingPointChange.emit(event.data.ZipCode);
                    this.senderInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`;
                    this.shippingPoint = event.data.ZipCode;
                    break;

                case SuggestEvents.CLEARED:
                    this.sender = null;
                    this.senderChange.emit(null);
                    this.shippingPointChange.emit(null);
                    this.senderInput = '';
                    this.shippingPoint = '';
                    break;

                case SuggestEvents.SHOW:
                    this.sender = event.data;
                    this.senderInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company})`;
                    this.shippingPoint = event.data.ZipCode;
                    break;
            }
        });

        this.shippingPointChange.subscribe((value: string) => this.shippingPoint = value);
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapSuggest(service: AddressService) {
        return (term: string) => {
            return service.getFilteredAddressesByAddressGroupNameAndFastQuery('Sender', term, 0, MAX_AC_RESULTS)
        }
    }
}
