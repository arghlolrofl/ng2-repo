import {NgZone, Component, EventEmitter, Output, AfterViewInit} from '@angular/core';
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

    /**
     * Consumer information.
     */
    //consumer: ConsumerInfo;

    loginName:  string;
    customerNo: string;
    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     */
    constructor(private customerService: CustomerService, private loginService: LoginService, private zone: NgZone) {
    }

    ngAfterViewInit(): void {
        this.loginService.loginChange.subscribe((event) => {
            if (event.loggedIn) {
                this.getCustomerInfo();
            }
        });
    }

    private getCustomerInfo(): void {
        this.customerService.getConsumerInfo().subscribe(
            (r: ConsumerInfo) => this.zone.run(() => { this.loginName = r.Login; this.customerNo = r.Customer.CustomerNumber; }),
            (error: Error) => this.onError.emit(error));
    }
}