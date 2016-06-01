import {Component, OnInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TRANSLATE_PROVIDERS} from 'ng2-translate/ng2-translate';

import {AVAILABLE_LOCALES} from '../config';
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
        HTTP_PROVIDERS, 
        TRANSLATE_PROVIDERS,
        ProfileService
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
     * @constructor
     * @param router Router to directly navigate to the shipping area
     * @param translate The translation service
     */
    constructor(private router: Router, public translate: TranslateService) {
        const locales = AVAILABLE_LOCALES.join('|');
        let userLang = navigator.language.split('-')[0];
        userLang = (new RegExp(`(${locales})`, 'gi')).test(userLang) ? userLang : AVAILABLE_LOCALES[0];

        translate.use(userLang);
    }

    ngOnInit() {
        this.router.navigate(['Shipping']);
    }
}