import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-profile',
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
    private username: string = '';

    // TODO remove if unnecessary
    /**
     * @constructor
     */
    constructor() {}

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
        this.username = 'placeholder';
    }
}