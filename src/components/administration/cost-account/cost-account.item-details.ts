import {Component, ViewChild, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {Response} from '@angular/http';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountService from '../../../services/cost-account.service';
import CostAccountInfo from '../../../models/cost-account/cost-account-info';

@Component({
    selector: 'fp-cost-account-item-details',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.item-details.html',
    providers: [
        CostAccountService
    ],
    styles: [
        '#active-box { margin-left: 5px; height: 40px; vertical-align: middle; }',
        '.align-right { float: right; }'
    ]
})

export default class CostAccountTableItemDetailsComponent implements AfterViewInit {
    //#region Input

    /**
     * Object to be edited inside the modal dialog
     */
    @Input() costAccount: CostAccountInfo;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalCostAccountItemDetails') modal: ModalComponent;

    //#endregion

    //#region Output

    /**
     * Notifies parent, that the item with the given id should be deleted.
     */
    @Output() costAccountDeleted: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Notifies parent, that the edited object has changed
     */
    @Output() costAccountChanged: EventEmitter<CostAccountInfo> = new EventEmitter<CostAccountInfo>();

    /**
     * Notifies the parent, that an account has been created
     */
    @Output() costAccountCreated: EventEmitter<CostAccountInfo> = new EventEmitter<CostAccountInfo>();

    //#endregion

    //#region Fields

    private cachedCostAccount: CostAccountInfo;
    private isInEditMode: boolean = false;
    private costAccountService: CostAccountService;
    private error: Error;

    //#endregion

    //#region Properties

    get Name(): string {
        if (this.costAccount != null)
            return this.costAccount.Name;
        else
            return null;
    }
    set Name(val: string) {
        this.costAccount.Name = val;
    }

    get IsCostAccountActive(): boolean {
        if (this.costAccount != null)
            return this.costAccount.IsActive;
        else
            return null;
    }
    set IsCostAccountActive(val: boolean) {
        this.costAccount.IsActive = val;
    }

    get Number(): string {
        if (this.costAccount != null)
            return this.costAccount.Number;
        else
            return null;
    }
    set Number(val: string) {
        this.costAccount.Number = val;
    }

    get Surcharge(): number {
        if (this.costAccount != null)
            return this.costAccount.Surcharge;
        else
            return null;
    }
    set Surcharge(val: number) {
        this.costAccount.Surcharge = val;
    }

    get Level(): number {
        if (this.costAccount != null)
            return this.costAccount.Level;
        else
            return null;
    }
    set Level(val: number) {
        this.costAccount.Level = val;
    }

    get SurchargeType(): number {
        if (this.costAccount != null)
            return this.costAccount.SurchargeType;
        else
            return null;
    }
    set SurchargeType(val: number) {
        this.costAccount.SurchargeType = val;
    }

    //#endregion

    //#region Initialization

    constructor(costAccountService: CostAccountService) {
        this.costAccountService = costAccountService;
    }

    /**
     * Initialize the change events.
     */
    public ngAfterViewInit() {
        this.showChange.subscribe((show) => {
            if (show)
                this.modal.open();
            else
                this.modal.close();
        });

        this.modal.onOpen.subscribe(() => {
            // enable edit mode when creating a cost account
            if (this.costAccount != null && this.costAccount.Id <= 0)
                this.enableEditMode();
        });
    }

    //#endregion

    /**
     * Enables edit mode and caches current cost account object
     */
    private enableEditMode() {
        this.cachedCostAccount = CostAccountInfo.createClone(this.costAccount);
        this.isInEditMode = true;
    }

    /**
     * Disables edit mode and restores cached cost account object
     */
    private cancelEditMode() {
        this.isInEditMode = false;
        this.costAccount = CostAccountInfo.createClone(this.cachedCostAccount);
    }

    /**
     * Tries to delete the current cost account
     */
    private deleteItem() {
        let id = this.costAccount.Id;

        this.costAccountService.delete(id).subscribe(
            (response: Response) => {
                console.info("Delete request: " + response.status + " " + response.statusText);
                this.costAccountDeleted.emit(id);
                this.close();
            },
            (error: any) => {
                this.apiRequest_onError(error);
                console.error(error);
            }
        );

    }

    /**
     * Persist current cost account
     */
    private save() {
        if (this.costAccount.Id > 0) {
            this.costAccountService.update(this.costAccount).subscribe(
                (response: Response) => {
                    console.info("Item updated successfully: " + response.status + " " + response.statusText);
                    this.isInEditMode = false;
                    this.costAccountChanged.emit(this.costAccount);
                },
                (error: any) => {
                    this.apiRequest_onError(error);
                    console.error(error);
                }
            );
        } else {
            this.costAccountService.create(this.costAccount).subscribe(
                (response: Response) => {
                    console.info("Item created successfully: " + response.status + " " + response.statusText);
                    this.isInEditMode = false;
                    this.costAccountCreated.emit(this.costAccount);
                    this.close();
                },
                (error: any) => {
                    this.apiRequest_onError(error);
                    console.error(error);
                }
            );
        }
    }

    /**
     * Close modal dialog.
     */
    public close() {
        this.modal.close();
        return false;
    }

    /**
     * Error Handler method
     * @param {any} error Error during API request
     */
    private apiRequest_onError(error: any) {
        console.error(error);

        if (error.hasOwnProperty("_body"))
            this.error = this.extractValidationError(error);
        else
            this.error = error;
    }

    /**
     * Extracts validation messages from an error object
     * @param {any} responseError
     */
    private extractValidationError(responseError: any): Error {
        let err = JSON.parse(responseError._body);
        // Sample:
        // {"Message":"The request is invalid.","ModelState":{"info.BalanceWarningLevel":["The value for Balance warning level must be between 1 and 99 characters long"]}}

        let message: any = err.Message;
        let modelState: any = err.ModelState;

        for (let key in modelState) {
            let arr = modelState[key];
            return new Error("Validation Error: " + arr[0]);
        }
    }
}