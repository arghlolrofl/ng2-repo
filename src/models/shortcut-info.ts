import DimensionInfo from "./dimension-info";
import WeightInfo from "./weight-info";
import OptionDetails from "./option-details";

/**
 * ShortcutInfo model.
 */
export default class ShortcutInfo {

    DisplayName: string;

    TotalFee: number;

    Weight: WeightInfo;

    DisplayPosition: number;

    Dimensions: DimensionInfo;

    Options: Array<OptionDetails>;

    Id: number;
}