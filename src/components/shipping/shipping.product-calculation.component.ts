import {Component, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import ShippingProductCalculationShortcutsComponent from "./shipping.product-calculation.shortcuts.component";
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
    directives: [
        MODAL_DIRECTIVES,
        ShippingProductCalculationShortcutsComponent
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        AddressService,
        ShippingService
    ]
})

/**
 * Shipping Product Calculation component.
 */
export default class ShippingProductCalculationComponent {

    @Output() onError:EventEmitter<Error> = new EventEmitter();

    /**
     * Sender.
     */
    @Input() sender:AddressDisplayInfo;

    /**
     * Shipping Point.
     */
    @Input() shippingPoint:string;

    /**
     * Recipient.
     */
    @Input() recipient:AddressDisplayInfo;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalProductSelect') modalProductSelect:ModalComponent;

    /**
     * Parcel.
     */
    parcelInfo:ParcelInfo = new ParcelInfo();
    parcel:PostalProductInfo;
    parcelSuggestions:Array<PostalProductInfo> = [];
    @Output() parcelChange:EventEmitter<PostalProductInfo> = new EventEmitter();

    /**
     * Parcel Information.
     */
    weightInputChange:EventEmitter<number> = new EventEmitter();
    lengthInputChange:EventEmitter<number> = new EventEmitter();
    widthInputChange:EventEmitter<number> = new EventEmitter();
    heightInputChange:EventEmitter<number> = new EventEmitter();
    @Output() dimensionsChange:EventEmitter<DimensionInfo> = new EventEmitter();
    @Output() weightChange:EventEmitter<WeightInfo> = new EventEmitter();
    isDocumentChange:EventEmitter<boolean> = new EventEmitter();

    /**
     * Defines if calculation is running or not.
     * @type {boolean}
     */
    calculationRunning:boolean = false;

    /**
     * @constructor
     * @param {ShippingService} shippingService the shipping information service
     */
    constructor(private shippingService:ShippingService) {
        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.weightInputChange.subscribe((value:number) => {
            this.parcelInfo.Characteristic.Weight.Value = value;
            this.weightChange.emit(this.parcelInfo.Characteristic.Weight);
            this.parcelSuggestions = [];
            this.parcelChange.emit(null);
        });

        this.lengthInputChange.subscribe((value:number) => {
            this.parcelInfo.Characteristic.Dimension.Length = value;
            this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            this.parcelSuggestions = [];
            this.parcelChange.emit(null);
        });

        this.widthInputChange.subscribe((value:number) => {
            this.parcelInfo.Characteristic.Dimension.Width = value;
            this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            this.parcelSuggestions = [];
            this.parcelChange.emit(null);
        });

        this.heightInputChange.subscribe((value:number) => {
            this.parcelInfo.Characteristic.Dimension.Height = value;
            this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
            this.parcelSuggestions = [];
            this.parcelChange.emit(null);
        });

        this.isDocumentChange.subscribe((value:boolean) => {
            this.parcelInfo.Characteristic.IsDocument = value;
            this.lengthInputChange.emit(null);
            this.widthInputChange.emit(null);
            this.heightInputChange.emit(null);
        });

        this.parcelChange.subscribe(
            (r:PostalProductInfo) => this.parcel = r,
            (error:Error) => this.onError.emit(error));
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
                (r:PostalProductInfo) => {
                    this.parcelChange.emit(r);
                    this.calculationRunning = false;
                },
                (error) => {
                    this.parcelChange.emit(null);
                    this.onError.emit(error);
                    this.calculationRunning = false;
                });
        parcelObservable
            .subscribe(
                (r:PostalProductInfo) => this.parcelSuggestions.push(r),
                (error:Error) => this.onError.emit(error));
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
    public shortcutSelected(shortcut:ShortcutInfo) {
        this.parcelInfo.Characteristic.Dimension = shortcut.Dimensions;
        this.parcelInfo.Characteristic.Weight = shortcut.Weight;
        this.dimensionsChange.emit(this.parcelInfo.Characteristic.Dimension);
        this.weightChange.emit(this.parcelInfo.Characteristic.Weight);
    }

    /**
     * Parcel has been selected from suggestions.
     * @param {PostalProductInfo} parcel the selected parcel
     */
    public parcelSelected(parcel:PostalProductInfo) {
        this.parcelChange.emit(parcel);
        this.modalProductSelect.close();
    }
}
