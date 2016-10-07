import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountInvoiceInfo from '../../../models/invoices/account-invoice-info';

@Component({
    selector: 'fp-administration-account-invoice-table',
    templateUrl: 'assets/templates/administration/invoices/account-invoice.table.html',
    styles: [
        'table { width: 100%; }',
        'table thead tr th { font-weight: bold; }',
        '.cell-button { width: 50px; height: 25px; margin-top: 5px; margin-bottom: 5px; }'
    ]
})

export default class AccountInvoiceTableComponent {
    //#region Input

    @Input()
    items: Array<AccountInvoiceInfo>;

    //#endregion

    //#region Output

    @Output()
    showDetails: EventEmitter<AccountInvoiceInfo> = new EventEmitter<AccountInvoiceInfo>();

    //#endregion
}