import DimensionInfo from "./dimension-info";
import WeightInfo from "./weight-info";

/**
 * ParcelCharacteristicInfo model.
 */
export default class ParcelCharacteristikInfo {

    Dimension:DimensionInfo = new DimensionInfo();

    Weight:WeightInfo = new WeightInfo();

    IsDocument:boolean = false;
}