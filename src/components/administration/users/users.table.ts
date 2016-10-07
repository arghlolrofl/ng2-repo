﻿import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountCustomer from '../../../models/users/account-customer';

@Component({
    selector: 'fp-administration-users-table',
    templateUrl: 'assets/templates/administration/users/users.table.html',
    styles: [
        'table { width: 100%; }',
        'table thead tr th { font-weight: bold; }',
        '.cell-button { width: 50px; height: 25px; margin-top: 5px; margin-bottom: 5px; }'
    ]
})

export default class UsersTableComponent {
    //#region Input

    @Input()
    items: Array<AccountCustomer>;

    //#endregion

    //#region Output

    @Output()
    showDetails: EventEmitter<AccountCustomer> = new EventEmitter<AccountCustomer>();

    //#endregion

    private implodeRoles(accountCustomer: AccountCustomer): string {
        return accountCustomer.Roles.map(r => r.RoleName).join(', ');
    }
}