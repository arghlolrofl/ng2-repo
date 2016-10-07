import { Component, ViewChild, AfterViewInit, Input, NgZone} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService, TranslatePipe, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {CookieService} from 'angular2-cookie/core';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import {AVAILABLE_LOCALES} from '../config';
import LoginService from '../services/login.service';
import APIClient from "../services/api-client.service";
import NotificationService from "../services/notification.service";
import NotificationMessage from "../models/notification-message";

@Component({
    selector: 'fp-app',
    templateUrl: 'assets/templates/app.component.html',
    providers: [
        CookieService,
        LoginService,
        APIClient
    ]
})

/**
 * Basic application wrapper (the bootstrap).
 */
export default class AppComponent implements AfterViewInit {

    @ViewChild('modalLogin') modalLogin: ModalComponent;

    /**
     * Login data.
     */
    username: string;
    password: string;
    loggedIn: boolean = false;
    @Input() hasNotification : boolean = false;
    @Input() message:  string;

    /**
     * @constructor
     * @param loginService Login service to check user status
     * @param translate The translation service
     */
    constructor(private loginService: LoginService,
        public translate: TranslateService,
        private notificationService: NotificationService,
        private zone:NgZone) {
        const locales = AVAILABLE_LOCALES.join('|');
        let userLang = (navigator.language || navigator.userLanguage || 'en-us').split('-')[0];
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
        }
    }

    /**
     * Upper error handler.
     * @param {Error} error the error to be processed
     */
    public onError(error: Error) {
        console.warn(error); // TODO error handling
        //this.notificationService.sendError(error);
    }

    /**
     * Binds all events.
     */
    private bindEvents() {
        this.notificationService.onNotification.subscribe((data:NotificationMessage) =>
            this.zone.run(() => this.setNotification(data)));

        this.loginService.loginChange.subscribe((data) => {
            this.loggedIn = data.loggedIn;
            if (!this.loggedIn) {
                this.modalLogin.open();
            } else {
                this.modalLogin.close();
            }
        });
    }

    public setNotification(event:NotificationMessage) {
        this.hasNotification = true;
        this.message = event.message;
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