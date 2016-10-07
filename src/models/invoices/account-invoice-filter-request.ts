import AccountInvoiceFilter from './account-invoice-filter';
import SortingInfo from '../base/sorting-info';

export default class AccountInvoiceFilterRequest extends AccountInvoiceFilter {
    StartValue: number;
    ResultCount: number;
    Sorting: SortingInfo;

    constructor(filter: AccountInvoiceFilter) {
        super();

        if (typeof filter === 'undefined' || filter == null)
            return;

        this.AccountName = filter.AccountName;
        this.DateRangeFrom = filter.DateRangeFrom;
        this.DateRangeUntil = filter.DateRangeUntil;
        this.DebitState = filter.DebitState;
        this.InvoiceNumber = filter.InvoiceNumber;
    }
}