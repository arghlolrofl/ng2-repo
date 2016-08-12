import {Component} from '@angular/core';
//import {RouteConfig, RouterOutlet} from '@angular/router-deprecated';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AdministrationAddressGroupsComponent from './administration.address-groups.component';
import AdministrationAddressesComponent from './administration.addresses.component';
import AdministrationCostAccountsComponent from './administration.cost-accounts.component';
import AdministrationSettingsComponent from './administration.settings.component';
import AdministrationUsersComponent from './administration.users.component';
import AdministrationAddressGroupsManageComponent from './address-groups/administration.address-groups-manage.component';
import ErrorUtils from "../../utils/error-utils";


@Component({
    selector: 'fp-administration',
    templateUrl: 'assets/templates/administration/administration.component.html',
    directives: [
//        RouterOutlet,
        AdministrationAddressGroupsComponent,
        AdministrationAddressesComponent,
        AdministrationCostAccountsComponent,
        AdministrationSettingsComponent,
        AdministrationUsersComponent
    ],
    pipes: [
        TranslatePipe
    ]
})

/*
@RouteConfig([
        { path: 'address-groups', name: 'AdministrationAddressGroupsManage', component: AdministrationAddressGroupsManageComponent, useAsDefault: true }
])
*/
/**
 * Administration component.
 */
export default class AdministrationComponent {
    /**
     * Error if there is one.
     */
    error: Error;


    /**
     * Handle errors.
     * @param {any} error the error
     */
    public handleError(error: any) {
        console && console.warn && console.warn(error);
        this.error = ErrorUtils.toError(error);
        document.getElementsByTagName('body')[0].scrollIntoView();
    }

}
