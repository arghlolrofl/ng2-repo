import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-login',
    templateUrl: 'app/templates/login.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Login component.
 */
export default class LoginComponent {

}