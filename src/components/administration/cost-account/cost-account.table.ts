import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountInfo from '../../../models/cost-account/cost-account-info';

@Component({
    selector: 'fp-administration-cost-account-table',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.table.html',
    styles: [
        'table { width: 100%; }',
        'table thead tr th { font-weight: bold; }',
        '.cell-button { width: 50px; height: 25px; margin-top: 5px; margin-bottom: 5px; }'
    ]
})

export default class CostAccountTableComponent {
    //#region Input

    @Input()
    items: Array<CostAccountInfo>;

    //#endregion

    //#region Output

    @Output()
    showDetails: EventEmitter<CostAccountInfo> = new EventEmitter<CostAccountInfo>();

    //#endregion
}