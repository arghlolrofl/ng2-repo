import {Injectable} from '@angular/core';

import AddressDisplayInfo from "../models/address-display-info";
import AddressGroupInfo from "../models/address-group-info";

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
        if (!model) {
            return '';
        }
        return `${model.FirstName} ${model.LastName}`;
    }

    //noinspection JSMethodCanBeStatic
    /**
     * Format the AddressGroupInfo.
     * @param {AddressGroupInfo} model the model to be formatted
     * @returns {string}
     */
    public addressGroupInfo(model:AddressGroupInfo) {
        if (!model) {
            return '';
        }
        return `${model.GroupName}`;
    }
}