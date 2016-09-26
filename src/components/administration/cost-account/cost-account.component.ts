import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-cost-account',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.component.html',
    providers: [

    ]
})

/**
 * Administration - Settings component.
 */
export default class CostAccountComponent {
    //#region Fields

    private error: Error;

    //#endregion

    @Output()
    onError: EventEmitter<Error> = new EventEmitter<Error>();

    constructor() {

    }

    private ngOnInit() {

    }
}