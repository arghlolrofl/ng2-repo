import PostalProductPriceInfo from "./postal-product-price-info";
/**
 * PostalProductInfo model.
 */
export default class PostalProductInfo {

    AmDelivery:boolean;
    
    Code:string;
    
    CubedWeight:number;
    
    ExpectedDeliveryDate:Date;
    
    ExpectedtransitTime:string;
    
    GuaranteedDelivery:boolean;
    
    Name:string;
    
    Price:PostalProductPriceInfo;
}