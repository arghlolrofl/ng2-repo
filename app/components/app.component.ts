import {Component, OnInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TRANSLATE_PROVIDERS} from 'ng2-translate/ng2-translate';
import {CookieService} from 'angular2-cookie/core';

import {AVAILABLE_LOCALES} from '../config';
import {ROUTER_CONFIG} from '../router/app.routes';
import LoginComponent from './login.component';
import LoginService from '../services/login.service';
import APIClient from "../services/api-client.service";

@RouteConfig(ROUTER_CONFIG)

@Component({
    selector: 'fp-app',
    templateUrl: 'app/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        LoginComponent
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS, 
        TRANSLATE_PROVIDERS,
        CookieService,
        LoginService,
        APIClient
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Basic application wrapper (the bootstrap).
 */
export default class AppComponent implements OnInit {

    /**
     * Current login state.
     * @type {boolean}
     */
    private loggedIn: boolean = false;

    /**
     * @constructor
     * @param router Router to directly navigate to the shipping area
     * @param loginService Login service to check user status
     * @param translate The translation service
     */
    constructor(private router: Router,
                private loginService: LoginService,
                public translate: TranslateService) {
        const locales = AVAILABLE_LOCALES.join('|');
        let userLang = navigator.language.split('-')[0];
        userLang = (new RegExp(`(${locales})`, 'gi')).test(userLang) ? userLang : AVAILABLE_LOCALES[0];

        translate.use(userLang);
        this.bindEvents();
    }

    /**
     * Initialize the application.
     */
    public ngOnInit() {
        this.loggedIn = this.loginService.isLoggedIn();
        this.router.navigate(['Shipping']); // TODO should be replaced with dashboard for go live
    }

    public onError(error:Error) {
        console.warn(error);
    }

    /**
     * Binds all events.
     */
    private bindEvents() {
        this.loginService.loginChange.subscribe((data) => {
            this.loggedIn = data.loggedIn;
        });
    }
}