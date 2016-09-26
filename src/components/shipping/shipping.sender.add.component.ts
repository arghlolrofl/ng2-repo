import {Component, ViewChild, EventEmitter, Input, AfterViewInit} from '@angular/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import CountryService from "../../services/country.service";
import CountryInfo from "../../models/country-info";
import RegionService from "../../services/region.service";
import RegionInfo from "../../models/region-info";
import AddressService from "../../services/address.service";
import AddressCreationInfo from "../../models/address-creation-info";
import ErrorUtils from "../../utils/error-utils";

@Component({
    selector: 'fp-shipping-sender-add',
    templateUrl: 'assets/templates/shipping/shipping.sender.add.component.html',
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

    /**
     * Errors.
     */
    error: Error;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalAddSender') modal: ModalComponent;

    /**
     * Region.
     */
    region: RegionInfo;
    regions: Array<RegionInfo> = [];

    /**
     * Country.
     */
    country: CountryInfo;
    countries: Array<CountryInfo> = [];

    /**
     * The address to store.
     * @type {AddressCreationInfo}
     */
    address: AddressCreationInfo = new AddressCreationInfo();

    /**
     * @constructor
     * @param {RegionService} regionService the region client
     * @param {CountryService} countryService the country client
     * @param {AddressService} addressService the address client
     */
    constructor(private regionService: RegionService,
        private countryService: CountryService,
        private addressService: AddressService) {
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

            const countryObservable = this.countryService.getAll().share();
            countryObservable.first().subscribe(
                (r: CountryInfo) => {
                    this.country = r;
                    this.refreshRegions(r.Id);
                    this.address.CountryId = this.country.Id;
                },
                (error: Error) => {
                    this.error = ErrorUtils.toError(error);
                    this.regions = [];
                });
            countryObservable
                .subscribe(
                (r: CountryInfo) => this.countries.push(r),
                () => this.countries = []);
        });
    }

    /**
     * Refresh the regions by country id.
     * @param {number} countryId the country id
     */
    private refreshRegions(countryId: number) {
        this.regions = [];
        const regionObservable = this.regionService.getFilteredByCountryId(countryId).share();
        regionObservable.first().subscribe(
            (r: RegionInfo) => {
                this.region = r;
                this.address.Region = this.region.RegionName;
                this.address.RegionAbbreviation = this.region.RegionAbbreviation;
            },
            (error: Error) => { 
                this.error = ErrorUtils.toError(error);
                this.address.RegionAbbreviation = null;
            });
        regionObservable
            .subscribe(
            (r: RegionInfo) => this.regions.push(r),
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
        this.addressService.addNewToAddressGroup('Sender', this.address).subscribe(
            () => {
                this.modal.close();
                this.address = new AddressCreationInfo();
            },
            (error: Error) => this.error = ErrorUtils.toError(error));
    }

    /**
     * Executed when region changes.
     * @param {string} regionName the name of the region
     */
    public regionChanged(regionName: string) {
        this.region = this.regions.find((r: RegionInfo) => r.RegionName === regionName);
        this.address.Region = this.region.RegionName;
        this.address.RegionAbbreviation = this.region.RegionAbbreviation;
    }

    /**
     * Executed when the country changes.
     * @param {string} countryName the name of the country
     */
    public countryChanged(countryName: string) {
        this.country = this.countries.find((r: CountryInfo) => r.CountryName === countryName);
        this.refreshRegions(this.country.Id);
        this.address.CountryId = this.country.Id;
    }
}
