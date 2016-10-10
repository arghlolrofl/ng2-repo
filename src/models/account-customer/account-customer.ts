import IdentifiableObject from '../base/identifiable-object';
import AccountRole from './account-role';

export default class AccountCustomer extends IdentifiableObject {
    Email: string;
    EMailConfirmed: boolean;
    LockoutEndDate: Date;
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

    public static createCopy(obj: AccountCustomer) {
        let clone = new AccountCustomer();
        clone.Email = obj.Email;
        clone.EMailConfirmed = obj.EMailConfirmed;
        clone.LockoutEndDate = obj.LockoutEndDate;
        clone.LookoutEnabled = obj.LookoutEnabled;
        clone.AccessFailedCount = obj.AccessFailedCount;
        clone.Id = obj.Id;
        clone.PhoneNumber = obj.PhoneNumber;
        clone.PhoneNumberConfirmed = obj.PhoneNumberConfirmed;
        clone.UserName = obj.UserName;
        clone.TwoFactorEnabled = obj.TwoFactorEnabled;

        if (obj.Roles != null && obj.Roles.length > 0) {
            clone.Roles = new Array<AccountRole>();
            for (let i = 0; i < obj.Roles.length; i++) {
                clone.Roles.push(AccountRole.createCopy(obj.Roles[i]));
            }
        }

        return clone;
    }
}