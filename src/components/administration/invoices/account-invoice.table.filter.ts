import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountInvoiceFilter from '../../../models/invoices/account-invoice-filter';

@Component({
    selector: 'fp-administration-account-invoice-table-filter',
    templateUrl: 'assets/templates/administration/invoices/account-invoice.table.filter.html',
    styles: [
        '.height-40 { height: 40px; }'
    ]
})

export default class AccountInvoiceTableFilterComponent {
    //#region Input

    @Input() invoiceNumberFilter: string;
    @Input() dateStartFilter: Date;
    @Input() dateEndFilter: Date;

    //#endregion

    //#region Output

    @Output() applyFilterRequested: EventEmitter<AccountInvoiceFilter> = new EventEmitter<AccountInvoiceFilter>();

    //#endregion

    //#region Properties

    get InvoiceNumberFilter(): string { return this.invoiceNumberFilter; }
    set InvoiceNumberFilter(val: string) {
        this.invoiceNumberFilter = val;
    }

    get DateStartFilter(): Date { return this.dateStartFilter; }
    set DateStartFilter(val: Date) {
        this.dateStartFilter = val;
    }

    get DateEndFilter(): Date { return this.dateEndFilter; }
    set DateEndFilter(val: Date) {
        this.dateEndFilter = val;
    }

    //#endregion

    /**
     * Emits an event, that a new filter should be applyed
     */
    private applyFilter(): void {
        let filter = new AccountInvoiceFilter();

        if (this.hasValue(this.invoiceNumberFilter))
            filter.InvoiceNumber = this.invoiceNumberFilter;

        if (this.dateStartFilter != null)
            filter.DateRangeFrom = this.dateStartFilter;

        if (this.dateEndFilter != null)
            filter.DateRangeUntil = this.dateEndFilter;

        this.applyFilterRequested.emit(filter);
    }

    private hasValue(text: string) {
        return typeof text != 'undefined' && text != null;
    }
}