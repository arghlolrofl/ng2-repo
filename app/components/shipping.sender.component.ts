import {Component, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ModelFormatter from "../services/model-formatter.service";
import {SuggestDirective, SuggestEvents} from "../directives/suggest.directive";

@Component({
    selector: 'fp-shipping-sender',
    templateUrl: 'app/templates/shipping.sender.component.html',
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
 * Shipping Sender component.
 */
export default class ShippingSenderComponent implements OnDestroy {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when sender has been changed.
     * @type {EventEmitter<AddressDisplayInfo>}
     */
    @Output()
    public onSenderSelect:EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();

    /**
     * Updated when shipping point has changed.
     * @type {EventEmitter<string>}
     */
    @Output()
    public onShippingPointSelect:EventEmitter<string> = new EventEmitter<string>();

    /**
     * The sender suggest events.
     * @type {EventEmitter<any>}
     */
    public senderEvents:EventEmitter<any> = new EventEmitter<any>();

    /**
     * The actual selected sender.
     */
    private sender:AddressDisplayInfo;

    /**
     * Sender suggestions (autocomplete) to display.
     */
    private senderSuggestions:AddressDisplayInfo[];

    /**
     * The form for sender.
     */
    private sendersForm:ControlGroup;

    /**
     * @constructor
     * @param {ModelFormatter} modelFormatter the model formatting service
     * @param {AddressService} addressService the address information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private modelFormatter:ModelFormatter,
                private addressService:AddressService,
                private formBuilder:FormBuilder) {
        // initialize sender
        this.senderSuggestions = [];
        this.sendersForm = formBuilder.group({
            'sender': [''],
            'shippingPoint': ['']
        });

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        const senderControl = <Control> this.sendersForm.controls['sender'];
        const shippingPointControl = <Control> this.sendersForm.controls['shippingPoint'];

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
                    senderControl.updateValue(this.modelFormatter.addressDisplayInfo(this.sender));
                    shippingPointControl.updateValue(this.sender.ZipCode);
                    break;

                case SuggestEvents.CLEARED:
                    senderControl.updateValue('');
                    shippingPointControl.updateValue('');
                    break;

                case SuggestEvents.SHOW:
                    senderControl.updateValue(this.modelFormatter.addressDisplayInfo(event.data), {emitEvent:false});
                    break;
            }
        });

        this.sendersForm.controls['shippingPoint'].valueChanges
            .subscribe(
                (shippingPoint:string) => this.onShippingPointSelect.emit(shippingPoint),
                (error) => this.onError.emit(error));
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapSuggest(service:AddressService) {
        return (term:string) => {
            return service.searchAddressesByAddressGroupName('Sender', term)
        }
    }

    /**
     * Select a sender and makes it active.
     * @param {AddressDisplayInfo} sender the sender to set active
     */
    public selectSender(sender:AddressDisplayInfo) {
        this.senderEvents.emit({
            type: SuggestEvents.SELECTED,
            data: sender
        });
    }

    /**
     * Clear the sender information.
     */
    public clearSender() {
        this.senderEvents.emit({
            type: SuggestEvents.CLEARED
        });
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.senderEvents.emit({
            type: SuggestEvents.CLEARED
        });
    }
}
