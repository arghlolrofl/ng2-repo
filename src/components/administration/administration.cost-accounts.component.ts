import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-cost-accounts',
    templateUrl: 'assets/templates/administration/administration.cost-accounts.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Cost Accounts component.
 */
export default class AdministrationCostAccountsComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

}
