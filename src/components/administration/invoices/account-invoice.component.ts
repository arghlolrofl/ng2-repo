import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountInvoiceService from '../../../services/account-invoice.service';
import AccountInvoiceFilterRequest from '../../../models/invoices/account-invoice-filter-request';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import AccountInvoiceInfo from '../../../models/invoices/account-invoice-info';
import AccountInvoiceFilter from '../../../models/invoices/account-invoice-filter';
//import SortedPagedRequest from '../../../models/base/sorted-paged-request';

@Component({
    selector: 'fp-administration-account-invoice',
    templateUrl: 'assets/templates/administration/invoices/account-invoice.component.html',
    providers: [
        AccountInvoiceService
    ]
})

/**
 * Administration - Settings component.
 */
export default class AccountInvoiceComponent {
    //#region Fields
    private selectedResultCount: number = 10;
    private totalResultCount: number;
    private error: Error;
    private accountInvoiceService: AccountInvoiceService;
    private accountInvoiceList: Array<AccountInvoiceInfo>;
    private accountInvoiceFilter: AccountInvoiceFilter;
    private isLoading: boolean = false;
    private currentPageIndex: number = 1;
    private currentStartIndex: number = 0;
    private selectedAccountInvoice: AccountInvoiceInfo;

    //#endregion

    //#region Events

    /**
     * Show modal dialog for item details.
     */
    showEditDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    //#endregion

    //#region Properties

    get SelectedResultCount(): number { return this.selectedResultCount; }
    set SelectedResultCount(val: number) {
        this.selectedResultCount = val;
        this.refreshAccountInvoices();
    }

    get TotalResultCount(): number { return this.totalResultCount; }
    set TotalResultCount(val: number) {
        this.totalResultCount = val;
    }

    public get SelectedAccountInvoice(): AccountInvoiceInfo {
        if (typeof this.selectedAccountInvoice === 'undefined')
            return null;
        else
            return this.selectedAccountInvoice;
    }

    //#endregion

    //#region Output

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    //#endregion

    /**
     * Creates a new instance of the cost account component
     * @param {AccountInvoiceService} accountInvoiceService
     */
    constructor(accountInvoiceService: AccountInvoiceService) {
        this.accountInvoiceService = accountInvoiceService;
        this.accountInvoiceFilter = new AccountInvoiceFilter();
        this.refreshAccountInvoices();
    }

    /**
     * Refreshes the list of cost accounts to be displayed with currently
     * selected filter and paging options
     */
    private refreshAccountInvoices() {
        this.isLoading = true;
        this.selectedAccountInvoice = null;

        if (this.selectedResultCount == null) {
            this.accountInvoiceService
                .getAllInvoices()
                .subscribe(
                (response: SortedPagedResults<AccountInvoiceInfo>) => {
                    this.accountInvoiceList = response.ItemList;
                    this.isLoading = false;
                    this.TotalResultCount = response.TotalItemCount;
                },
                (error: Error) => {
                    this.isLoading = false;
                    console.error(error);
                }
                );
        } else {
            let req: AccountInvoiceFilterRequest = new AccountInvoiceFilterRequest(this.accountInvoiceFilter);

            req.ResultCount = this.selectedResultCount;

            if (this.currentStartIndex != null)
                req.StartValue = this.currentStartIndex;

            this.accountInvoiceService
                .getFilteredAccountInvoices(req)
                .subscribe(
                    (response: SortedPagedResults<AccountInvoiceInfo>) => {
                        this.accountInvoiceList = response.ItemList;
                        this.TotalResultCount = response.TotalItemCount;
                        this.isLoading = false;
                    },
                    (error: Error) => {
                        this.isLoading = false;
                        console.error(error);
                    }
                );
        }
    }

    //#region Callbacks

    /**
     * Callback method for showing a modal dialog with cost account details
     * @param {AccountInvoiceInfo} accountInvoice The cost account to display details for
     */
    private accountInvoice_onShowDetails(accountInvoice: AccountInvoiceInfo) {
        //TODO: download pdf
    }

    /**
     * Callback method when the number of items to be displayed
     * on a single page has been changed
     * @param {number} count Number of results per page
     */
    private paging_onResultCountChanged(count: number) {
        this.currentPageIndex = 1;
        this.SelectedResultCount = count;
    }

    /**
     * Callback method when the user clicked on next or
     * previous page button
     * @param {number} startIndex New start index
     */
    private paging_onPageChangeRequested(startIndex: number) {
        this.currentStartIndex = startIndex;
        this.refreshAccountInvoices();
    }

    /**
     * Callback method when the page index has changed
     * @param {number} index New page index
     */
    private paging_onPageIndexChanged(index: number) {
        this.currentPageIndex = index;
    }

    /**
     * Callback method when the user has applyed a filter
     * @param {AccountInvoiceFilter} filter Filter options
     */
    private filter_onApply(filter: AccountInvoiceFilter) {
        this.accountInvoiceFilter.InvoiceNumber = filter.InvoiceNumber;
        this.accountInvoiceFilter.DateRangeFrom = filter.DateRangeFrom;
        this.accountInvoiceFilter.DateRangeUntil = filter.DateRangeUntil;
        this.refreshAccountInvoices();
    }

    //#endregion
}