import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration',
    templateUrl: 'assets/templates/administration/administration.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration component.
 */
export default class AdministrationComponent {
    /**
     * Error if there is one.
     */
    error: Error;

}
