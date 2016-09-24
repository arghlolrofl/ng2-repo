import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import ParcelInfo from "../models/parcel-info";
import PostalProductInfo from "../models/postal-product-info";
import ShipmentRequest from "../models/shipment-request";
import ShipmentResponse from "../models/shipment-response";
import Base64ContentInfo from "../models/base64-content-info";

@Injectable()
export default class ShippingService {

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(private apiClient: APIClient) {
    }

    /**
     * Calculate a parcel.
     * @param {ParcelInfo} parcelInfo the information about the parcel to be calculated
     * @returns {Observable<PostalProductInfo>}
     */
    public calculate(parcelInfo: ParcelInfo): Observable<PostalProductInfo> {
        return this.apiClient.post('Shipments/Calculate', parcelInfo)
            .concatMap((r: Array<PostalProductInfo>) => r);
    }

    /**
     * Create the shipment.
     * @param {ShipmentRequest} shipmentRequest the acutal shipping information
     * @returns {Observable<ShipmentResponse>}
     */
    public create(shipmentRequest: ShipmentRequest): Observable<ShipmentResponse> {
        return this.apiClient.post('Shipments', shipmentRequest);
    }

    /**
     * Download the shipment label.
     * @param {ShipmentResponse} shipmentResponse the stored shipping information
     * @returns {Observable<Base64ContentInfo>}
     */
    public getLabel(id: number): Observable<Base64ContentInfo> {
        //shipments/1/label
        return this.apiClient.get("Shipments/" + id + "/label");
    }
}