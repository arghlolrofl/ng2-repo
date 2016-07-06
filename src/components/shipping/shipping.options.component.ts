import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import PostalProductInfo from "../../models/postal-product-info";
import PostalProductOptionInfo from "../../models/postal-product-option-info";
import CustomerService from "../../services/customer.service";
import ConsumerInfo from "../../models/consumer-info";

@Component({
    selector: 'fp-shipping-options',
    templateUrl: 'app/templates/shipping/shipping.options.component.html',
    directives: [
        MODAL_DIRECTIVES
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        CustomerService
    ]
})

/**
 * Shipping options component.
 */
export default class ShippingOptionsComponent {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Parcel.
     */
    @Input()
    public parcel:PostalProductInfo;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalOptionSelect')
    private modalOptionSelect:ModalComponent;

    /**
     * Selected options.
     */
    private selectedOptions:Array<PostalProductOptionInfo>;

    /**
     * Consumer information.
     */
    private consumer:ConsumerInfo;

    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     */
    constructor(private customerService:CustomerService) {
        this.selectedOptions = [];

        this.customerService.getConsumerInfo().subscribe(
            (r:ConsumerInfo) => this.consumer = r,
            (error:Error) => this.onError.emit(error));
    }

    /**
     * Get the options that should be displayed (reduced list).
     * @returns {string}
     */
    private getDisplayOptions() {
        return this.selectedOptions /*.slice().slice(0, Math.min(5, this.options.length))*/
            .map((option:PostalProductOptionInfo) => option.Name)
            .join(', ');
    }

    /**
     * Executed when a option is selected.
     * @param {PostalProductOptionInfo} option the option to be selected
     * @param {boolean} checked true if it is check, false if not
     */
    private selectOption(option:PostalProductOptionInfo, checked) {
        if (checked) {
            this.selectedOptions.push(option);
        } else {
            this.selectedOptions = this.selectedOptions.filter(
                (r:PostalProductOptionInfo) => r.Code !== option.Code);
        }
    }

    /**
     * Get the extra service costs based on the selected options.
     * @returns {number}
     */
    private getExtraServiceCosts() {
        return this.selectedOptions.reduce((p, r:PostalProductOptionInfo) => p + r.Price, 0);
    }
}