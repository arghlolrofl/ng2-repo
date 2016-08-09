import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-addresses',
    templateUrl: 'assets/templates/administration/administration.addresses.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Addresses component.
 */
export default class AdministrationAddressesComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

}
