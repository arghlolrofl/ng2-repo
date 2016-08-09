import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-settings',
    templateUrl: 'assets/templates/administration/administration.settings.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Settings component.
 */
export default class AdministrationSettingsComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

}
