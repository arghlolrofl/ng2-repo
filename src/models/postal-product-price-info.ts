import PostalProductAdjustmentInfo from "./postal-product-adjustment-info";
import PostalProductOptionInfo from "./postal-product-option-info";
import TaxesInfo from "./taxes-info";

/**
 * PostalProductPriceInfo model.
 */
export default class PostalProductPriceInfo {

    Adjustments: PostalProductAdjustmentInfo[];

    Base: number;

    Options: PostalProductOptionInfo[];

    Tax: TaxesInfo;

    Total: number;
}