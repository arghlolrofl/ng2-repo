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
    
}