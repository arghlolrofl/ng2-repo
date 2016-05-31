import {Component, OnInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import {ROUTER_CONFIG} from '../router/app.routes';
import ProfileService from '../services/profile.service';


@RouteConfig(ROUTER_CONFIG)

@Component({
    selector: 'franking-app',
    templateUrl: 'app/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    providers: [
        ROUTER_PROVIDERS,
        ProfileService
    ]
})

/**
 * Basic application wrapper (the bootstrap).
 */
export default class AppComponent implements OnInit {

    // TODO remove if unnecessary
    /**
     * Sample variable for the application, to show how to inject code in html.
     * @type {string}
     */
    private title = 'Francotyp Franking App';

    /**
     * @constructor
     * @param router Router to directly navigate to the shipping area
     */
    constructor(private router: Router) {}

    ngOnInit() {
        this.router.navigate(['Shipping']);
    }
}