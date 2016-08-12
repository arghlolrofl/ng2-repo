import DashboardComponent from '../components/dashboard/dashboard.component';
import ShippingComponent from '../components/shipping/shipping.component';
import AdministrationComponent from '../components/administration/administration.component';
import ProfileComponent from '../components/profile/profile.component';
import AdministrationAddressGroupsComponent from '../components/administration/address-groups/administration.address-groups-manage.component';
/**
 * The routes to all areas (with parameterized routes).
 * @type {{name: string, path: string, component: Object}[]}
 */
export const ROUTER_CONFIG = [
    {
        name: 'Dashboard',
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        name: 'Shipping',
        path: 'shipping',
        component: ShippingComponent
    },
    {
        name: 'Administration',
        path: 'administration',
        component: AdministrationComponent
    },
    {
        name: 'Profile',
        path: 'profile',
        component: ProfileComponent
    },

    {
        name: 'AdministrationAddressGroupsManage',
        path: 'administration/address-groups',
        component: AdministrationAddressGroupsComponent
    }
];