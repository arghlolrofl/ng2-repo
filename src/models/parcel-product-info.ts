import ParcelOptionInfo from "./parcel-option-info";

/**
 * ParcelProductInfo model.
 */
export default class ParcelProductInfo {

    Code: string;

    Options: ParcelOptionInfo[] = [];
}