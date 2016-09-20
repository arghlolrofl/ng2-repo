import {Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnChanges} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import * as _ from 'lodash';

import PostalProductInfo from "../../models/postal-product-info";
import PostalProductOptionInfo from "../../models/postal-product-option-info";
import CustomerService from "../../services/customer.service";
import ShippingService from "../../services/shipping.service";
import ConsumerInfo from "../../models/consumer-info";
import PostalProductAdjustmentInfo from "../../models/postal-product-adjustment-info";
import ParcelInfo from '../../models/parcel-info';
import WeightInfo from "../../models/weight-info";
import DimensionInfo from "../../models/dimension-info";
import AddressDisplayInfo from '../../models/address-display-info';
import ParcelProductInfo from '../../models/parcel-product-info';
import ParcelOptionInfo from '../../models/parcel-option-info';
import {initOptionsUI} from "../../ui/ui";

@Component({
    selector: 'fp-shipping-options',
    templateUrl: 'assets/templates/shipping/shipping.options.component.html',
    providers: [
        CustomerService
    ]
})

/**
 * Shipping options component.
 */
export default class ShippingOptionsComponent implements AfterViewInit, OnChanges {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when label should be bought.
     * @type {EventEmitter<boolean>}
     */
    @Output() onBuyLabel: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalOptionSelect') modalOptionSelect: ModalComponent;

    /**
     * Parcel.
     */
    @Input() dimensions: DimensionInfo;
    @Input() weight: WeightInfo;
    prevParcel: PostalProductInfo;
    @Input() parcel: PostalProductInfo;
    @Input() isDocument: boolean;
    @Input() shippingPoint: string;
    @Input() recipient: AddressDisplayInfo;
    @Input() canBuy: () => boolean = () => true;
    @Output() parcelChange: EventEmitter<PostalProductInfo> = new EventEmitter<PostalProductInfo>();

    /**
     * Consumer information.
     */
    consumer: ConsumerInfo;

    /**
     * Options.
     */
    availableOptions: Array<PostalProductOptionInfo>;
    @Input() selectedOptions: Array<PostalProductOptionInfo>;
    @Output() selectedOptionsChange: EventEmitter<Array<PostalProductOptionInfo>> = 
        new EventEmitter<Array<PostalProductOptionInfo>>();

    /**
     * State for running confirmation.
     */
    confirmationRunning: boolean;

    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     */
    constructor(private customerService: CustomerService,
                private shippingService: ShippingService) {
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

    ngOnChanges(changes: any) {
        if (this.parcel) {
            if (changes.parcel && changes.parcel.previousValue) {
                const prev: PostalProductInfo = changes.parcel.previousValue;
                if ((this.parcel.Code === prev.Code && !this.availableOptions) || this.parcel.Code !== prev.Code) {
                    this.availableOptions = _.cloneDeep(this.parcel.Price.Options);
                }
            } else if (changes.parcel) {
                this.availableOptions = _.cloneDeep(this.parcel.Price.Options);
            }
        }
    }

    /**
     * Confirm options on save.
     * @returns {null} 
     */
    public confirmOptions() {
        const parcelInfo = new ParcelInfo()
        parcelInfo.Characteristic.Dimension = this.dimensions;
        parcelInfo.Characteristic.Weight = this.weight;
        parcelInfo.Characteristic.IsDocument = this.isDocument;
        parcelInfo.PostalCode = this.shippingPoint.replace(/ /g, '');
        parcelInfo.Destination.PostalCode = this.recipient.ZipCode.replace(/ /g, '');
        if (!parcelInfo.Product) {
            parcelInfo.Product = new ParcelProductInfo();
        }
        parcelInfo.Product.Code = this.parcel.Code;

        parcelInfo.Product.Options = this.selectedOptions.map((o: PostalProductOptionInfo) => {
            const option = new ParcelOptionInfo();
            option.Code = o.Code;
            option.Amount = o.Amount;
            return option;
        });

        this.confirmationRunning = true;
        this.shippingService.calculate(parcelInfo).subscribe(
            (parcel: PostalProductInfo) => {
                this.confirmationRunning = false;
                this.parcelChange.emit(parcel);
                this.selectedOptionsChange.emit(this.selectedOptions);
                this.modalOptionSelect.close();
            }, 
            (error: Error) => {
                this.selectedOptions = [];
                this.selectedOptionsChange.emit(this.selectedOptions);
                this.onError.emit(error);
                this.confirmationRunning = false;
                this.modalOptionSelect.close();
            });
    }

    /**
     * Get the options that should be displayed (reduced list).
     * @returns {string}
     */
    private getDisplayOptions() {
        return this.selectedOptions
            .map((option: PostalProductOptionInfo) => {
                let display = option.Name;
                if (option.Amount > 0) {
                    display += ` (${option.Amount})`
                }
                return display;
            })
            .join(', ');
    }

    /**
     * Executed when a option is selected.
     * @param {PostalProductOptionInfo} option the option to be selected
     * @param {boolean} checked true if it is check, false if not
     */
    private selectOption(option: PostalProductOptionInfo, checked) {
        if (checked) {
            // TODO option dependency
            if (option.Details) {
                option.Amount = option.Details.IncludedAmount;
            }
            this.selectedOptions.push(option);

            // TODO option dependency
            if (option.Code !== 'DC' 
                && !this.selectedOptions.find((o: PostalProductOptionInfo) => o.Code === 'DC')) {
                this.selectedOptions.push(
                    this.parcel.Price.Options.find((o: PostalProductOptionInfo) => o.Code === 'DC'));
            }
        } else {
            this.selectedOptions = this.selectedOptions.filter(
                (r: PostalProductOptionInfo) => r.Code !== option.Code);

            // TODO option dependency
            if (this.selectedOptions.length > 0 
                && !this.selectedOptions.find((o: PostalProductOptionInfo) => o.Code === 'DC')) {
                this.selectedOptions.push(
                    this.parcel.Price.Options.find((o: PostalProductOptionInfo) => o.Code === 'DC'));
            }
        }
    }

    /**
     * Checks if the option must be selected.
     * @returns {boolean}
     */
    private mustBeSelected(option: PostalProductOptionInfo) {
        // TODO option dependency
        return option.Code === 'DC' 
            && this.selectedOptions.filter((o: PostalProductOptionInfo) => o.Code !== 'DC').length > 0;
    }

    /**
     * Get the extra service costs based on the selected options.
     * @returns {number}
     */
    private getExtraServiceCosts() {
        let costs = this.parcel.Price.Adjustments.reduce((p, r: PostalProductAdjustmentInfo) => p + r.Cost, 0);
        if (this.selectedOptions.length > 0) {
            costs += this.parcel.Price.Options
                .filter(r => !!this.selectedOptions.find((o: PostalProductOptionInfo) => o.Code === r.Code))
                .reduce((p, r: PostalProductOptionInfo) => p + (r.Price || 0), 0);
        }
        return costs;
    }

    /**
     * Check if the option is already selected/active.
     * @returns {boolean} true if option is already activated
     */
    private isOptionActive(option: PostalProductOptionInfo) {
        return !!this.selectedOptions.find((o: PostalProductOptionInfo) => o.Code == option.Code);
    }

    /**
     * Emits the buy event.
     */
    private buyLabel() {
        this.onBuyLabel.emit(true);
    }
}