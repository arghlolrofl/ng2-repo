import CostAccountFilter from './cost-account-filter';
import SortingInfo from '../base/sorting-info';

export default class CostAccountFilterRequest extends CostAccountFilter {
    FastQuery: string;
    StartValue: number;
    ResultCount: number;
    SurchargeType: number;
    Sorting: SortingInfo;

    constructor(filter: CostAccountFilter) {
        super();

        if (typeof filter === 'undefined' || filter == null)
            return;

        this.Name = filter.Name;
        this.Number = filter.Number;
        this.Level = filter.Level;
        this.IsActive = filter.IsActive;
    }
}