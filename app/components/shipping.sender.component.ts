import {Component, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ModelFormatter from "../services/model-formatter.service";
import {SuggestDirective, SuggestEvents} from "../directives/suggest.directive";
import ShippingSenderAddComponent from "./shipping.sender.add.component";

@Component({
    selector: 'fp-shipping-sender',
    templateUrl: 'app/templates/shipping.sender.component.html',
    directives: [
        SuggestDirective,
        ShippingSenderAddComponent
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
    public senderChange:EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();

    /**
     * Updated when shipping point has changed.
     * @type {EventEmitter<string>}
     */
    @Output()
    public shippingPointChange:EventEmitter<string> = new EventEmitter<string>();

    /**
     * The sender suggest events.
     * @type {EventEmitter<any>}
     */
    public senderEvents:EventEmitter<any>;

    /**
     * Sender suggestions (autocomplete) to display.
     */
    private senderSuggestions:AddressDisplayInfo[];

    /**
     * The form for sender.
     */
    private sendersForm:ControlGroup;

    /**
     * Show modal dialog for adding new sender.
     */
    private showAddDialogChange:EventEmitter<boolean>;

    /**
     * @constructor
     * @param {ModelFormatter} modelFormatter the model formatting service
     * @param {AddressService} addressService the address information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private modelFormatter:ModelFormatter,
                private addressService:AddressService,
                private formBuilder:FormBuilder) {
        this.senderEvents = new EventEmitter<any>();
        this.showAddDialogChange = new EventEmitter();

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
                    this.senderChange.emit(event.data);
                    senderControl.updateValue(this.modelFormatter.addressDisplayInfo(event.data));
                    shippingPointControl.updateValue(event.data.ZipCode);
                    break;

                case SuggestEvents.CLEARED:
                    this.senderChange.emit(null);
                    senderControl.updateValue('');
                    shippingPointControl.updateValue('');
                    break;

                case SuggestEvents.SHOW:
                    senderControl.updateValue(this.modelFormatter.addressDisplayInfo(event.data), {emitEvent: false});
                    break;
            }
        });

        this.sendersForm.controls['shippingPoint'].valueChanges
            .subscribe(
                (shippingPoint:string) => this.shippingPointChange.emit(shippingPoint),
                (error) => this.onError.emit(error));
    }

    /**
     * Map Suggestions API call.
     * @param {AddressService} service the address service to be wrapped
     * @returns {function(string): Observable<AddressDisplayInfo>}
     */
    public mapSuggest(service:AddressService) {
        return (term:string) => {
            return service.getFilteredAddressesByAddressGroupNameAndAddressInfo('Sender', term, '', '', '', 0, 20)
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
