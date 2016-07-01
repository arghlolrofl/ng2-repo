"use strict";
var dashboard_component_1 = require('../components/dashboard/dashboard.component');
var shipping_component_1 = require('../components/shipping/shipping.component');
var administration_component_1 = require('../components/administration/administration.component');
var profile_component_1 = require('../components/profile/profile.component');
/**
 * The routes to all areas (with parameterized routes).
 * @type {{name: string, path: string, component: Object}[]}
 */
exports.ROUTER_CONFIG = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: dashboard_component_1.default
    },
    {
        name: 'Shipping',
        path: '/shipping',
        component: shipping_component_1.default
    },
    {
        name: 'Administration',
        path: '/administration',
        component: administration_component_1.default
    },
    {
        name: 'Profile',
        path: '/profile',
        component: profile_component_1.default
    }
];
