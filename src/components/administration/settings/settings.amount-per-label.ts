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
    private delta: number = 10.0;
    private min: number = 0.0;
    private default: number = 100.0;

    @Input() maximumAmountPerLabel: number;
    @Input() isInEditMode: boolean = false;

    @Output() notifyMaximumAmountPerLabel: EventEmitter<number> = new EventEmitter<number>();

    public get MaximumAmountPerLabel(): number { return this.maximumAmountPerLabel; }
    public set MaximumAmountPerLabel(val: number) {
        this.maximumAmountPerLabel = val;
        this.notifyMaximumAmountPerLabel.emit(this.maximumAmountPerLabel);
    }

    private maximumAmountPerLabel_OnUpClicked(): void {
        let amount = +this.maximumAmountPerLabel;

        this.MaximumAmountPerLabel = amount + this.delta;
    }

    private maximumAmountPerLabel_OnDownClicked(): void {
        if (this.MaximumAmountPerLabel < this.delta)
            this.MaximumAmountPerLabel = this.min;
        else
            this.MaximumAmountPerLabel -= this.delta;
    }

    private resetButton_onClick() {
        this.MaximumAmountPerLabel = this.default;
    }
}