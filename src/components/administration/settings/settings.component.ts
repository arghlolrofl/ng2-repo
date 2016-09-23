import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import AccountLevels from './settings.account-levels';
import AmountPerLabel from './settings.amount-per-label';
import BalanceWarningLevel from './settings.balance-warning-level';
import SettingsService from './../../../services/settings.service';
import MailOneSettings from './../../../models/settings/mailone-settings';

/**
 * Global window scope.
 * @type {Window}
 */
const w: any = window;

/**
 * Import jQuery from global.
 */
const $ = w.$;

@Component({
    selector: 'fp-administration-settings',
    templateUrl: 'assets/templates/administration/settings/settings.component.html',
    styles: [
        '.status-message { font-weight: bold; font-size: 16pt; border: 1px solid lightgray; padding: 15px; background-color: #eee; }'
    ],
    providers: [
        SettingsService
    ]
})

/**
 * Administration - Settings component.
 */
export default class SettingsComponent {
    private settingsService: SettingsService;
    private elementFadeTime: any = 100;
    private error: Error;

    public isInEditMode: boolean = false;
    public mailOneSettings: MailOneSettings;

    @Output()
    onError: EventEmitter<Error> = new EventEmitter<Error>();

    constructor(settingsService: SettingsService) {
        this.settingsService = settingsService;
        this.mailOneSettings = new MailOneSettings();
        this.mailOneSettings.NumberOfLevels = 1;
    }

    private ngOnInit() {
        this.settingsService.getAllSettings().subscribe(
            (r: MailOneSettings) => {
                if (r.NumberOfLevels < 1)
                    r.NumberOfLevels = this.mailOneSettings.NumberOfLevels;

                this.mailOneSettings = r
            },
            (error: Error) => {
                console.error(error);
                this.onError.emit(error);
            }
        );

        this.disableEditMode(false);
    }

    public toggleEditMode() {
        if (this.isInEditMode)
            this.disableEditMode();
        else
            this.enableEditMode();
    }

    private enableEditMode() {
        this.isInEditMode = true;
        $('#status-box').fadeIn(this.elementFadeTime);
        $('#save-button').fadeIn(this.elementFadeTime);
    }

    private disableEditMode(shouldFade?: boolean) {
        this.isInEditMode = false;

        if (shouldFade == null || shouldFade) {
            $('#status-box').fadeOut(this.elementFadeTime);
            $('#save-button').fadeOut(this.elementFadeTime);
        } else {
            $('#status-box').hide();
            $('#save-button').hide();
        }
    }

    private onNumberOfAccountLevelsChanged(count: number) {
        console.info("Updating mailOneSettings.NumberOfLevels to: " + count);
        this.mailOneSettings.NumberOfLevels = count;
        console.info(this);
    }

    private onCostCenterLevelNameChanged(level: number, name: string) {
        switch (level) {
            case 1:
                this.mailOneSettings.CostCenterLevelOneName = name;
                break;
            case 2:
                this.mailOneSettings.CostCenterLevelTwoName = name;
                break;
            case 3:
                this.mailOneSettings.CostCenterLevelThreeName = name;
                break;
            default:
                break;
        }
    }

    private onMaximumAmountPerLabelChanged(amount: number) {
        console.log("Parent received: " + amount);
        this.mailOneSettings.MaximumAmountPerLabel = amount;
    }

    private onBalanceWarningLevelChanged(balance: number) {
        console.log("Parent received: " + balance);
        this.mailOneSettings.BalanceWarningLevel = balance;
    }

    private saveChanges() {
        console.info("Posting settings:");
        console.info(this.mailOneSettings);

        this.settingsService.postAllSettings(this.mailOneSettings).subscribe(
            () => {
                console.log('Settings posted successfully!');
                this.disableEditMode();
            },
            (error: any) => {
                console.info(error);

                if (error.hasOwnProperty("message"))
                    this.error = error;
                else if (error.hasOwnProperty("_body"))
                    this.error = this.extractValidationError(error);
                else {
                    console.error(error);
                    this.error = error;
                }

                this.onError.emit(this.error);
            }
        );
    }

    private extractValidationError(responseError: any): Error {
        let err = JSON.parse(responseError._body);
        // Sample:
        // {"Message":"The request is invalid.","ModelState":{"info.BalanceWarningLevel":["The value for Balance warning level must be between 1 and 99 characters long"]}}

        let message: any = err.Message;
        let modelState: any = err.ModelState;

        for (let key in modelState) {
            let arr = modelState[key];
            return new Error("Validation Error: " + arr[0]);
        }
    }
}