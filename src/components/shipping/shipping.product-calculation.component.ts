import {Component, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import * as _ from 'lodash';

import AddressService from "../../services/address.service";
import ShippingService from "../../services/shipping.service";
import ParcelInfo from "../../models/parcel-info";
import PostalProductInfo from "../../models/postal-product-info";
import DimensionInfo from "../../models/dimension-info";
import WeightInfo from "../../models/weight-info";
import ShortcutInfo from "../../models/shortcut-info";
import AddressDisplayInfo from "../../models/address-display-info";

@Component({
    selector: 'fp-shipping-product-calculation',
    templateUrl: 'assets/templates/shipping/shipping.product-calculation.component.html',
    providers: [
        AddressService,
        ShippingService
    ]
})

/**
 * Shipping Product Calculation component.
 */
export default class ShippingProductCalculationComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Sender.
     */
    @Input() sender: AddressDisplayInfo;

    /**
     * Shipping Point.
     */
    @Input() shippingPoint: string;

    /**
     * Recipient.
     */
    @Input() recipient: AddressDisplayInfo;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalProductSelect') modalProductSelect: ModalComponent;

    /**
     * Parcel.
     */
    parcelInfo: ParcelInfo = new ParcelInfo();
    parcel: PostalProductInfo;
    parcelSuggestions: Array<PostalProductInfo> = [];
    @Output() parcelChange: EventEmitter<PostalProductInfo> = new EventEmitter<PostalProductInfo>();

    /**
     * Parcel Information.
     */
    validWeightInput: boolean = true;
    weightInputChange: EventEmitter<number> = new EventEmitter<number>();
    validLengthInput: boolean = true;
    lengthInputChange: EventEmitter<number> = new EventEmitter<number>();
    validWidthInput: boolean = true;
    widthInputChange: EventEmitter<number> = new EventEmitter<number>();
    validHeightInput: boolean = true;
    heightInputChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() dimensionsChange: EventEmitter<DimensionInfo> = new EventEmitter<DimensionInfo>();
    @Output() weightChange: EventEmitter<WeightInfo> = new EventEmitter<WeightInfo>();
    isDocumentChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Defines if calculation is running or not.
     * @type {boolean}
     */
    calculationRunning: boolean = false;

    /**
     * @constructor
     * @param {ShippingService} shippingService the shipping information service
     */
    constructor(private shippingService: ShippingService) {
        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        const resetParcel = () => {
            this.parcelSuggestions = [];
            this.parcelChange.emit(null);
        };

        this.weightInputChange.subscribe((value: string) => {
            resetParcel();

            const num = this.parseNumber(value);
            if (num || value === '') {
                this.validWeightInput = true;
                this.parcelInfo.Characteristic.Weight.Value = num || null;
                this.weightChange.emit(this.parcelInfo.Characteristic.Weight);
            } else {
                this.validWeightInput = false;
            }
        });

        this.lengthInputChange.subscribe((value: string) => {
            resetParcel();

            const num = this.parseNumber(value);
            if (num || value === '') {
                this.validLengthInput = true;
                this.parcelInfo.Characteristic.Dimension.Length = num;
                this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            } else {
                this.validLengthInput = false;
            }
        });

        this.widthInputChange.subscribe((value: string) => {
            resetParcel();
            
            const num = this.parseNumber(value);
            if (num || value === '') {
                this.validWidthInput = true;
                this.parcelInfo.Characteristic.Dimension.Width = num;
                this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            } else {
                this.validWidthInput = false;
            }
        });

        this.heightInputChange.subscribe((value: string) => {
            resetParcel();

            const num = this.parseNumber(value);
            if (num || value === '') {
                this.validHeightInput = true;
                this.parcelInfo.Characteristic.Dimension.Height = num;
                this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            } else {
                this.validHeightInput = false;
            }
        });

        this.isDocumentChange.subscribe((value: boolean) => {
            resetParcel();

            this.parcelInfo.Characteristic.IsDocument = value;
            this.lengthInputChange.emit(null);
            this.widthInputChange.emit(null);
            this.heightInputChange.emit(null);
        });

        this.parcelChange.subscribe(
            (r: PostalProductInfo) => this.parcel = r,
            (error: Error) => this.onError.emit(error));
    }

    /**
     * Recalculate the currently entered product information.
     */
    public recalculateProduct() {
        if (!this.canCalculate()) {
            return;
        }
        this.calculationRunning = true;

        this.parcelInfo.PostalCode = this.shippingPoint.replace(/ /g, '');
        this.parcelInfo.Destination.PostalCode = this.recipient.ZipCode.replace(/ /g, '');

        this.parcelSuggestions = [];
        const parcelObservable = this.shippingService.calculate(this.parcelInfo).share();
        parcelObservable
            .first()
            .subscribe(
            (r: PostalProductInfo) => {
                this.parcelChange.emit(r);
                this.calculationRunning = false;
                this.modalProductSelect.open();
            },
            (error) => {
                this.parcelChange.emit(null);
                this.onError.emit(error);
                this.calculationRunning = false;
            });
        parcelObservable
            .subscribe(
            (r: PostalProductInfo) => this.parcelSuggestions.push(r),
            (error: Error) => this.onError.emit(error));
    }

    /**
     * Checks if the calculation can be done.
     * @returns {boolean}
     */
    public canCalculate() {
        return !this.calculationRunning &&
            ((this.parcelInfo.Characteristic.Dimension.Height > 0 &&
                this.parcelInfo.Characteristic.Dimension.Width > 0 &&
                this.parcelInfo.Characteristic.Dimension.Length > 0) || this.parcelInfo.Characteristic.IsDocument) &&
            this.parcelInfo.Characteristic.Weight.Value > 0 &&
            (!!this.sender && !!this.shippingPoint && !!this.recipient);
    }

    /**
     * Shortcut has been clicked.
     * @param {ShortcutInfo} shortcut the selected shortcut
     */
    public shortcutSelected(shortcut: ShortcutInfo) {
        this.parcelInfo.Characteristic.Dimension = _.cloneDeep(shortcut.Dimensions);
        this.parcelInfo.Characteristic.Weight = _.cloneDeep(shortcut.Weight);
        this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
        this.weightChange.emit(this.parcelInfo.Characteristic.Weight);
    }

    /**
     * Parcel has been selected from suggestions.
     * @param {PostalProductInfo} parcel the selected parcel
     */
    public parcelSelected(parcel: PostalProductInfo) {
        this.parcelChange.emit(parcel);
        this.modalProductSelect.close();
    }

    /**
     * Parse a number if valid.
     * @param {string} input the possible number
     * @return {number}
     */
    private parseNumber(input: string): number {
        const n = parseFloat(input);
        if (input && input.match(/^[0-9]+(\.?[0-9]+)?$/) && !Number.isNaN(n) && Number.isFinite(n)) {
            return n;
        }
        return null;
    }
}
