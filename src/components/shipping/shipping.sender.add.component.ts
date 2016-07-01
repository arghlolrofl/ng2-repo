import {Component, ViewChild, EventEmitter, Input, AfterViewInit} from '@angular/core';
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import CountryService from "../../services/country.service";
import CountryInfo from "../../models/country-info";
import RegionService from "../../services/region.service";
import RegionInfo from "../../models/region-info";
import AddressService from "../../services/address.service";
import AddressCreationInfo from "../../models/address-creation-info";

@Component({
    selector: 'fp-shipping-sender-add',
    templateUrl: 'app/templates/shipping/shipping.sender.add.component.html',
    directives: [
        MODAL_DIRECTIVES
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        RegionService,
        CountryService,
        AddressService
    ]
})

/**
 * Shipping Sender component.
 */
export default class ShippingSenderAddComponent implements AfterViewInit {

    @Input()
    public showChange:EventEmitter<boolean>;

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalAddSender')
    private modal:ModalComponent;

    /**
     * Add formula.
     */
    private addForm:ControlGroup;

    /**
     * Regions.
     */
    private regions:Array<RegionInfo>;

    /**
     * Selected region.
     */
    private region:RegionInfo;

    /**
     * Countries.
     */
    private countries:Array<CountryInfo>;

    /**
     * Selected country.
     */
    private country:CountryInfo;

    /**
     * @constructor
     * @param {FormBuilder} formBuilder the angular2 form builder
     * @param {RegionService} regionService the region client
     * @param {CountryService} countryService the country client
     * @param {AddressService} addressService the address client
     */
    constructor(private formBuilder:FormBuilder,
                private regionService:RegionService,
                private countryService:CountryService,
                private addressService:AddressService) {
        this.regions = [];
        this.countries = [];
        this.addForm = formBuilder.group({
            company: [''],
            title: [''],
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            postalAddress: ['', Validators.required],
            additionalPostalAddress: [''],
            city: ['', Validators.required],
            zipCode: ['', Validators.required],
            additionalZipCode: [''],
            eMail: ['', Validators.required]
        });
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

        this.modal.onOpen.subscribe(() => {
            this.countries = [];

            const countryObservable = this.countryService.getAll();
            countryObservable.first().subscribe(
                (r:CountryInfo) => {
                    this.country = r;
                    this.refreshRegions(r.Id);
                },
                () => {
                    this.country = null;
                    this.regions = [];
                });
            countryObservable
                .subscribe(
                    (r:CountryInfo) => this.countries.push(r),
                    () => this.countries = []);
        });
    }

    /**
     * Refresh the regions by country id.
     * @param {number} countryId the country id
     */
    private refreshRegions(countryId:number) {
        this.regions = [];
        const regionObservable = this.regionService.getFilteredByCountryId(countryId);
        regionObservable.first().subscribe(
            (r:RegionInfo) => this.region = r,
            () => this.region = null);
        regionObservable
            .subscribe(
                (r:RegionInfo) => this.regions.push(r),
                () => this.regions = []);
    }

    /**
     * Close modal dialog.
     */
    public close() {
        this.modal.close();

        return false;
    }

    /**
     * Add sender.
     */
    public save() {
        const address = new AddressCreationInfo();
        address.CountryId = this.country.Id;
        address.Region = this.region.RegionName;
        address.RegionAbbreviation = this.region.RegionAbbreviation;
        address.FirstName = this.addForm.controls['firstName'].value;
        address.MiddleName = this.addForm.controls['middleName'].value;
        address.LastName = this.addForm.controls['lastName'].value;
        address.City = this.addForm.controls['city'].value;
        address.Company = this.addForm.controls['company'].value;
        address.Title = this.addForm.controls['title'].value;
        address.PostalAddress = this.addForm.controls['postalAddress'].value;
        address.AdditionalPostalAddress = this.addForm.controls['additionalPostalAddress'].value;
        address.ZipCode = this.addForm.controls['zipCode'].value;
        address.AdditionalZipCode = this.addForm.controls['additionalZipCode'].value;
        address.EMailAddress = this.addForm.controls['eMail'].value;

        this.addressService.addNewToAddressGroup('Sender', address).subscribe(
            () => this.modal.close(),
            (error:Error) => {
                console.warn('address could not be stored', error); // TODO error handling
            });
    }

    /**
     * Exectued when region changes.
     * @param {string} regionName the name of the region
     */
    public regionChanged(regionName:string) {
        this.region = this.regions.find((r:RegionInfo) => r.RegionName === regionName);
    }

    /**
     * Executed when the country changes.
     * @param {string} countryName the name of the country
     */
    public countryChanged(countryName:string) {
        this.country = this.countries.find((r:CountryInfo) => r.CountryName === countryName);
        this.refreshRegions(this.country.Id);
    }
}
