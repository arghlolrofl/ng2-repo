import {ESurchargeType} from './esurcharge-type';

/**
 * CostCenterInfo model.
 */
export default class CostCenterInfo {

    Name: string;

    Number: string;

    Level: number;

    Surcharge: number;

    SurchargeType: ESurchargeType;

    IsActive: boolean;

    IsDefault: boolean;

    Id: number;
}