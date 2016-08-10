import {Component, EventEmitter, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';


@Component({
    selector: 'fp-administration-addressgroups-manage',
    templateUrl: 'assets/templates/administration/address-groups/administration.address-groups-manage.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups component.
 */
export default class AdministrationAddressGroupsManageComponent {

    @Output()
    onError: EventEmitter<Error> = new EventEmitter();

}
