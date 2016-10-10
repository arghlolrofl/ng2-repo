import AccountCustomerFilter from './account-customer-filter';
import SortingInfo from '../base/sorting-info';

export default class AccountCustomerFilterRequest extends AccountCustomerFilter {
    StartValue: number;
    ResultCount: number;
    Sorting: SortingInfo;

    constructor(filter: AccountCustomerFilter) {
        super();

        if (typeof filter === 'undefined' || filter == null)
            return;

        this.Login = filter.Login;
        this.Role = filter.Role;
    }
}