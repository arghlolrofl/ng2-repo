import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslateService} from 'ng2-translate/ng2-translate';
import DropdownValue from './../../../ui/keyValuePair';

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
 *
 * "CostCenterLevelOneName": "sample string 1",
 * "CostCenterLevelTwoName": "sample string 2",
 * "CostCenterLevelThreeName": "sample string 3",
 * "NumberOfLevels": 4,
 */
export default class SettingsAccountLevelsComponent {
    private translateService: TranslateService;
    private comboBoxItems: Array<DropdownValue<number, string>>;
    private selectedComboBoxItem: DropdownValue<number, string>;
    public get SelectedComboBoxItem(): DropdownValue<number, string> { return this.selectedComboBoxItem; }
    public set SelectedComboBoxItem(val: DropdownValue<number, string>) {
        this.selectedComboBoxItem = this.comboBoxItems[val.Key - 1];
        this.toggleInputFields(val.Key);
        this.numberOfLevels = val.Key;
        this.notifyNumberOfLevels.emit(this.numberOfLevels);
    }

    public get SelectedOption(): number {
        if (typeof this.SelectedComboBoxItem === 'undefined')
            this.SelectedComboBoxItem = this.comboBoxItems[0];

        return this.SelectedComboBoxItem.Key;
    }
    public set SelectedOption(val: number) {
        this.SelectedComboBoxItem = this.comboBoxItems[val - 1];
    }

    @Input() costCenterLevelOneName: string;
    @Input() costCenterLevelTwoName: string;
    @Input() costCenterLevelThreeName: string;
    @Input() numberOfLevels: number = -1;
    @Input() isInEditMode: boolean = false;

    @Output() notifyNumberOfLevels: EventEmitter<number> = new EventEmitter<number>();
    @Output() notifyCostCenterLevelOneName: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyCostCenterLevelTwoName: EventEmitter<string> = new EventEmitter<string>();
    @Output() notifyCostCenterLevelThreeName: EventEmitter<string> = new EventEmitter<string>();

    constructor(translate: TranslateService) {
        this.translateService = translate;
        this.comboBoxItems = new Array<DropdownValue<number, string>>();

        this.translateService.get('LEVEL').subscribe(
            (res: string) => {
                let newItem = new DropdownValue(1, "1 " + res);
                this.comboBoxItems.push(newItem);
            }
        );

        this.translateService.get('LEVEL_PLURALIZED').subscribe(
            (res: string) => {
                this.comboBoxItems.push(new DropdownValue(2, "2 " + res));
                this.comboBoxItems.push(new DropdownValue(3, "3 " + res));
            }
        );
    }

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
}