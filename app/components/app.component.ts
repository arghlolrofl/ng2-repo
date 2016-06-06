import {Component, OnInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TRANSLATE_PROVIDERS} from 'ng2-translate/ng2-translate';
import {CookieService} from 'angular2-cookie/core';

import {AVAILABLE_LOCALES} from '../config';
import {ROUTER_CONFIG} from '../router/app.routes';
import LoginService from '../services/login.service';
import LoginComponent from './login.component';

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
        LoginService
    ],
    pipes: [
        TranslatePipe
    ]
})

/**
 * Basic application wrapper (the bootstrap).
 */
export default class AppComponent implements OnInit {

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

    ngOnInit() {
        this.loggedIn = this.loginService.isLoggedIn();
        this.router.navigate(['Shipping']); // TODO should be replaced with dashboard for go live
    }

    bindEvents() {
        this.loginService.loginChanged.subscribe((data) => {
            this.loggedIn = data.loggedIn;
        });
    }
}