import {Component, Output, EventEmitter} from '@angular/core';
import {ControlGroup, FormBuilder, Validators, Control} from '@angular/common';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressService from "../services/address.service";
import ShippingService from "../services/shipping.service";
import ParcelInfo from "../models/parcel-info";
import {ESizeUnit} from "../models/esize-info";
import {EWeightUnit} from "../models/eweight-unit";
import PostalProductInfo from "../models/postal-product-info";
import ShippingProductCalculationShortcutsComponent from "./shipping.product-calculation.shortcuts.component";
import DimensionInfo from "../models/dimension-info";
import WeightInfo from "../models/weight-info";

@Component({
    selector: 'fp-shipping-product-calculation',
    templateUrl: 'app/templates/shipping.product-calculation.component.html',
    directives: [
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
     * Updated when the dimensions changed.
     * @type {EventEmitter}
     */
    @Output()
    public dimensionsChange:EventEmitter<DimensionInfo> = new EventEmitter();

    /**
     * Updated when the weight changed.
     * @type {EventEmitter}
     */
    @Output()
    public weightChange:EventEmitter<WeightInfo> = new EventEmitter();

    /**
     * Updated when is document changed.
     * @type {EventEmitter}
     */
    @Output()
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
            .map((term:string) => term.replace(',', '.'))
            .distinctUntilChanged()
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
            .map((term:string) => term.replace(',', '.'))
            .distinctUntilChanged()
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
    }

    /**
     * Recalculate the currently entered product information.
     */
    public recalculateProduct() {
        if (!this.productCalculationForm.valid) {
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

        this.shippingService.calculate(parcelInfo)
            .subscribe(
                (postalProductInfo:PostalProductInfo) => console.log(postalProductInfo), // TODO do something
                (error) => this.onError.emit(error));
    }

    /**
     * Document status changed.
     */
    public changeIsDocument() {
        this.isDocument = !this.isDocument;
        this.isDocumentChange.emit(this.isDocument);
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
}
