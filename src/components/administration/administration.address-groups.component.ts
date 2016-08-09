import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-addressgroups',
    templateUrl: 'assets/templates/administration/administration.address-groups.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups component.
 */
export default class AdministrationAddressGroupsComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();



    
}
