/**
 * Model for Administration - Settings
 */
export default class MailOneSettings {
    CostCenterLevelOneName: string;

    CostCenterLevelTwoName: string;

    CostCenterLevelThreeName: string;

    NumberOfLevels: number;

    MaximumAmountPerLabel: number;

    BalanceWarningLevel: number;

    public static createClone(sourceSettings: MailOneSettings): MailOneSettings {
        let newInstance = new MailOneSettings();

        newInstance.BalanceWarningLevel = sourceSettings.BalanceWarningLevel;
        newInstance.MaximumAmountPerLabel = sourceSettings.MaximumAmountPerLabel;
        newInstance.NumberOfLevels = sourceSettings.NumberOfLevels;
        newInstance.CostCenterLevelOneName = sourceSettings.CostCenterLevelOneName;
        newInstance.CostCenterLevelTwoName = sourceSettings.CostCenterLevelTwoName;
        newInstance.CostCenterLevelThreeName = sourceSettings.CostCenterLevelThreeName;

        return newInstance;
    }

    //public get CostCenterLevelOneName(): string { return this.costCenterLevelOneName; }
    //public set CostCenterLevelOneName(val: string) { this.costCenterLevelOneName = val; }
    //public get CostCenterLevelTwoName(): string { return this.costCenterLevelTwoName; }
    //public set CostCenterLevelTwoName(val: string) { this.costCenterLevelTwoName = val; }
    //public get CostCenterLevelThreeName(): string { return this.costCenterLevelThreeName; }
    //public set CostCenterLevelThreeName(val: string) { this.costCenterLevelThreeName = val; }
    //public get NumberOfLevels(): number { return this.numberOfLevels; }
    //public set NumberOfLevels(val: number) { this.numberOfLevels = val; }
    //public get MaximumAmountPerLabel(): number { return this.maximumAmountPerLabel; }
    //public set MaximumAmountPerLabel(val: number) { this.maximumAmountPerLabel = val; }
    //public get BalanceWarningLevel(): number { return this.balanceWarningLevel; }
    //public set BalanceWarningLevel(val: number) { this.balanceWarningLevel = val; }
}