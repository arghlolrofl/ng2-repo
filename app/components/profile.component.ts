import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import ProfileService from '../services/profile.service';

@Component({
    selector: 'franking-profile',
    templateUrl: 'app/templates/profile.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Profile component.
 */
export default class ProfileComponent implements OnInit {

    // TODO remove if unnecessary
    /**
     * Sample variable that is loaded dynamically by a service.
     * @type {string}
     */
    private username = '';

    // TODO remove if unnecessary
    /**
     * @constructor
     * @param profileService The sample profile service to be injected
     */
    constructor(
        private profileService: ProfileService
    ) {}

    /**
     * Initilize the application on load.
     */
    ngOnInit() {
        // TODO remove if unnecessary
        this.getUsername();
    }

    // TODO remove if unnecessary
    /**
     * Wrapper for the asynchronous getUsername method of ProfileService.
     */
    getUsername() {
        this.profileService.getUsername().then(username => this.username = username);
    }
}