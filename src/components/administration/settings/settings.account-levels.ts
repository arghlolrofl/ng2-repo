import {Component, Input, Output, EventEmitter, AfterContentInit, AfterViewInit, OnInit} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import DropdownValue from './../../../ui/key-value-pair';

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
    selector: 'fp-administration-settings-account-levels',
    templateUrl: 'assets/templates/administration/settings/settings.account-levels.html'
})

/**
 * Administration - Settings - AccountLevels
 */
export default class SettingsAccountLevelsComponent {
    //#region Fields

    private translateService: TranslateService;
    private comboBoxItems: Array<DropdownValue<number, string>>;
    private selectedComboBoxItem: DropdownValue<number, string>;

    //#endregion

    //#region Properties

    public get SelectedComboBoxItem(): DropdownValue<number, string> { return this.selectedComboBoxItem; }
    public set SelectedComboBoxItem(val: DropdownValue<number, string>) {
        if (val == null) {
            this.selectedComboBoxItem = null;
            return;
        }

        this.selectedComboBoxItem = this.comboBoxItems[val.Key - 1];
        this.toggleInputFields(val.Key);
        this.numberOfLevels = val.Key;
        this.notifyNumberOfLevels.emit(this.numberOfLevels);
    }

    //#endregion

    //#region NgModels

    public get SelectedOption(): number {
        if (this.comboBoxItems.length < 1)
            return null;

        if (this.SelectedComboBoxItem == null)
            this.SelectedComboBoxItem = this.comboBoxItems[0];

        return this.SelectedComboBoxItem.Key;
    }
    public set SelectedOption(val: number) {
        this.SelectedComboBoxItem = this.comboBoxItems[val - 1];
    }

    //#endregion

    //#region Inputs

    @Input() costCenterLevelOneName: string;
    @Input() costCenterLevelTwoName: string;
    @Input() costCenterLevelThreeName: string;
    @Input() numberOfLevels: number = -1;
    @Input() isInEditMode: boolean = false;

    //#endregion

    //#region Outputs

    @Output() notifyNumberOfLevels: EventEmitter<number> = new EventEmitter<number>();
    @Output() notifyCostCenterLevelOneName: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyCostCenterLevelTwoName: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyCostCenterLevelThreeName: EventEmitter<string> = new EventEmitter<string>();

    //#endregion

    //#region Initialization

    /**
     * Initialies a new instance of the settings account levels component.
     * @param translate
     */
    constructor(translate: TranslateService) {
        this.translateService = translate;

        // let's prefill the combo box with translated values
        this.comboBoxItems = new Array<DropdownValue<number, string>>();
        this.translateService.get('LEVEL').subscribe(
            (res: string) => {
                this.comboBoxItems.push(new DropdownValue(1, "1 " + res));
            }
        );
        this.translateService.get('LEVEL_PLURALIZED').subscribe(
            (res: string) => {
                this.comboBoxItems.push(new DropdownValue(2, "2 " + res));
                this.comboBoxItems.push(new DropdownValue(3, "3 " + res));
            }
        );
    }

    //#endregion

    //#region Private Methods

    /**
     * Toggles input fields for cost account level names,
     * depending on the select number of levels.
     *
     * @param {number} count Cost account level count
     */
    private toggleInputFields(count: number) {
        if (count === 1) {
            $('#level2').hide();
            $('#level3').hide();
        } else if (count === 2) {
            $('#level2').show();
            $('#level3').hide();
        } else {
            $('#level2').show();
            $('#level3').show();
        }
    }

    //#endregion
}