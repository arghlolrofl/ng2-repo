import {DestinationTarget} from "./destination-target";

/**
 * DestinationInfo model.
 */
export default class DestinationInfo {

    PostalCode:string;

    Target:DestinationTarget = DestinationTarget.Domestic;
}