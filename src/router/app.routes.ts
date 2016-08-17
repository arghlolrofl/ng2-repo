import {Routes, RouterModule} from '@angular/router';

import DashboardComponent from '../components/dashboard/dashboard.component';
import ShippingComponent from '../components/shipping/shipping.component';
import AdministrationComponent from '../components/administration/administration.component';
import ProfileComponent from '../components/profile/profile.component';

/**
 * The routes to all areas (with parameterized routes).
 * @type {{name: string, path: string, component: Object}[]}
 */
const appRoutes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'shipping',
        component: ShippingComponent
    },
    {
        path: 'administration',
        component: AdministrationComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    }
];

export const appRoutingProviders: any[] = [];

export const routing = RouterModule.forRoot(appRoutes);