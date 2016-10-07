import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountCustomer from '../../../models/users/account-customer';
import AccountCustomerFilter from '../../../models/users/account-customer-filter';
import AccountCustomerFilterRequest from '../../../models/users/account-customer-filter-request';
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
    templateUrl: 'assets/templates/administration/users/users.component.html',
    styles: [

    ],
    providers: [
        AccountCustomerService
    ]
})

export default class UsersComponent {
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
     * Show modal dialog for item details.
     */
    showEditDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();

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

        if (this.selectedResultCount == null) {
            this.accountCustomerService
                .getAllAccountCustomers()
                .subscribe(
                    (response: SortedPagedResults<AccountCustomer>) => {
                        this.accountCustomers = response.ItemList;
                        this.isLoading = false;
                        this.TotalResultCount = response.TotalItemCount;
                    },
                    (error: Error) => {
                        this.isLoading = false;
                        console.error(error);
                    }
                );
        } else {
            let req: AccountCustomerFilterRequest = new AccountCustomerFilterRequest(this.accountCustomerFilter);

            req.ResultCount = this.selectedResultCount;

            if (this.currentStartIndex != null)
                req.StartValue = this.currentStartIndex;

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
    }

    private accountCustomer_onShowDetails(accountCustomer: AccountCustomer) {
        this.selectedAccountCustomer = accountCustomer;
        this.showEditDialogChange.emit(true);
    }

    private accountCustomer_onCreateNew() {
        this.selectedAccountCustomer = new AccountCustomer();
        this.selectedAccountCustomer.Id = 0;
        this.selectedAccountCustomer.EMailConfirmed = false;
        this.showEditDialogChange.emit(true);
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

}