import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'franking-dashboard',
    templateUrl: 'app/templates/dashboard.component.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * Dashboard component.
 */
export default class DashboardComponent {}