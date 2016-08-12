import {Component} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-list-gear',
    templateUrl: 'assets/templates/administration/address-groups/list-gear.html',
    pipes: [
        TranslatePipe
    ]
})

/**
 * List Gear component.
 */
export default class ListGearComponent {
}
