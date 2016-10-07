import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import APIClient from './api-client.service';
import SortedPagedRequest from '../models/base/sorted-paged-request';
import SortedPagedResults from '../models/base/sorted-paged-results';
import AccountInvoiceInfo from '../models/invoices/account-invoice-info';
import AccountInvoiceFilterRequest from '../models/invoices/account-invoice-filter-request';

@Injectable()
export default class AccountInvoiceService {
    private apiClient: APIClient;

    /**
     * @constructor
     * @param {APIClient} apiClient the api client
     */
    constructor(apiClient: APIClient) {
        this.apiClient = apiClient;
    }

    /**
     * Get list of account invoices.
     * @returns {Observable<SortedPagedResults<AccountInvoiceInfo>>}
     */
    public getAllInvoices(): Observable<SortedPagedResults<AccountInvoiceInfo>> {
        return this.apiClient.post('AccountInvoice/GetAll', {
            "StartValue": 0
        });
    }

    public getAccountInvoices(sortedPagedRequest: SortedPagedRequest): Observable<SortedPagedResults<AccountInvoiceInfo>> {
        return this.apiClient.post('AccountInvoice/GetAll', sortedPagedRequest);
    }

    public getFilteredAccountInvoices(costAccountRequest: AccountInvoiceFilterRequest): Observable<SortedPagedResults<AccountInvoiceInfo>> {
        return this.apiClient.post("AccountInvoice/GetFiltered", costAccountRequest);
    }

    public getById(id: number): Observable<AccountInvoiceInfo> {
        return this.apiClient.get('CostCenter/GetById?id=' + id);
    }
}