import {Component, ViewChild, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {Response} from '@angular/http';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import RoleService from '../../../services/role.service';
import AccountCustomerService from '../../../services/account-customer.service';
import AccountCustomer from '../../../models/users/account-customer';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import AccountRole from '../../../models/users/account-role';

@Component({
    selector: 'fp-administration-users-details',
    templateUrl: 'assets/templates/administration/users/users.details.html',
    providers: [
        AccountCustomerService,
        RoleService
    ],
    styles: [
        '#active-box { margin-left: 5px; height: 40px; vertical-align: middle; }',
        '.align-right { float: right; }',
        '.role-action { width: 50%; height: 40px; margin-left: 25%; }',
        '.v-offset-25 { margin-top: 25px; }'
    ]
})

export default class UsersDetailsComponent implements AfterViewInit {
    //#region Input

    /**
     * Object to be edited inside the modal dialog
     */
    @Input() accountCustomer: AccountCustomer;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalAccountCustomerItemDetails') modal: ModalComponent;

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

    /**
     * Notifies the parent, that an account has been created
     */
    @Output() accountCustomerCreated: EventEmitter<AccountCustomer> = new EventEmitter<AccountCustomer>();

    //#endregion

    //#region Fields

    private error: Error;
    private isInEditMode: boolean = false;
    private cachedAccountCustomer: AccountCustomer;
    private roleService: RoleService;
    private accountCustomerService: AccountCustomerService;

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

    get LockoutDate(): string {
        if (this.accountCustomer != null)
            return this.accountCustomer.LockoutEndDate;
        else
            return null;
    }
    set LockoutDate(val: string) {
        this.accountCustomer.LockoutEndDate = val;
    }

    get AssignedRoles(): Array<AccountRole> {
        if (this.accountCustomer != null)
            return this.accountCustomer.Roles;
        else
            return null;
    }

    //#endregion

    //#region Initialization

    constructor(accountCustomerService: AccountCustomerService, roleService: RoleService) {
        this.accountCustomerService = accountCustomerService;
        this.roleService = roleService;

        this.roleService.getAllRoles().subscribe(
            (response: SortedPagedResults<AccountRole>) => {
                console.info(response);
                alert("Fetched roles");
            },
            (error: any) => {
                console.log(error);
                this.error = error;
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
            // enable edit mode when creating a cost account
            if (this.accountCustomer != null && this.accountCustomer.Id <= 0)
                this.enableEditMode();
        });
    }

    //#endregion

    /**
     * Enables edit mode and caches current account customer object
     */
    private enableEditMode() {
        this.cachedAccountCustomer = AccountCustomer.createClone(this.accountCustomer);
        this.isInEditMode = true;
    }

    /**
     * Disables edit mode and restores cached account customer object
     */
    private cancelEditMode() {
        this.isInEditMode = false;
        this.accountCustomer = AccountCustomer.createClone(this.cachedAccountCustomer);
    }

    /**
     * Tries to delete the current account customer
     */
    private deleteItem() {
        let id = this.accountCustomer.Id;

        this.accountCustomerService.delete(id).subscribe(
            (response: Response) => {
                console.info("Delete request: " + response.status + " " + response.statusText);
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
        if (this.accountCustomer.Id > 0) {
            this.accountCustomerService.update(this.accountCustomer).subscribe(
                (response: Response) => {
                    console.info("Item updated successfully: " + response.status + " " + response.statusText);
                    this.isInEditMode = false;
                    this.accountCustomerChanged.emit(this.accountCustomer);
                },
                (error: any) => {
                    this.apiRequest_onError(error);
                    console.error(error);
                }
            );
        } else {
            this.accountCustomerService.create(this.accountCustomer).subscribe(
                (response: Response) => {
                    console.info("Item created successfully: " + response.status + " " + response.statusText);
                    this.isInEditMode = false;
                    this.accountCustomerCreated.emit(this.accountCustomer);
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