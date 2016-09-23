import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration-settings-amount-per-label',
    templateUrl: 'assets/templates/administration/settings/settings.amount-per-label.html'
})

/**
 * Administration component.
 */
export default class SettingsAmountPerLabel {
    @Input() maximumAmountPerLabel: number;
    @Input() isInEditMode: boolean = false;

    @Output() notifyMaximumAmountPerLabel: EventEmitter<number> = new EventEmitter<number>();
}