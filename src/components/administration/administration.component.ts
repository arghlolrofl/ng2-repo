import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration',
    templateUrl: 'assets/templates/administration/administration.dashboard.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration component.
 */
export default class AdministrationComponent {}