import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountService from '../../../services/cost-account.service';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import CostAccountInfo from '../../../models/cost-account/cost-account-info';

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

    private refreshCostAccounts() {
        this.isLoading = true;

        this.selectedCostAccount = null;
        this.costAccountService
            .getAllCostCenters()
            .subscribe(
                (response: SortedPagedResults<CostAccountInfo>) => {
                    this.costAccountList = response.ItemList;
                    this.isLoading = false;
                },
                (error: Error) => {
                    this.isLoading = false;
                    console.error(error);
                }
            );
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
}