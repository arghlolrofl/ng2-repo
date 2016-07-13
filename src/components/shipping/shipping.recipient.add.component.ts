import {Component, ViewChild, EventEmitter, Input, AfterViewInit} from '@angular/core';
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import AddressCreationInfo from "../../models/address-creation-info";
import RegionInfo from "../../models/region-info";
import CountryInfo from "../../models/country-info";
import AddressService from "../../services/address.service";
import CountryService from "../../services/country.service";
import RegionService from "../../services/region.service";
import AddressGroupInfo from "../../models/address-group-info";

@Component({
    selector: 'fp-shipping-recipient-add',
    templateUrl: 'assets/templates/shipping/shipping.recipient.add.component.html',
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
export default class ShippingRecipientAddComponent implements AfterViewInit {

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange:EventEmitter<boolean> = new EventEmitter();
    @ViewChild('modalAddRecipient') modal:ModalComponent;

    /**
     * Region.
     */
    region:RegionInfo;
    regions:Array<RegionInfo> = [];

    /**
     * Country.
     */
    country:CountryInfo;
    countries:Array<CountryInfo> = [];

    /**
     * Address Groups.
     */
    addressGroup:AddressGroupInfo;
    addressGroups:Array<AddressGroupInfo> = [];

    /**
     * The address to store.
     * @type {AddressCreationInfo}
     */
    address:AddressCreationInfo = new AddressCreationInfo();

    /**
     * @constructor
     * @param {RegionService} regionService the region client
     * @param {CountryService} countryService the country client
     * @param {AddressService} addressService the address client
     */
    constructor(private regionService:RegionService,
                private countryService:CountryService,
                private addressService:AddressService) {
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
            this.addressGroups = [];

            const addressGroupObservable = this.addressService.getFilteredAddressGroupsWithout('', 'Sender').share();
            addressGroupObservable.first().subscribe(
                (r:AddressGroupInfo) => this.addressGroup = r,
                () => this.addressGroup = null);
            addressGroupObservable.subscribe(
                (r:AddressGroupInfo) => this.addressGroups.push(r),
                () => this.addressGroups = []);

            const countryObservable = this.countryService.getAll().share();
            countryObservable.first().subscribe(
                (r:CountryInfo) => {
                    this.country = r;
                    this.refreshRegions(r.Id);
                    this.address.CountryId = this.country.Id;
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
        const regionObservable = this.regionService.getFilteredByCountryId(countryId).share();
        regionObservable.first().subscribe(
            (r:RegionInfo) => {
                this.region = r;
                this.address.Region = this.region.RegionName;
                this.address.RegionAbbreviation = this.region.RegionAbbreviation;
            },
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
        this.addressService.addNewToAddressGroup(this.addressGroup.GroupName, this.address).subscribe(
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
        this.address.Region = this.region.RegionName;
        this.address.RegionAbbreviation = this.region.RegionAbbreviation;
    }

    /**
     * Executed when the country changes.
     * @param {string} countryName the name of the country
     */
    public countryChanged(countryName:string) {
        this.country = this.countries.find((r:CountryInfo) => r.CountryName === countryName);
        this.refreshRegions(this.country.Id);
        this.address.CountryId = this.country.Id;
    }

    /**
     * Executed when the address group changes.
     * @param {string} addressGroupName the name of the address group
     */
    public addressGroupChanged(addressGroupName:string) {
        this.addressGroup = this.addressGroups.find((r:AddressGroupInfo) => r.GroupName === addressGroupName);
    }
}
