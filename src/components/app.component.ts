import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS, Http} from '@angular/http';
import {TranslateService, TranslatePipe, TRANSLATE_PROVIDERS, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {CookieService} from 'angular2-cookie/core';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {AVAILABLE_LOCALES} from '../config';
import {ROUTER_CONFIG} from '../router/app.routes';
import LoginService from '../services/login.service';
import APIClient from "../services/api-client.service";
import {FormBuilder, ControlGroup} from "@angular/common";

@RouteConfig(ROUTER_CONFIG)

@Component({
    selector: 'fp-app',
    templateUrl: 'assets/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        MODAL_DIRECTIVES
    ],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        TRANSLATE_PROVIDERS,
        {
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
            deps: [Http]
        },
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
export default class AppComponent implements AfterViewInit {

    @ViewChild('modalLogin')
    private modalLogin:ModalComponent;

    /**
     * Username.
     */
    private username:string;

    /**
     * Password.
     */
    private password:string;

    /**
     * Current login state.
     * @type {boolean}
     */
    private loggedIn:boolean = false;

    /**
     * @constructor
     * @param router Router to directly navigate to the shipping area
     * @param loginService Login service to check user status
     * @param {FormBuilder} formBuilder the form builder
     * @param translate The translation service
     */
    constructor(private router:Router,
                private loginService:LoginService,
                private formBuilder:FormBuilder,
                public translate:TranslateService) {
        const locales = AVAILABLE_LOCALES.join('|');
        let userLang = navigator.language.split('-')[0];
        userLang = (new RegExp(`(${locales})`, 'gi')).test(userLang) ? userLang : AVAILABLE_LOCALES[0];
        translate.use(userLang);
        this.loggedIn = this.loginService.isLoggedIn();
        this.bindEvents();
    }

    /**
     * Initialize the app.
     */
    public ngAfterViewInit() {
        if (!this.loggedIn) {
            this.modalLogin.open();
            this.modalLogin.onClose.subscribe(() => this.router.navigate(['Shipping'])); // TODO should be replaced with dashboard for go live
        } else {
            this.router.navigate(['Shipping']); // TODO should be replaced with dashboard for go live
        }
    }

    /**
     * Upper error handler.
     * @param {Error} error the error to be processed
     */
    public onError(error:Error) {
        console.warn(error); // TODO error handling
    }

    /**
     * Binds all events.
     */
    private bindEvents() {
        this.loginService.loginChange.subscribe((data) => {
            this.loggedIn = data.loggedIn;
            if (!this.loggedIn) {
                this.modalLogin.open();
            } else {
                this.modalLogin.close();
            }
        });
    }

    /**
     * Handle login.
     */
    public login() {
        if (this.username !== '' && this.password !== '') {
            this.loginService.login(this.username, this.password);
        }
    }
}