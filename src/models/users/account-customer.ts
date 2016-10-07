import IdentifiableObject from '../base/identifiable-object';
import AccountRole from './account-role';

export default class AccountCustomer extends IdentifiableObject {
    Email: string;
    EMailConfirmed: boolean;
    LockoutEndDate: string;
    Roles: Array<AccountRole>;
    LookoutEnabled: boolean;
    UserName: string;
    PhoneNumber: string;
    PhoneNumberConfirmed: boolean;
    TwoFactorEnabled: boolean;
    AccessFailedCount: number;

    constructor() {
        super();

        this.Roles = new Array<AccountRole>();
    }
}