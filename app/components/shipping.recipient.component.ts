import {Component, OnDestroy, EventEmitter, Output} from '@angular/core';
import {Control, ControlGroup, FormBuilder} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import AddressDisplayInfo from "../models/address-display-info";
import ModelFormatter from "../services/model-formatter.service";
import AddressGroupInfo from "../models/address-group-info";

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
     * Updated when recipient has been changed.
     * @type {EventEmitter<AddressDisplayInfo>}
     */
    @Output()
    public onRecipientSelect:EventEmitter<AddressDisplayInfo> = new EventEmitter<AddressDisplayInfo>();

    /**
     * The actual selected address group.
     */
    private addressGroup:AddressGroupInfo;

    /**
     * Address Group suggestions.
     */
    private addressGroupSuggestions:AddressGroupInfo[];

    /**
     * If the selection is toggled.
     * @type {EventEmitter<any>}
     */
    private addressGroupSelect:EventEmitter<any> = new EventEmitter<any>();

    /**
     * If the address group has been changed.
     * @type {EventEmitter<any>}
     */
    private addressGroupChanged:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Address Group selection offset.
     * @type {number}
     */
    private addressGroupOffset = 0;

    /**
     * The actual selected recipient.
     */
    private recipient:AddressDisplayInfo;

    /**
     * Recipient suggestions (autocomplete) to display.
     */
    private recipientSuggestions:AddressDisplayInfo[];

    /**
     * If the selection is toggled.
     * @type {EventEmitter<any>}
     */
    private recipientSelect:EventEmitter<any> = new EventEmitter<any>();

    /**
     * If the reicpient has been changed.
     * @type {EventEmitter<any>}
     */
    private recipientChanged:EventEmitter<any> = new EventEmitter<any>();

    /**
     * Recipient selection offset.
     * @type {number}
     */
    private recipientOffset = 0;

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
        this.addressGroupChanged.subscribe((data) => {
            const addressGroup = <Control> this.recipientsForm.controls['addressGroup'];
            this.addressGroup = data.addressGroup;
            addressGroup.updateValue(this.modelFormatter.addressGroupInfo(this.addressGroup), {emitEvent: false});
            if (data.clear) {
                this.addressGroupSuggestions = [];
            }
        });
        this.recipientsForm.controls['addressGroup'].valueChanges
            .debounceTime(400)
            .do(() => this.addressGroupSuggestions = [])
            .mergeMap((term) => this.addressService.getFilteredAddressGroups(term))
            .subscribe(
                (item:AddressGroupInfo) => {
                    this.addressGroupSuggestions.push(item);
                    this.addressGroupOffset = 0;
                },
                (error) => this.onError.emit(error));
        this.addressGroupSelect.subscribe((keyCode) => {
            if (this.addressGroupSuggestions.length === 0) {
                return;
            }
            if (!this.addressGroup
                || (keyCode === 40 && (this.addressGroupOffset + 1) >= this.addressGroupSuggestions.length)) {
                this.addressGroupOffset = 0;
            } else if (keyCode === 40) {
                this.addressGroupOffset++;
            } else if (keyCode === 38 && (this.addressGroupOffset - 1) < 0) {
                this.addressGroupOffset = this.addressGroupSuggestions.length - 1;
            } else if (keyCode === 38) {
                this.addressGroupOffset--;
            }

            this.addressGroupChanged.emit({
                addressGroup: this.addressGroupSuggestions[this.addressGroupOffset],
                clear: keyCode === 13
            });
        });

        this.recipientChanged.subscribe((data) => {
            const recipient = <Control> this.recipientsForm.controls['recipient'];
            this.recipient = data.recipient;
            recipient.updateValue(this.modelFormatter.addressDisplayInfo(this.recipient), {emitEvent: false});
            if (data.clear) {
                this.recipientSuggestions = [];
            }
        });
        this.recipientsForm.controls['recipient'].valueChanges
            .debounceTime(400)
            .do(() => this.recipientSuggestions = [])
            .mergeMap((term) => this.addressService.getFilteredAddressesByAddressGroupName(this.addressGroup.GroupName))
            .subscribe(
                (item:AddressDisplayInfo) => {
                    this.recipientSuggestions.push(item);
                    this.recipientOffset = 0;
                },
                (error) => this.onError.emit(error));
        this.recipientSelect.subscribe((keyCode) => {
            if (this.recipientSuggestions.length === 0) {
                return;
            }
            if (!this.recipient
                || (keyCode === 40 && (this.recipientOffset + 1) >= this.recipientSuggestions.length)) {
                this.recipientOffset = 0;
            } else if (keyCode === 40) {
                this.recipientOffset++;
            } else if (keyCode === 38 && (this.recipientOffset- 1) < 0) {
                this.recipientOffset = this.recipientSuggestions.length - 1;
            } else if (keyCode === 38) {
                this.recipientOffset--;
            }

            this.recipientChanged.emit({
                recipient: this.recipientSuggestions[this.recipientOffset],
                clear: keyCode === 13
            });
        });
    }

    /**
     * Executed when a user clicks on a result to select it.
     * @param {AddressGroupInfo} addressGroup the address group to be selected
     */
    public selectAddressGroup(addressGroup:AddressGroupInfo) {
        this.addressGroupChanged.emit({
            addressGroup: addressGroup,
            clear: true
        });
    }

    /**
     * Executed when the user pages through the suggestions.
     * @param keyEvent the key event
     */
    public addressGroupKeypress(keyEvent) {
        if (keyEvent.keyCode === 40 || keyEvent.keyCode === 38 || keyEvent.keyCode === 13) {
            keyEvent.preventDefault();
            this.addressGroupSelect.emit(keyEvent.keyCode);
        }
    }

    /**
     * Executed when a user clicks on a result to select it.
     * @param {AddressDisplayInfo} recipient the recipient to be selected
     */
    public selectRecipient(recipient:AddressDisplayInfo) {
        this.recipientChanged.emit({
            recipient: recipient,
            clear: true
        });
    }

    /**
     * Executed when the user pages through the suggestions.
     * @param keyEvent the key event
     */
    public recipientKeypress(keyEvent) {
        if (keyEvent.keyCode === 40 || keyEvent.keyCode === 38 || keyEvent.keyCode === 13) {
            keyEvent.preventDefault();
            this.recipientSelect.emit(keyEvent.keyCode);
        }
    }

    /**
     * OnDestroy.
     */
    public ngOnDestroy() {
        this.addressGroupSuggestions = [];
        this.recipientSuggestions = [];
    }
}