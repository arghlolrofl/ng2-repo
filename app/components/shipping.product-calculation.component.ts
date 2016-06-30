import {Component, Output, EventEmitter, ViewChild, Input} from '@angular/core';
import {ControlGroup, FormBuilder, Validators, Control} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import AddressService from "../services/address.service";
import ShippingService from "../services/shipping.service";
import ParcelInfo from "../models/parcel-info";
import {ESizeUnit} from "../models/esize-info";
import {EWeightUnit} from "../models/eweight-unit";
import PostalProductInfo from "../models/postal-product-info";
import ShippingProductCalculationShortcutsComponent from "./shipping.product-calculation.shortcuts.component";
import DimensionInfo from "../models/dimension-info";
import WeightInfo from "../models/weight-info";
import ShortcutInfo from "../models/shortcut-info";
import AddressDisplayInfo from "../models/address-display-info";

@Component({
    selector: 'fp-shipping-product-calculation',
    templateUrl: 'app/templates/shipping.product-calculation.component.html',
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

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when the parcel info has changed.
     * @type {EventEmitter}
     */
    @Output()
    public parcelChange:EventEmitter<PostalProductInfo> = new EventEmitter();

    /**
     * Sender.
     */
    @Input()
    public sender:AddressDisplayInfo;

    /**
     * Shipping Point.
     */
    @Input()
    public shippingPoint:string;

    /**
     * Recipient.
     */
    @Input()
    public recipient:AddressDisplayInfo;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalProductSelect')
    private modalProductSelect:ModalComponent;

    /**
     * Updated when the dimensions changed.
     * @type {EventEmitter}
     */
    public dimensionsChange:EventEmitter<DimensionInfo> = new EventEmitter();

    /**
     * Updated when the weight changed.
     * @type {EventEmitter}
     */
    public weightChange:EventEmitter<WeightInfo> = new EventEmitter();

    /**
     * Updated when is document changed.
     * @type {EventEmitter}
     */
    public isDocumentChange:EventEmitter<boolean> = new EventEmitter();

    /**
     * The form for product calculation.
     */
    private productCalculationForm:ControlGroup;

    /**
     * The dimensions.
     */
    private dimensions:DimensionInfo;

    /**
     * The weight.
     */
    private weight:WeightInfo;

    /**
     * Defines if the package is a document and has no dimensions.
     * @type {boolean}
     */
    private isDocument:boolean = false;

    /**
     * Parcel information.
     */
    private parcel:PostalProductInfo;

    /**
     * Parcel Suggestions.
     */
    private parcelSuggestions:Array<PostalProductInfo>;

    /**
     * @constructor
     * @param {ShippingService} shippingService the shipping information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private shippingService:ShippingService,
                private formBuilder:FormBuilder) {
        this.dimensions = new DimensionInfo();
        this.dimensions.Height = 0;
        this.dimensions.Width = 0;
        this.dimensions.Length = 0;
        this.weight = new WeightInfo();
        this.weight.Value = 0;
        this.parcelSuggestions = [];
        // initialize product calculation
        this.productCalculationForm = formBuilder.group({
            'weight': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'length': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'width': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])],
            'height': ['', Validators.compose([
                Validators.required,
                Validators.pattern('[0-9]+(\.[0-9]{1,}?)?')
            ])]
        });

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.productCalculationForm.controls['weight'].valueChanges
            .filter((term:string) => !!term)
            .filter(() => this.productCalculationForm.controls['weight'].valid)
            .distinctUntilChanged()
            .map((term:string) => term.replace(',', '.'))
            .debounceTime(400)
            .subscribe(
                (text:string) => {
                    this.weight.Value = parseFloat(text);
                    this.weightChange.emit(this.weight);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        this.productCalculationForm.controls['length'].valueChanges
            .filter((term:string) => !!term)
            .filter(() => this.productCalculationForm.controls['length'].valid)
            .distinctUntilChanged()
            .map((term:string) => term.replace(',', '.'))
            .debounceTime(400)
            .subscribe(
                (text:string) => {
                    this.dimensions.Length = parseFloat(text);
                    this.dimensionsChange.emit(this.dimensions);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        this.productCalculationForm.controls['width'].valueChanges
            .filter((term:string) => !!term)
            .filter(() => this.productCalculationForm.controls['width'].valid)
            .map((term:string) => term.replace(',', '.'))
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe(
                (text:string) => {
                    this.dimensions.Width = parseFloat(text);
                    this.dimensionsChange.emit(this.dimensions);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        this.productCalculationForm.controls['height'].valueChanges
            .filter((term:string) => !!term)
            .filter(() => this.productCalculationForm.controls['height'].valid)
            .map((term:string) => term.replace(',', '.'))
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe(
                (text:string) => {
                    this.dimensions.Height = parseFloat(text);
                    this.dimensionsChange.emit(this.dimensions);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        this.dimensionsChange.subscribe((dimension:DimensionInfo) => {
            (<Control> this.productCalculationForm.controls['length']).updateValue(dimension.Length, {emitEvent: false});
            (<Control> this.productCalculationForm.controls['width']).updateValue(dimension.Width, {emitEvent: false});
            (<Control> this.productCalculationForm.controls['height']).updateValue(dimension.Height, {emitEvent: false});
        });

        this.weightChange.subscribe((weight:WeightInfo) => {
            (<Control> this.productCalculationForm.controls['weight']).updateValue(weight.Value, {emitEvent: false});
        });

        this.parcelChange.subscribe(
            (r:PostalProductInfo) => this.parcel = r,
            (error:Error) => console.warn(error)); // TODO error handling
    }

    /**
     * Recalculate the currently entered product information.
     */
    public recalculateProduct() {
        if (!this.productCalculationForm.valid && (this.isDocument && this.weight.Value <= 0) &&
            !this.sender || !this.shippingPoint || !this.recipient) {
            return;
        }
        const productInfos = this.productCalculationForm.value;

        let parcelInfo = new ParcelInfo();
        parcelInfo.Characteristic.Dimension.Height = parseFloat(productInfos.height);
        parcelInfo.Characteristic.Dimension.Length = parseFloat(productInfos.length);
        parcelInfo.Characteristic.Dimension.Width = parseFloat(productInfos.width);
        parcelInfo.Characteristic.Dimension.Unit = ESizeUnit.Centimeter;
        parcelInfo.Characteristic.Weight.Value = parseFloat(productInfos.weight);
        parcelInfo.Characteristic.Weight.Unit = EWeightUnit.Kg;
        parcelInfo.PostalCode = this.shippingPoint.replace(/ /g, '');
        parcelInfo.Destination.PostalCode = this.recipient.ZipCode.replace(/ /g, '');

        const parcelObservable = this.shippingService.calculate(parcelInfo);
        parcelObservable
            .first()
            .subscribe(
                (r:PostalProductInfo) => this.parcelChange.emit(r),
                (error) => {
                    this.parcelChange.emit(null);
                    this.onError.emit(error)
                });
        parcelObservable
            .subscribe(
                (r:PostalProductInfo) => this.parcelSuggestions.push(r),
                (error:Error) => this.onError.emit(error));
    }

    /**
     * Document status changed.
     */
    public changeIsDocument() {
        this.isDocument = !this.isDocument;
        this.isDocumentChange.emit(this.isDocument);
        this.clearLength();
        this.clearWidth();
        this.clearHeight();
    }

    /**
     * Clear weight.
     */
    public clearWeight() {
        (<Control> this.productCalculationForm.controls['weight']).updateValue('');
        this.weight.Value = 0;
        this.weightChange.emit(this.weight);
    }

    /**
     * Clear length.
     */
    public clearLength() {
        (<Control> this.productCalculationForm.controls['length']).updateValue('');
        this.dimensions.Length = 0;
        this.dimensionsChange.emit(this.dimensions);
    }

    /**
     * Clear width.
     */
    public clearWidth() {
        (<Control> this.productCalculationForm.controls['width']).updateValue('');
        this.dimensions.Width = 0;
        this.dimensionsChange.emit(this.dimensions);
    }

    /**
     * Clear height.
     */
    public clearHeight() {
        (<Control> this.productCalculationForm.controls['height']).updateValue('');
        this.dimensions.Height = 0;
        this.dimensionsChange.emit(this.dimensions);
    }

    /**
     * Checks if the calculation can be done.
     * @returns {boolean}
     */
    public canCalculate() {
        return this.weight.Value > 0 &&
            ((this.dimensions.Height > 0 && this.dimensions.Width > 0 && this.dimensions.Length > 0) || this.isDocument)
    }

    /**
     * Shortcut has been clicked.
     * @param {ShortcutInfo} shortcut the selected shortcut
     */
    public shortcutSelected(shortcut:ShortcutInfo) {
        this.dimensions = shortcut.Dimensions;
        this.weight = shortcut.Weight;

        this.dimensionsChange.emit(this.dimensions);
        this.weightChange.emit(this.weight);
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
