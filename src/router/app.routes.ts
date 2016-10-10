import {Routes, RouterModule} from '@angular/router';

import DashboardComponent from '../components/dashboard/dashboard.component';
import ShippingComponent from '../components/shipping/shipping.component';
import ProfileComponent from '../components/profile/profile.component';
import ShippingLabelComponent from '../components/shipping/shipping.label.component';

import AdministrationComponent from '../components/administration/administration.component';
import SettingsComponent from '../components/administration/settings/settings.component';
import CostAccountComponent from '../components/administration/cost-account/cost-account.component';
import AccountCustomerComponent from '../components/administration/account-customer/account-customer.component';


/**
 * The routes to all areas (with parameterized routes).
 * @type {{name: string, path: string, component: Object}[]}
 */
const appRoutes = [
    // Dashboard Components
    {
        path: '',
        component: DashboardComponent
    },

    // Shipping Components
    {
        path: 'shipping',
        component: ShippingComponent
    },
    {
        path: 'shipping/label/:id',
        component: ShippingLabelComponent
    },

    // Administration Components
    {
        path: 'administration',
        component: AdministrationComponent
    },
    {
        path: 'administration/settings',
        component: SettingsComponent
    },
    {
        path: 'administration/cost-account',
        component: CostAccountComponent
    },
    {
        path: 'administration/users',
        component: AccountCustomerComponent
    },

    // Profile Component(s)
    {
        path: 'profile',
        component: ProfileComponent
    }
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes);