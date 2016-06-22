import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';
import {HTTP_PROVIDERS} from '@angular/http';
import {TranslateService, TranslatePipe, TRANSLATE_PROVIDERS} from 'ng2-translate/ng2-translate';
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
    templateUrl: 'app/templates/app.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        MODAL_DIRECTIVES
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
export default class AppComponent implements AfterViewInit {

    @ViewChild('modalLogin')
    private modalLogin:ModalComponent;

    /**
     * Current login state.
     * @type {boolean}
     */
    private loggedIn:boolean = false;

    /**
     * Login formular.
     */
    private loginForm:ControlGroup;

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

        this.loginForm = formBuilder.group({
            'username': [''],
            'password': ['']
        });

        this.bindEvents();
    }

    /**
     * Initialize the app.
     */
    public ngAfterViewInit() {
        this.router.navigate(['Shipping']); // TODO should be replaced with dashboard for go live
        if (!this.loggedIn) {
            this.modalLogin.open();
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
        const username = this.loginForm.controls['username'].value;
        const password = this.loginForm.controls['password'].value;
        
        if (username !== '' && password !== '') {
            this.loginService.login(username, password);
        }
    }
}