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
        '.v-offset-25 { margin-top: 25px; }',
        '.item-with-border { border: 1px solid lightgray; }'
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
    private roleService: RoleService;
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

    get CurrentAccountExists(): boolean {
        if (this.accountCustomer == null)
            return false;

        return this.isValidGuid(this.accountCustomer.Id);
    }

    //#endregion

    //#region Initialization

    constructor(
        accountCustomerService: AccountCustomerService,
        roleService: RoleService
    ) {
        this.accountCustomerService = accountCustomerService;
        this.roleService = roleService;

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
            // enable edit mode when creating a cost account
            if (this.accountCustomer != null) {
                if (this.accountCustomer.Id === 0) {
                    this.enableEditMode();
                    this.availableRoles = this.allRoles;
                } else if (this.isValidGuid(this.accountCustomer.Id)) {
                    this.refreshAvailableRoles();
                }
            }
        });
    }

    private isValidGuid(id: string): boolean {
        let regex: RegExp = new RegExp("^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-5][0-9a-f]{3}-?[089ab][0-9a-f]{3}-?[0-9a-f]{12}$", "i");
        return regex.test(id);
    }

    private refreshAvailableRoles() {
        // collect available roles
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
            (response: any) => {
                this.accountCustomer = response;
                this.refreshAvailableRoles();
            },
            (error: any) => {
                this.apiRequest_onError(error);
            }
        );
    }

    private assignRole(role: AccountRole) {
        if (this.CurrentAccountExists) {
            this.accountCustomerService.assignRole(this.accountCustomer.Id, role.Id).subscribe(
                (response: any) => {
                    this.refreshAccountCustomer();
                },
                (error: any) => {
                    this.apiRequest_onError(error);
                }
            );
        } else {
            this.accountCustomer.Roles = new Array<AccountRole>();
            let newRole: AccountRole = new AccountRole();
            newRole.Id = role.Id;
            newRole.RoleName = role.RoleName;

            this.accountCustomer.Roles.push(newRole);
        }
    }

    private removeRole(role: AccountRole) {
        if (this.CurrentAccountExists) {
            this.accountCustomerService.removeRole(this.accountCustomer.Id, role.Id).subscribe(
                (response: any) => {
                    this.refreshAccountCustomer();
                },
                (error: any) => {
                    this.apiRequest_onError(error);
                }
            );
        } else {
            this.accountCustomer.Roles = new Array<AccountRole>();
        }
    }
    //#endregion

    /**
     * Enables edit mode and caches current account customer object
     */
    private enableEditMode() {
        //this.cachedAccountCustomer = AccountCustomer.createClone(this.accountCustomer);
        this.isInEditMode = true;
    }

    /**
     * Disables edit mode and restores cached account customer object
     */
    private cancelEditMode() {
        this.isInEditMode = false;

        if (!this.isValidGuid(this.accountCustomer.Id)) {
            this.showChange.emit(false);
        }

        //this.accountCustomer = AccountCustomer.createClone(this.cachedAccountCustomer);
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
        this.isInEditMode = false;

        if (this.isValidGuid(this.accountCustomer.Id)) {
            console.log("SAVING >>");
            console.info(this.accountCustomer);

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
        } else {
            this.accountCustomerService.create({
                Email: this.accountCustomer.Email,
                RoleName: this.accountCustomer.Roles[0].RoleName,
                MailConfirmationUrl: this.accountCustomer.Email
            }).subscribe(
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