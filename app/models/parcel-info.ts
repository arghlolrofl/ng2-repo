import ParcelCharacteristikInfo from "./parcel-characteristic-info";
import DestinationInfo from "./destination-info";
import ParcelProductInfo from "./parcel-product-info";

/**
 * ParcelInfo model.
 */
export default class ParcelInfo {
    
    Characteristic:ParcelCharacteristikInfo;
    
    PostalCode:string;
    
    Destination:DestinationInfo;
    
    Product:ParcelProductInfo;
}