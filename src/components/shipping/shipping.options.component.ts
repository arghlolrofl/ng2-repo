import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import PostalProductInfo from "../../models/postal-product-info";
import PostalProductOptionInfo from "../../models/postal-product-option-info";
import CustomerService from "../../services/customer.service";
import ConsumerInfo from "../../models/consumer-info";
import PostalProductAdjustmentInfo from "../../models/postal-product-adjustment-info";
import {initOptionsUI} from "../../ui/ui";

@Component({
    selector: 'fp-shipping-options',
    templateUrl: 'assets/templates/shipping/shipping.options.component.html',
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
export default class ShippingOptionsComponent implements AfterViewInit {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when label should be bought.
     * @type {EventEmitter<boolean>}
     */
    @Output() onBuyLabel: EventEmitter<boolean> = new EventEmitter();

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalOptionSelect') modalOptionSelect: ModalComponent;

    /**
     * Parcel.
     */
    @Input() parcel: PostalProductInfo;
    @Input() canBuy: () => boolean = () => true;

    /**
     * Consumer information.
     */
    consumer: ConsumerInfo;

    /**
     * Options.
     */
    selectedOptions: Array<PostalProductOptionInfo>;
    @Output() selectedOptionsChange: EventEmitter<Array<PostalProductOptionInfo>> = new EventEmitter();

    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     */
    constructor(private customerService: CustomerService) {
        this.selectedOptions = [];

        this.customerService.getConsumerInfo().subscribe(
            (r: ConsumerInfo) => this.consumer = r,
            (error: Error) => this.onError.emit(error));
    }

    /**
     * Initialize UI.
     */
    ngAfterViewInit() {
        initOptionsUI();
    }
    
    /**
     * Get the options that should be displayed (reduced list).
     * @returns {string}
     */
    private getDisplayOptions() {
        return this.selectedOptions /*.slice().slice(0, Math.min(5, this.options.length))*/
            .map((option: PostalProductOptionInfo) => option.Name)
            .join(', ');
    }

    /**
     * Executed when a option is selected.
     * @param {PostalProductOptionInfo} option the option to be selected
     * @param {boolean} checked true if it is check, false if not
     */
    private selectOption(option: PostalProductOptionInfo, checked) {
        if (checked) {
            this.selectedOptions.push(option);
        } else {
            this.selectedOptions = this.selectedOptions.filter(
                (r: PostalProductOptionInfo) => r.Code !== option.Code);
        }
        this.selectedOptionsChange.emit(this.selectedOptions);
    }

    /**
     * Get option costs for selected options.
     * @returns {number}
     */
    private getOptionCosts() {
        return this.selectedOptions.reduce((p, r: PostalProductOptionInfo) => p + r.Price, 0);
    }

    /**
     * Get the extra service costs based on the selected options.
     * @returns {number}
     */
    private getExtraServiceCosts() {
        return this.getOptionCosts() +
            this.parcel.Price.Adjustments.reduce((p, r: PostalProductAdjustmentInfo) => p + r.Cost, 0);
    }

    /**
     * Emits the buy event.
     */
    private buyLabel() {
        this.onBuyLabel.emit(true);
    }
}