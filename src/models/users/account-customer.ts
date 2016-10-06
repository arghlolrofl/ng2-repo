import IdentifiableObject from '../base/identifiable-object';
import AccountRole from './account-role';

export default class AccountCustomer extends IdentifiableObject {
    Email: string;
    EMailConfirmed: boolean;
    LockoutEndDate: string;
    Roles: Array<AccountRole>;

    constructor() {
        super();

        this.Roles = new Array<AccountRole>();
    }

    public static createClone(accountCustomer: AccountCustomer) {
        let customer = new AccountCustomer();

        customer.Email = accountCustomer.Email;
        customer.EMailConfirmed = accountCustomer.EMailConfirmed;
        customer.Id = accountCustomer.Id;
        customer.LockoutEndDate = accountCustomer.LockoutEndDate;

        if (accountCustomer.Roles != null) {
            let roles: Array<AccountRole> = new Array<AccountRole>();
            for (let i = 0; i < accountCustomer.Roles.length; i++) {
                roles.push(AccountRole.createClone(accountCustomer.Roles[i]));
            }

            customer.Roles = roles;
        }

        return customer;
    }
}