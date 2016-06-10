import {Injectable} from '@angular/core';

import AddressDisplayInfo from "../models/address-display-info";

/**
 * Formats the models to strings.
 */
@Injectable()
export default class ModelFormatter {

    //noinspection JSMethodCanBeStatic
    /**
     * Format the AddressDisplayInfo.
     * @param {AddressDisplayInfo} model the model to be formatted
     * @returns {string}
     */
    public addressDisplayInfo(model:AddressDisplayInfo) {
        return `${model.FirstName} ${model.LastName}`;
    }
}