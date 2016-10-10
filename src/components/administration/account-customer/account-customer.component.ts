import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountCustomer from '../../../models/account-customer/account-customer';
import AccountCustomerFilter from '../../../models/account-customer/account-customer-filter';
import AccountCustomerFilterRequest from '../../../models/account-customer/account-customer-filter-request';
import AccountCustomerService from '../../../services/account-customer.service';
import SortedPagedResults from '../../../models/base/sorted-paged-results';

/**
 * Global window scope.
 * @type {Window}
 */
const w: any = window;

/**
 * Import jQuery from global.
 */
const $ = w.$;

@Component({
    selector: 'fp-administration-user-management',
    templateUrl: 'assets/templates/administration/account-customer/account-customer.component.html',
    styles: [

    ],
    providers: [
        AccountCustomerService
    ]
})

export default class AccountCustomerComponent {
    //#region Fields

    private selectedResultCount: number = 10;
    private totalResultCount: number;
    private error: Error;
    private isLoading: boolean = false;
    private currentPageIndex: number = 1;
    private currentStartIndex: number = 0;
    private accountCustomerService: AccountCustomerService;

    private accountCustomerFilter: AccountCustomerFilter;
    private accountCustomers: Array<AccountCustomer>;
    private selectedAccountCustomer: AccountCustomer;

    //#endregion

    //#region Events

    /**
     * Show modal dialog for edit.
     */
    showEditDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Show modal dialog for create.
     */
    showCreateDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    //#endregion

    //#region Properties

    get SelectedResultCount(): number { return this.selectedResultCount; }
    set SelectedResultCount(val: number) {
        this.selectedResultCount = val;
        this.refreshAccountCustomers();
    }

    get TotalResultCount(): number { return this.totalResultCount; }
    set TotalResultCount(val: number) {
        this.totalResultCount = val;
    }

    public get SelectedAccountCustomer(): AccountCustomer {
        if (typeof this.selectedAccountCustomer === 'undefined')
            return null;
        else
            return this.selectedAccountCustomer;
    }

    //#endregion

    //#region Output

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    //#endregion

    constructor(service: AccountCustomerService) {
        this.accountCustomerService = service;
        this.accountCustomerFilter = new AccountCustomerFilter();
        this.refreshAccountCustomers();
    }


    /**
     * Refreshes the list of cost accounts to be displayed with currently
     * selected filter and paging options
     */
    private refreshAccountCustomers() {
        this.isLoading = true;
        this.selectedAccountCustomer = null;
        let req: AccountCustomerFilterRequest = new AccountCustomerFilterRequest(this.accountCustomerFilter);

        if (this.selectedResultCount != null)
            req.ResultCount = +this.selectedResultCount;

        if (this.currentStartIndex != null)
            req.StartValue = this.currentStartIndex;

        console.info(req);

        this.accountCustomerService
            .getFilteredAccountCustomers(req)
            .subscribe(
            (response: SortedPagedResults<AccountCustomer>) => {
                this.accountCustomers = response.ItemList;
                this.TotalResultCount = response.TotalItemCount;
                this.isLoading = false;
            },
            (error: Error) => {
                this.isLoading = false;
                console.error(error);
            }
            );
    }

    private accountCustomer_onShowDetails(accountCustomer: AccountCustomer) {
        this.selectedAccountCustomer = accountCustomer;
        this.showEditDialogChange.emit(true);
    }

    private accountCustomer_onCreateNew() {
        this.selectedAccountCustomer = new AccountCustomer();
        this.selectedAccountCustomer.Id = 0;
        this.selectedAccountCustomer.EMailConfirmed = false;
        this.showCreateDialogChange.emit(true);
    }

    private accountCustomer_onCreated(accountCustomer: AccountCustomer): void {
        this.refreshAccountCustomers();
    }

    private accountCustomer_onChanged(accountCustomer: AccountCustomer): void {
        this.refreshAccountCustomers();
    }

    private accountCustomer_onDeleted(id: number): void {
        this.refreshAccountCustomers();
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
        this.refreshAccountCustomers();
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
     * @param {CostAccountFilter} filter Filter options
     */
    private filter_onApply(filter: AccountCustomerFilter) {
        this.accountCustomerFilter.Login = filter.Login;
        this.accountCustomerFilter.Role = filter.Role;
        this.refreshAccountCustomers();
    }
}