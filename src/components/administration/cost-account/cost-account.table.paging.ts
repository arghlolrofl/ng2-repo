import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration-cost-account-table-paging',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.table.paging.html',
    styles: [
        '.paging-control { background-color: #eee; padding-top: 5px; padding-bottom: 0; }',
        '.paging-status { width: 100%; text-align: center; }',
        '.icon-button { background-color: #eee; }'
    ]
})

export default class CostAccountTablePagingComponent {

}