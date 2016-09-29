import IdentifiableObject from '../base/identifiable-object';

export default class CostAccountInfo extends IdentifiableObject {
    IsActive: boolean;
    IsDefault: boolean;
    Level: number;
    Surcharge: number;
    SurchargeType: number;
    Name: string;
    Number: string;

    public static createClone(ca: CostAccountInfo): CostAccountInfo {
        let caInfo = new CostAccountInfo();
        caInfo.IsActive = ca.IsActive;
        caInfo.IsDefault = ca.IsDefault;
        caInfo.Id = ca.Id;
        caInfo.Level = ca.Level;
        caInfo.Name = ca.Name;
        caInfo.Number = ca.Number;
        caInfo.Surcharge = ca.Surcharge;
        caInfo.SurchargeType = ca.SurchargeType;

        return caInfo;
    }
}