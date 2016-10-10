import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountCustomerFilter from '../../../models/account-customer/account-customer-filter';

@Component({
    selector: 'fp-administration-account-customer-filter',
    templateUrl: 'assets/templates/administration/account-customer/account-customer.filter.component.html',
    styles: [
        '.height-40 { height: 40px; }'
    ]
})

export default class UsersTableFilterComponent {
    //#region Input

    @Input() loginFilter: string;
    @Input() roleFilter: string;

    //#endregion

    //#region Output

    @Output() applyFilterRequested: EventEmitter<AccountCustomerFilter> = new EventEmitter<AccountCustomerFilter>();

    //#endregion

    //#region Properties

    get LoginFilter(): string { return this.loginFilter; }
    set LoginFilter(val: string) {
        this.loginFilter = val;
    }

    get RoleFilter(): string { return this.roleFilter; }
    set RoleFilter(val: string) {
        this.roleFilter = val;
    }

    //#endregion

    /**
     * Emits an event, that a new filter should be applyed
     */
    private applyFilter(): void {
        let filter = new AccountCustomerFilter();

        if (this.hasValue(this.loginFilter))
            filter.Login = this.loginFilter;

        if (this.hasValue(this.roleFilter))
            filter.Role = this.roleFilter;

        this.applyFilterRequested.emit(filter);
    }

    private hasValue(text: string) {
        return typeof text != 'undefined' && text != null;
    }
}