import IdentifiableObject from '../base/identifiable-object';
import CostAccountInfo from '../cost-account/cost-account-info';

export default class AccountInvoiceInfo extends IdentifiableObject {
    CreationDate: Date;
    InvoiceNumber: string;
    InvoiceSendTimestamp: Date;
    InvoiceSendToMail: string;
    InvoicedAmount: number;
    Account: CostAccountInfo;
    CurrentDebitState: number;

    public static createClone(ai: AccountInvoiceInfo): AccountInvoiceInfo {
        let aiInfo = new AccountInvoiceInfo();
        aiInfo.CreationDate = ai.CreationDate;
        aiInfo.InvoiceNumber = ai.InvoiceNumber;
        aiInfo.Id = ai.Id;
        aiInfo.InvoiceSendTimestamp = ai.InvoiceSendTimestamp;
        aiInfo.InvoiceSendToMail = ai.InvoiceSendToMail;
        aiInfo.InvoicedAmount = ai.InvoicedAmount;
        aiInfo.Account = CostAccountInfo.createClone(ai.Account);
        aiInfo.CurrentDebitState = ai.CurrentDebitState;
        return aiInfo;
    }
}