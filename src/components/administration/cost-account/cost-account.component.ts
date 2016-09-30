import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountService from '../../../services/cost-account.service';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import CostAccountInfo from '../../../models/cost-account/cost-account-info';
import SortedPagedRequest from '../../../models/base/sorted-paged-request';

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
export default class CostAccountComponent implements OnInit {
    private selectedResultCount: number = 10;
    get SelectedResultCount(): number { return this.selectedResultCount; }
    set SelectedResultCount(val: number) {
        console.info("Selected: " + val);
        this.selectedResultCount = val;
        this.refreshCostAccounts();
    }

    private totalResultCount: number;
    get TotalResultCount(): number { return this.totalResultCount; }
    set TotalResultCount(val: number) {
        console.info("Total: " + val);
        this.totalResultCount = val;
    }

    //#region Fields

    private error: Error;
    private costAccountService: CostAccountService;
    private costAccountList: Array<CostAccountInfo>;
    private isLoading: boolean = false;

    /**
     * Show modal dialog for item details.
     */
    showEditDialogChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    private selectedCostAccount: CostAccountInfo;

    //#endregion

    //#region Properties

    public get SelectedCostAccount(): CostAccountInfo {
        if (typeof this.selectedCostAccount === 'undefined')
            return null;
        else
            return this.selectedCostAccount;
    }

    //#endregion

    @Output()
    onError: EventEmitter<Error> = new EventEmitter<Error>();

    constructor(costAccountService: CostAccountService) {
        this.costAccountService = costAccountService;
        this.refreshCostAccounts();
    }

    private refreshCostAccounts(startIndex?: number) {
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
            let req = new SortedPagedRequest();
            req.Descending = false;
            req.ResultCount = this.selectedResultCount;

            if (startIndex != null)
                req.StartValue = startIndex;

            this.costAccountService
                .getCostCenters(req)
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

    public ngOnInit() {

    }

    private costAccount_onShowDetails(costAccount: CostAccountInfo) {
        this.selectedCostAccount = costAccount;
        this.showEditDialogChange.emit(true);
    }

    private costAccount_onCreateNew() {
        this.selectedCostAccount = new CostAccountInfo();
        this.selectedCostAccount.Id = -1;
        this.selectedCostAccount.IsActive = true;
        this.showEditDialogChange.emit(true);
    }

    private costAccount_onCreated(costAccount: CostAccountInfo) {
        this.selectedCostAccount = null;
        this.refreshCostAccounts();
    }

    private costAccount_onChanged(costAccount: CostAccountInfo) {
        this.refreshCostAccounts();
        this.selectedCostAccount = costAccount;
    }

    private costAccount_onDeleted(id: number) {
        this.refreshCostAccounts();
    }

    private paging_onResultCountChanged(count: number) {
        this.SelectedResultCount = count;
    }
}