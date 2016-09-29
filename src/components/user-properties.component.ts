import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import CustomerService from "../services/customer.service";
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
export default class UserPropertiesComponent {
    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Consumer information.
     */
    consumer: ConsumerInfo;

    loginName:  string = "";
    customerNo: string = "";
    /**
     * @constructor
     * @param {CustomerService} customerService the customer client
     */
    constructor(private customerService: CustomerService) {
        this.customerService.getConsumerInfo().subscribe(
            (r: ConsumerInfo) => { this.loginName = r.Login; this.customerNo = r.Customer.CustomerNumber; },
            (error: Error) => this.onError.emit(error));
    }
}