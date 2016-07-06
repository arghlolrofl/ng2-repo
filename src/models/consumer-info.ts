import CustomerInfo from "./customer-info";
import {ECreditStatus} from "./ecredit-status";

/**
 * ConsumerInfo model.
 */
export default class ConsumerInfo {

    Customer:CustomerInfo;

    Login:string;

    CreditStatus:ECreditStatus;
}