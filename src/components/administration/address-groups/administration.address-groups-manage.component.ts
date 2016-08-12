import {Component, EventEmitter, Output} from '@angular/core';
import {Router} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AdministrationAddressGroupsManageFilterComponent from './administration.address-groups-manage-filter.component';
import AdministrationAddressGroupsManageControllableListComponent from './administration.address-groups-manage-controllable-list.component';


@Component({
    selector: 'fp-administration-addressgroups-manage',
    templateUrl: 'assets/templates/administration/address-groups/administration.address-groups-manage.html',
    directives: [
        AdministrationAddressGroupsManageControllableListComponent,
        AdministrationAddressGroupsManageFilterComponent
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Administration Address Groups Manage component.
 */
export default class AdministrationAddressGroupsManageComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter();

     /**
     * @constructor
     * @param router Router to directly navigate to the shipping area
     **/
    constructor(private router: Router) {
    }

    /**
     * Handle create New Address Group
     */
    createNew() {
        console.log('"Adressgruppe anlegen" ausgewählt');
    }

    /**
     * Handle close Address Groups Management.
     */
    close() {
        this.router.navigate(['Administration']);   // TODO: Return to the user's default page.
    }

}
