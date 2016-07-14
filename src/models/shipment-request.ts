import Product from "./product";
import ParcelCharacteristikInfo from "./parcel-characteristic-info";
import ShippingNotificationInfo from "./shipping-notification-info";
import {LabelOutputFormat} from "./label-output-format";
import CostCentreInfo from "./cost-centre-info";

/**
 * ShipmentRequest model.
 */
export default class ShipmentRequest  {

    ShippingPoint: string;

    IsPickup: boolean;

    ShippingPointID: string;

    Product: Product = new Product();

    SenderContactID: number;

    DestinationContactID: number;

    Characteristic: ParcelCharacteristikInfo = new ParcelCharacteristikInfo();

    Notification: ShippingNotificationInfo;

    LabelFormat: LabelOutputFormat;

    HidePostageRate: boolean;

    HideInsuredValue: boolean;

    AdditionalInfo1: string;

    AdditionalInfo2: string;

    CostCentre: CostCentreInfo = new CostCentreInfo();

    IncludeReturnLabel: boolean;
}