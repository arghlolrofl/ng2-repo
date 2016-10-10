import {Component, ViewChild, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {Response} from '@angular/http';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslateService} from 'ng2-translate/ng2-translate';

import RoleService from '../../../services/role.service';
import AccountCustomerService from '../../../services/account-customer.service';
import AccountCustomer from '../../../models/account-customer/account-customer';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import AccountRole from '../../../models/account-customer/account-role';

@Component({
    selector: 'fp-administration-account-customer-edit',
    templateUrl: 'assets/templates/administration/account-customer/account-customer.edit.component.html',
    providers: [
        AccountCustomerService,
        RoleService
    ],
    styles: [
        '#active-box { margin-left: 5px; height: 40px; vertical-align: middle; }',
        '.align-right { float: right; }',
        '.role-action { width: 50%; height: 40px; margin-left: 25%; }',
        '.v-offset-25 { margin-top: 25px; }',
        '.v-offset-5 { margin-top: 25px; }',
        '.item-with-border { border: 1px solid lightgray; }',
        '.long-label { min-width: 250px; }'
    ]
})

export default class AccountCustomerEditComponent implements AfterViewInit {
    //#region Input

    /**
     * Object to be edited inside the modal dialog
     */
    @Input() accountCustomer: AccountCustomer;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalAccountCustomerEdit') modal: ModalComponent;

    //#endregion

    //#region Output

    /**
     * Notifies parent, that the item with the given id should be deleted.
     */
    @Output() accountCustomerDeleted: EventEmitter<number> = new EventEmitter<number>();

    /**
     * Notifies parent, that the edited object has changed
     */
    @Output() accountCustomerChanged: EventEmitter<AccountCustomer> = new EventEmitter<AccountCustomer>();

    //#endregion

    //#region Fields

    private error: Error;
    private translatedStrings: any = { 'delete': null };
    private isInEditMode: boolean = false;
    private roleService: RoleService;
    private cachedAccountCustomer: AccountCustomer;
    private accountCustomerService: AccountCustomerService;
    private allRoles: Array<AccountRole>;
    private availableRoles: Array<AccountRole>;

    //#endregion

    //#region Properties

    get Email(): string {
        if (this.accountCustomer != null)
            return this.accountCustomer.Email;
        else
            return null;
    }
    set Email(val: string) {
        this.accountCustomer.Email = val;
    }

    get IsMailConfirmed(): boolean {
        if (this.accountCustomer != null)
            return this.accountCustomer.EMailConfirmed;
        else
            return null;
    }
    set IsMailConfirmed(val: boolean) {
        this.accountCustomer.EMailConfirmed = val;
    }

    get LockoutDate(): Date {
        if (this.accountCustomer != null)
            return this.accountCustomer.LockoutEndDate;
        else
            return null;
    }
    set LockoutDate(val: Date) {
        console.info(val);
        this.accountCustomer.LockoutEndDate = val;
    }

    get AccessFailedCount(): number {
        if (this.accountCustomer != null)
            return this.accountCustomer.AccessFailedCount;
        else
            return null;
    }

    get AssignedRoles(): Array<AccountRole> {
        if (this.accountCustomer != null)
            return this.accountCustomer.Roles;
        else
            return null;
    }

    get CurrentAccountExists(): boolean {
        if (this.accountCustomer == null)
            return false;

        return this.isValidGuid(this.accountCustomer.Id);
    }

    //#endregion

    //#region Initialization

    constructor(
        translateService: TranslateService,
        accountCustomerService: AccountCustomerService,
        roleService: RoleService
    ) {
        this.accountCustomerService = accountCustomerService;
        this.roleService = roleService;

        translateService.get('REALLY_DELETE_USER').subscribe(
            (response: string) => {
                this.translatedStrings['delete'] = response;
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );

        this.roleService.getAllRoles().subscribe(
            (response: SortedPagedResults<AccountRole>) => {
                this.allRoles = response.ItemList;
            },
            (error: any) => {
                console.log(error);
                this.apiRequest_onError(error);
            }
        );
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
            if (this.accountCustomer == null)
                this.error = new Error("Error while loading details!");

            this.refreshAccountCustomer();
            this.refreshAvailableRoles();
        });
    }

    private isValidGuid(id: string): boolean {
        let regex: RegExp = new RegExp("^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$", "i");
        return regex.test(id);
    }

    private refreshAvailableRoles() {
        let roles: Array<AccountRole> = new Array<AccountRole>();
        for (let i = 0; i < this.allRoles.length; i++) {
            let role = this.accountCustomer.Roles.find(r => r.RoleName == this.allRoles[i].RoleName);
            if (role == null)
                roles.push(this.allRoles[i]);
        }
        this.availableRoles = roles;
    }

    private refreshAccountCustomer() {
        this.accountCustomerService.getAccountCustomerDetails(this.accountCustomer.Id).subscribe(
            (response: AccountCustomer) => {
                this.accountCustomer = response;
                this.refreshAvailableRoles();
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );
    }

    private assignRole(role: AccountRole) {
        this.accountCustomerService.assignRole(this.accountCustomer.Id, role.Id).subscribe(
            (response: any) => {
                this.refreshAccountCustomer();
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );
    }

    private removeRole(role: AccountRole) {
        //@TODO: prevent managers from removing their own manager role
        this.accountCustomerService.removeRole(this.accountCustomer.Id, role.Id).subscribe(
            (response: any) => {
                this.refreshAccountCustomer();
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );
    }

    private resetLockoutDate() {
        this.accountCustomer.LookoutEnabled = false;
        this.accountCustomer.LockoutEndDate = null;
        this.accountCustomerService.update(this.accountCustomer).subscribe(
            (response: any) => {
                console.info("LockoutEndDate has been reset");
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );
    }
    //#endregion

    /**
     * Enables edit mode and caches current account customer object
     */
    private enableEditMode() {
        this.cachedAccountCustomer = AccountCustomer.createCopy(this.accountCustomer);
        this.isInEditMode = true;
    }

    /**
     * Disables edit mode and restores cached account customer object
     */
    private cancelEditMode() {
        this.isInEditMode = false;
        this.accountCustomer = this.cachedAccountCustomer;
        this.cachedAccountCustomer = null;
    }

    /**
     * Tries to delete the current account customer
     */
    private deleteItem() {
        let id = this.accountCustomer.Id;

        if (!confirm(this.translatedStrings['delete']))
            return;

        this.accountCustomerService.delete(id).subscribe(
            (response: Response) => {
                this.accountCustomerDeleted.emit(id);
                this.close();
            },
            (error: any) => {
                this.apiRequest_onError(error);
                console.error(error);
            }
        );

    }

    /**
     * Persist current account customer
     */
    private save() {
        this.isInEditMode = false;

        this.accountCustomerService.update(this.accountCustomer).subscribe(
            (response: Response) => {
                console.info("Item updated successfully: " + response.status + " " + response.statusText);
                this.isInEditMode = false;
                this.accountCustomerChanged.emit(this.accountCustomer);
                this.close();
            },
            (error: any) => {
                this.apiRequest_onError(error);
                console.error(error);
            }
        );

    }

    /**
     * Close modal dialog.
     */
    public close() {
        this.modal.close();
        this.accountCustomerChanged.emit(this.accountCustomer);
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