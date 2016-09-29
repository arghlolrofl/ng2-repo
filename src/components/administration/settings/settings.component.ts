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
        '.status-message { font-weight: bold; font-size: 16pt; border: 1px solid lightgray; padding: 15px; background-color: #eee; }',
        'input::-webkit-input-placeholder { color: red !important; }',
        'input:-moz-placeholder { color: red !important;  }',
        'input::-moz-placeholder { color: red !important; }',
        'input:-ms-input-placeholder { color: red !important; }'
    ],
    providers: [
        SettingsService
    ]
})

/**
 * Administration - Settings component.
 */
export default class SettingsComponent {
    //#region Fields

    private error: Error;
    private settingsService: SettingsService;
    private isInEditMode: boolean = false;
    private mailOneSettings: MailOneSettings;
    private mailOneSettingsCached: MailOneSettings;

    //#endregion

    @Output()
    onError: EventEmitter<Error> = new EventEmitter<Error>();

    constructor(settingsService: SettingsService) {
        this.settingsService = settingsService;
        this.mailOneSettings = new MailOneSettings();
        this.mailOneSettings.NumberOfLevels = 1;
    }

    private ngOnInit() {
        this.refreshDataSource();
        this.disableEditMode();
    }

    private refreshDataSource() {
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
    }

    private enableEditMode() {
        // create a shallow clone
        this.mailOneSettingsCached = MailOneSettings.createClone(this.mailOneSettings);
        this.isInEditMode = true;
    }

    private disableEditMode() {
        this.isInEditMode = false;
    }

    private cancelEditMode() {
        this.mailOneSettings = MailOneSettings.createClone(this.mailOneSettingsCached);
        this.disableEditMode();
    }

    //#region SubComponent Event Handlers

    private onNumberOfAccountLevelsChanged(count: number) {
        this.mailOneSettings.NumberOfLevels = count;
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
        this.mailOneSettings.MaximumAmountPerLabel = amount;
    }

    private onBalanceWarningLevelChanged(balance: number) {
        this.mailOneSettings.BalanceWarningLevel = balance;
    }

    //#endregion

    private saveChanges() {
        console.info("Posting settings:");
        console.info(this.mailOneSettings);

        this.settingsService.postAllSettings(this.mailOneSettings).subscribe(
            () => {
                console.log('Settings posted successfully!');
                this.disableEditMode();
            },
            (error: any) => {
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