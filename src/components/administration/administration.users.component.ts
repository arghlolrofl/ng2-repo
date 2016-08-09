import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-users',
    templateUrl: 'assets/templates/administration/administration.users.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Users component.
 */
export default class AdministrationUsersComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

}
