import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountService from '../../../services/cost-account.service';
import CostAccountFilterRequest from '../../../models/cost-account/cost-account-filter-request';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import CostAccountInfo from '../../../models/cost-account/cost-account-info';
import CostAccountFilter from '../../../models/cost-account/cost-account-filter';
//import SortedPagedRequest from '../../../models/base/sorted-paged-request';

@Component({
    selector: 'fp-administration-cost-account',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.component.html',
    providers: [
        CostAccountService
    ]
})

/**
 * Administration - Settings component.
 */
export default class CostAccountComponent {
    //#region Fields
    private selectedResultCount: number = 10;
    private totalResultCount: number;
    private error: Error;
    private costAccountService: CostAccountService;
    private costAccountList: Array<CostAccountInfo>;
    private costAccountFilter: CostAccountFilter;
    private isLoading: boolean = false;
    private currentPageIndex: number = 1;
    private currentStartIndex: number = 0;
    private selectedCostAccount: CostAccountInfo;

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
        this.refreshCostAccounts();
    }

    get TotalResultCount(): number { return this.totalResultCount; }
    set TotalResultCount(val: number) {
        this.totalResultCount = val;
    }

    public get SelectedCostAccount(): CostAccountInfo {
        if (typeof this.selectedCostAccount === 'undefined')
            return null;
        else
            return this.selectedCostAccount;
    }

    //#endregion

    //#region Output

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    //#endregion

    /**
     * Creates a new instance of the cost account component
     * @param {CostAccountService} costAccountService
     */
    constructor(costAccountService: CostAccountService) {
        this.costAccountService = costAccountService;
        this.costAccountFilter = new CostAccountFilter();
        this.refreshCostAccounts();
    }

    /**
     * Refreshes the list of cost accounts to be displayed with currently
     * selected filter and paging options
     */
    private refreshCostAccounts() {
        this.isLoading = true;
        this.selectedCostAccount = null;

        if (this.selectedResultCount == null) {
            this.costAccountService
                .getAllCostCenters()
                .subscribe(
                (response: SortedPagedResults<CostAccountInfo>) => {
                    this.costAccountList = response.ItemList;
                    this.isLoading = false;
                    this.TotalResultCount = response.TotalItemCount;
                },
                (error: Error) => {
                    this.isLoading = false;
                    console.error(error);
                }
                );
        } else {
            let req: CostAccountFilterRequest = new CostAccountFilterRequest(this.costAccountFilter);

            req.ResultCount = this.selectedResultCount;

            if (this.currentStartIndex != null)
                req.StartValue = this.currentStartIndex;

            this.costAccountService
                .getFilteredCostCenters(req)
                .subscribe(
                    (response: SortedPagedResults<CostAccountInfo>) => {
                        this.costAccountList = response.ItemList;
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
     * @param {CostAccountInfo} costAccount The cost account to display details for
     */
    private costAccount_onShowDetails(costAccount: CostAccountInfo) {
        this.selectedCostAccount = costAccount;
        this.showEditDialogChange.emit(true);
    }

    /**
     * Callback method for showing a modal dialog to create a new cost account
     */
    private costAccount_onCreateNew() {
        this.selectedCostAccount = new CostAccountInfo();
        this.selectedCostAccount.Id = -1;
        this.selectedCostAccount.IsActive = true;
        this.showEditDialogChange.emit(true);
    }

    /**
     * Callback method when a new cost account has been created
     * @param {CostAccountInfo} costAccount Created cost account
     */
    private costAccount_onCreated(costAccount: CostAccountInfo) {
        this.selectedCostAccount = null;
        this.refreshCostAccounts();
    }

    /**
     * Callback method when a new cost account has been updated
     * @param {CostAccountInfo} costAccount Updated cost account
     */
    private costAccount_onChanged(costAccount: CostAccountInfo) {
        this.refreshCostAccounts();
        this.selectedCostAccount = costAccount;
    }

    /**
     * Callback method when a cost account has been deleted
     * @param {number} id Id of the deleted cost account
     */
    private costAccount_onDeleted(id: number) {
        this.refreshCostAccounts();
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
        this.refreshCostAccounts();
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
    private filter_onApply(filter: CostAccountFilter) {
        this.costAccountFilter.Name = filter.Name;
        this.costAccountFilter.Number = filter.Number;
        this.costAccountFilter.Level = filter.Level;
        this.costAccountFilter.IsActive = filter.IsActive;
        this.refreshCostAccounts();
    }

    //#endregion
}