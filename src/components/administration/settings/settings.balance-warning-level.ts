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
    private delta: number = 1.00;
    private min: number = 1.0;
    private max: number = 99.0;
    private default: number = 20.0;

    @Input() balanceWarningLevel: number;
    @Input() isInEditMode: boolean = false;

    @Output() notifyBalanceWarningLevel: EventEmitter<number> = new EventEmitter<number>();

    public get BalanceWarningLevel(): number { return this.balanceWarningLevel };
    public set BalanceWarningLevel(val: number) {
        this.balanceWarningLevel = val;
        this.notifyBalanceWarningLevel.emit(this.balanceWarningLevel);
    }


    private balanceWarningLevel_OnUpClicked(): void {
        let amount = +this.BalanceWarningLevel;

        if (amount <= (this.max - this.delta))
            this.BalanceWarningLevel = amount + this.delta;
        else if (amount <= this.max)
            this.BalanceWarningLevel = this.max;
    }

    private balanceWarningLevel_OnDownClicked(): void {
        if (this.BalanceWarningLevel < (this.min + this.delta))
            this.BalanceWarningLevel = this.min;
        else
            this.BalanceWarningLevel -= this.delta;
    }

    private resetButton_onClick() {
        this.BalanceWarningLevel = this.default;
    }
}