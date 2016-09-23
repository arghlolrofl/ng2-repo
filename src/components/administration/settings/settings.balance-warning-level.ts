import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration-balance-warning-level',
    templateUrl: 'assets/templates/administration/settings/settings.balance-warning-level.html'
})

/**
 * Administration component.
 */
export default class SettingsBalanceWarningLevel {
    @Input() balanceWarningLevel: number;
    @Input() isInEditMode: boolean = false;

    @Output() notifyBalanceWarningLevel: EventEmitter<number> = new EventEmitter<number>();
}