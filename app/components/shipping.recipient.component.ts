import {Component, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ModelFormatter from "../services/model-formatter.service";

@Component({
    selector: 'fp-shipping-recipient',
    templateUrl: 'app/templates/shipping.recipient.component.html',
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
     * The actual selected sender.
     */
    private sender:AddressDisplayInfo;

    /**
     * Eventhandler if the sender changes.
     * @type {EventEmitter}
     */
    private senderChanged:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Eventhandler if the sender is selected from the input box.
     * @type {EventEmitter}
     */
    private senderSelect:EventEmitter<any> = new EventEmitter<any>();
    private senderOffset = 0;

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
        // sender has been changed
        this.senderChanged.subscribe((data) => {
            const sender = <Control> this.sendersForm.controls['sender'];
            const shippingPoint = <Control> this.sendersForm.controls['shippingPoint'];
            this.sender = data.sender;
            sender.updateValue(this.modelFormatter.addressDisplayInfo(this.sender), {emitEvent: false});
            shippingPoint.updateValue(this.sender.ZipCode);
            if (data.clear) {
                this.senderSuggestions = [];
            }
            this.onSenderSelect.emit(this.sender);
            this.onShippingPointSelect.emit(this.sender.ZipCode);
        });
        // something has been typed in the senders input field
        this.sendersForm.controls['sender'].valueChanges
            .debounceTime(400)
            .do(() => this.senderSuggestions = [])
            .mergeMap((term) => this.addressService.searchAddressesByAddressGroupName('Sender', term))
            .subscribe(
                (addressDisplayInfo:AddressDisplayInfo) => {
                    this.senderSuggestions.push(addressDisplayInfo);
                    this.senderOffset = 0;
                },
                (error) => this.onError.emit(error));
        this.sendersForm.controls['shippingPoint'].valueChanges
            .subscribe(
                (shippingPoint:string) => this.onShippingPointSelect.emit(shippingPoint),
                (error) => this.onError.emit(error));
        // the arrow keys has been used for the suggestion list
        this.senderSelect.subscribe((keyCode) => {
            if (this.senderSuggestions.length === 0) {
                return;
            }
            if (!this.sender || (keyCode === 40 && (this.senderOffset + 1) >= this.senderSuggestions.length)) {
                this.senderOffset = 0;
            } else if (keyCode === 40) {
                this.senderOffset++;
            } else if (keyCode === 38 && (this.senderOffset - 1) < 0) {
                this.senderOffset = this.senderSuggestions.length - 1;
            } else if (keyCode === 38) {
                this.senderOffset--;
            }

            this.senderChanged.emit({
                sender: this.senderSuggestions[this.senderOffset],
                clear: keyCode === 13
            });
        });
    }

    /**
     * Select a sender and makes it active.
     * @param {AddressDisplayInfo} sender the sender to set active
     */
    public selectSender(sender:AddressDisplayInfo) {
        this.senderChanged.emit({
            sender: sender,
            clear: true
        });
    }

    public senderKeypress(keyEvent) {
        if (keyEvent.keyCode === 40 || keyEvent.keyCode === 38 || keyEvent.keyCode === 13) {
            keyEvent.preventDefault();
            this.senderSelect.emit(keyEvent.keyCode);
        }
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.senderSuggestions = [];
    }
}