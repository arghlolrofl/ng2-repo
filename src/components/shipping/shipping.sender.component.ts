import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import ShippingSenderAddComponent from "./shipping.sender.add.component";
import AddressService from "../../services/address.service";
import AddressDisplayInfo from "../../models/address-display-info";
import {SuggestDirective, SuggestEvents} from "../../directives/suggest.directive";


@Component({
    selector: 'fp-shipping-sender',
    templateUrl: 'app/templates/shipping/shipping.sender.component.html',
    directives: [
        SuggestDirective,
        ShippingSenderAddComponent
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService
    ]
})

/**
 * Shipping Sender component.
 */
export default class ShippingSenderComponent {

    @Output()
    onError:EventEmitter<Error> = new EventEmitter();

    /**
     * Sender.
     */
    senderInput:string = '';
    @Output() senderChange:EventEmitter<AddressDisplayInfo> = new EventEmitter();
    senderEvents:EventEmitter<any> = new EventEmitter();
    senderSuggestions:AddressDisplayInfo[] = [];

    /**
     * Shipping Point.
     */
    shippingPoint:string = '';
    @Output() shippingPointChange:EventEmitter<string> = new EventEmitter();

    /**
     * Show modal dialog for adding new sender.
     */
    showAddDialogChange:EventEmitter<boolean> = new EventEmitter();

    /**
     * @constructor
     * @param {AddressService} addressService the address information service
     */
    constructor(private addressService:AddressService) {
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
                    this.senderChange.emit(event.data);
                    this.shippingPointChange.emit(event.data.ZipCode);
                    this.senderInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company}) - ` +
                        `${event.data.PostalAddress} ${event.data.ZipCode} ${event.data.City}`;
                    this.shippingPoint = event.data.ZipCode;
                    break;

                case SuggestEvents.CLEARED:
                    this.senderChange.emit(null);
                    this.shippingPointChange.emit(null);
                    this.senderInput = '';
                    this.shippingPoint = '';
                    break;

                case SuggestEvents.SHOW:
                    this.senderInput = `${event.data.FirstName} ${event.data.LastName} (${event.data.Company}) - ` +
                        `${event.data.PostalAddress} ${event.data.ZipCode} ${event.data.City}`;
                    this.shippingPoint = event.data.ZipCode;
                    break;
            }
        });

        this.shippingPointChange.subscribe((value:string) => this.shippingPoint = value);
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapSuggest(service:AddressService) {
        return (term:string) => {
            return service.getFilteredAddressesByAddressGroupNameAndFastQuery('Sender', term, 0, 20)
        }
    }
}
