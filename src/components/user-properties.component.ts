import {NgZone, Component, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import CustomerService from "../services/customer.service";
import LoginService from "../services/login.service";
import ConsumerInfo from "../models/consumer-info";


@Component({
    selector: 'fp-user-properties',
    templateUrl: 'assets/templates/user-properties.component.html',
    providers: [
        CustomerService
    ]
})

/**
 * UserProperties component.
 */
export default class UserPropertiesComponent implements AfterViewInit {
    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    //#region Input
    @Input() loginName:  string;
    @Input() customerNo: string;
    //#endregion

    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     * @param {LoginService} loginService login information
     * @param {NgZone} zone a zone to run in.
     */
    constructor(private customerService: CustomerService, private loginService: LoginService, private zone: NgZone) {
    }

    /**
     * Subscribe to loginChange.
     */
    ngAfterViewInit(): void {
        this.getCustomerInfo();
        this.loginService.loginChange.subscribe((event) => {
            if (event.loggedIn) {
                this.getCustomerInfo();
            }
            else {
                this.loginName = "";
                this.customerNo = "";
            }
        });
    }

    /**
     * Get the customer info to display.
     */
    private getCustomerInfo(): void {
        this.customerService.getConsumerInfo().subscribe(
            (r: ConsumerInfo) =>
                this.zone.run(() =>
                    { this.loginName = r.Login; this.customerNo = r.Customer.CustomerNumber; }),
            (error: Error) => this.onError.emit(error));
    }
}