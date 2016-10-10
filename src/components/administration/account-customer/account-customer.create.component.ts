import {Component, ViewChild, EventEmitter, Input, Output, AfterViewInit} from '@angular/core';
import {Response} from '@angular/http';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import RoleService from '../../../services/role.service';
import AccountCustomerService from '../../../services/account-customer.service';
import AccountCustomer from '../../../models/account-customer/account-customer';
import SortedPagedResults from '../../../models/base/sorted-paged-results';
import AccountRole from '../../../models/account-customer/account-role';

@Component({
    selector: 'fp-administration-account-customer-create',
    templateUrl: 'assets/templates/administration/account-customer/account-customer.create.component.html',
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

export default class AccountCustomerCreateComponent implements AfterViewInit {
    //#region Input

    /**
     * Object to be edited inside the modal dialog
     */
    @Input() accountCustomer: AccountCustomer;

    /**
     * Opens or closes the modal dialog.
     */
    @Input() showChange: EventEmitter<boolean>;
    @ViewChild('modalAccountCustomerCreate') modal: ModalComponent;

    //#endregion

    //#region Output

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

    get AssignedRoles(): Array<AccountRole> {
        if (this.accountCustomer != null)
            return this.accountCustomer.Roles;
        else
            return null;
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

            this.availableRoles = this.allRoles;
        });
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

    private assignRole(role: AccountRole) {
        this.accountCustomer.Roles = new Array<AccountRole>();
        let newRole: AccountRole = new AccountRole();
        newRole.Id = role.Id;
        newRole.RoleName = role.RoleName;

        this.accountCustomer.Roles.push(newRole);
    }

    private removeRole(role: AccountRole) {
        this.accountCustomer.Roles = new Array<AccountRole>();
    }
    //#endregion


    private cancel() {
        this.showChange.emit(false);
    }

    /**
     * Persist current account customer
     */
    private save() {
        this.accountCustomerService.create({
            Email: this.accountCustomer.Email,
            RoleName: this.accountCustomer.Roles[0].RoleName,
            MailConfirmationUrl: this.accountCustomer.Email
        }).subscribe(
            (response: Response) => {
                this.accountCustomerCreated.emit(this.accountCustomer);
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