import {Component, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ModelFormatter from "../services/model-formatter.service";
import AddressGroupInfo from "../models/address-group-info";
import {SuggestDirective, SuggestEvents} from "../directives/suggest.directive";

@Component({
    selector: 'fp-shipping-recipient',
    templateUrl: 'app/templates/shipping.recipient.component.html',
    directives: [
        SuggestDirective
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        ModelFormatter,
        AddressService
    ]
})

/**
 * Shipping Recipient component.
 */
export default class ShippingRecipientComponent implements OnDestroy {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when recipient has been changed.
     * @type {EventEmitter<AddressDisplayInfo>}
     */
    @Output()
    public recipientChange:EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();

    /**
     * The address group events.
     * @type {EventEmitter<any>}
     */
    public addressGroupEvents:EventEmitter<any> = new EventEmitter<any>();

    /**
     * The actual selected address group.
     */
    private addressGroup:AddressGroupInfo;

    /**
     * Address Group suggestions.
     */
    private addressGroupSuggestions:AddressGroupInfo[];

    /**
     * The recipient events.
     * @type {EventEmitter<any>}
     */
    public recipientEvents:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Recipient suggestions (autocomplete) to display.
     */
    private recipientSuggestions:AddressDisplayInfo[];

    /**
     * The form for recipient.
     */
    private recipientsForm:ControlGroup;

    /**
     * @constructor
     * @param {ModelFormatter} modelFormatter the model formatting service
     * @param {AddressService} addressService the address information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private modelFormatter:ModelFormatter,
                private addressService:AddressService,
                private formBuilder:FormBuilder) {
        this.addressGroupSuggestions = [];
        this.recipientSuggestions = [];
        this.recipientsForm = formBuilder.group({
            'addressGroup': [''],
            'recipient': ['']
        });

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        const addressGroupControl = <Control> this.recipientsForm.controls['addressGroup'];
        const recipientControl = <Control> this.recipientsForm.controls['recipient'];

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
                    addressGroupControl.updateValue(this.modelFormatter.addressGroupInfo(this.addressGroup));
                    this.recipientEvents.emit({
                        type: SuggestEvents.CLEARED
                    });
                    break;

                case SuggestEvents.CLEARED:
                    addressGroupControl.updateValue('');
                    break;

                case SuggestEvents.SHOW:
                    addressGroupControl.updateValue(this.modelFormatter.addressGroupInfo(event.data), {emitEvent: false});
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
                    recipientControl.updateValue(this.modelFormatter.addressDisplayInfo(event.data));
                    break;

                case SuggestEvents.CLEARED:
                    this.recipientChange.emit(null);
                    recipientControl.updateValue('');
                    break;

                case SuggestEvents.SHOW:
                    recipientControl.updateValue(this.modelFormatter.addressDisplayInfo(event.data), {emitEvent: false});
                    break;
            }
        });
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressGroupInfo>}
     */
    public mapAddressGroupSuggest(service:AddressService) {
        return (term:string) => {
            return service.getFilteredAddressGroupsWithout(term, 'Sender', 0, 20);
        }
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapRecipientSuggest(service:AddressService) {
        return (term:string) => {
            let groupId;
            if (this.addressGroup) {
                groupId = this.addressGroup.Id;
            }
            return service.getFilteredAddressesByAddressGroupAndAddressInfo(groupId, term, '', '', '', 0, 20);
        }
    }

    /**
     * Executed when a user clicks on a result to select it.
     * @param {AddressGroupInfo} addressGroup the address group to be selected
     */
    public selectAddressGroup(addressGroup:AddressGroupInfo) {
        this.addressGroupEvents.emit({
            type: SuggestEvents.SELECTED,
            data: addressGroup
        });
    }

    /**
     * Clear address group.
     */
    public clearAddressGroup() {
        this.addressGroupEvents.emit({
            type: SuggestEvents.CLEARED
        });
    }

    /**
     * Executed when a user clicks on a result to select it.
     * @param {AddressDisplayInfo} recipient the recipient to be selected
     */
    public selectRecipient(recipient:AddressDisplayInfo) {
        this.recipientEvents.emit({
            type: SuggestEvents.SELECTED,
            data: recipient
        });
    }

    /**
     * Clear recipient.
     */
    public clearRecipient() {
        this.recipientEvents.emit({
            type: SuggestEvents.CLEARED
        });
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.addressGroupEvents.emit({type: SuggestEvents.CLEARED});
        this.recipientEvents.emit({type: SuggestEvents.CLEARED});
    }
}