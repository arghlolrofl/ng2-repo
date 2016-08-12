import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AddressGroupInfo from '../../../models/address-group-info';

@Component({
    selector: 'fp-administration-address-groups-manage-list',
    templateUrl: 'assets/templates/administration/address-groups/administration.address-groups-manage-list.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups Manage List component.
 */
export default class AdministrationAddressGroupsManageListComponent {
    addressGroups: AddressGroupInfo[] = []; 
    
}
