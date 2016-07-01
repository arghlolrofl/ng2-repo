import {ESizeUnit} from "./esize-info";
/**
 * DimensionInfo model.
 */
export default class DimensionInfo {

    Height:number;

    Length:number;

    Unit:ESizeUnit = ESizeUnit.Centimeter;

    Width:number;
}