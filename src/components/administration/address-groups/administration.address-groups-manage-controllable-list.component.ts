import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AdministrationAddressGroupsManageListComponent from './administration.address-groups-manage-list.component';
import ListGearComponent from './list-gear.component';

@Component({
    selector: 'fp-administration-address-groups-manage-controllable-list',
    templateUrl: 'assets/templates/administration/address-groups/administration.address-groups-manage-controllable-list.html',
    directives: [
        ListGearComponent,
        AdministrationAddressGroupsManageListComponent
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups Manage Controllable List component.
 */
export default class AdministrationAddressGroupsManageControllableListComponent {
}
