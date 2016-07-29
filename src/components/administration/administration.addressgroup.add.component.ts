import {Component, ViewChild, EventEmitter, Input, AfterViewInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import AddressService from "../../services/address.service";
import AddressCreationInfo from "../../models/address-creation-info";
import ErrorUtils from "../../utils/error-utils";

@Component({
    selector: 'fp-shipping-sender-add',
    templateUrl: 'assets/templates/administration/administration.addressgroup.add.component.html',
    directives: [
        MODAL_DIRECTIVES
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
export default class AdministrationAddressGroupAddComponent implements AfterViewInit {

    /**
     * Errors.
     */
    error: Error;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalAddAddressgroup') modal: ModalComponent;

    /**
     * The addressgroup to store.
     * @type {AddressCreationInfo}
     */
    addressgroup: AddressCreationInfo = new AddressCreationInfo();

    /**
     * @constructor
     * @param {AddressService} addressService the address client
     */
    constructor(private addressService: AddressService) {
    }

    /**
     * Initialize the change events.
     */
    public ngAfterViewInit() {
        this.showChange.subscribe((show) => {
            if (show) {
                this.modal.open();
            } else {
                this.modal.close();
            }
        });

    }

    /**
     * Close modal dialog.
     */
    public close() {
        this.modal.close();
        return false;
    }

    /**
     * Add addressgroup.
     */
    public save() {
        this.addressService.addNewToAddressGroup('Addressgroup', this.addressgroup).subscribe(
            () => this.modal.close(),
            (error: Error) => this.error = ErrorUtils.toError(error));
    }
}
