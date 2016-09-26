import {Routes, RouterModule} from '@angular/router';

import DashboardComponent from '../components/dashboard/dashboard.component';
import ShippingComponent from '../components/shipping/shipping.component';
import ProfileComponent from '../components/profile/profile.component';
import ShippingLabelComponent from '../components/shipping/shipping.label.component';

import AdministrationComponent from '../components/administration/administration.component';
import SettingsComponent from '../components/administration/settings/settings.component';


/**
 * The routes to all areas (with parameterized routes).
 * @type {{name: string, path: string, component: Object}[]}
 */
const appRoutes = [
    {
        path: '',
        component: DashboardComponent
    },

    {
        path: 'shipping',
        component: ShippingComponent
    },

    {
        path: 'shipping/label/:id',
        component: ShippingLabelComponent        
    },
    {
        path: 'administration',
        component: AdministrationComponent
    },
    {
        path: 'administration/settings',
        component: SettingsComponent
    },

    {
        path: 'profile',
        component: ProfileComponent
    }
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes);