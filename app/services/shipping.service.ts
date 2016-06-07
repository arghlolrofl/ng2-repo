import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import ParcelInfo from "../models/parcel-info";
import PostalProductInfo from "../models/postal-product-info";

@Injectable()
export default class ShippingService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient:APIClient) {
    }

    /**
     * Calculate a parcel.
     * @param {ParcelInfo} parcelInfo the information about the parcel to be calculated
     * @returns {Observable<PostalProductInfo>}
     */
    public calculate(parcelInfo:ParcelInfo):Observable<PostalProductInfo> {
        return this.apiClient.post('Shipping/Calculate', parcelInfo);
    }
}