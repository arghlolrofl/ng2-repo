import {Component, Output, EventEmitter} from '@angular/core';
import {Observable} from "rxjs/Observable";

import SortedPagedResults from "../../models/base/sorted-paged-results";
import {SuggestEvents} from "../../directives/suggest.directive";
import CostCenterService from "../../services/cost-center.service";
import CostCenterInfo from "../../models/cost-center-info";
import {MAX_AC_RESULTS} from "../../config";

@Component({
    selector: 'fp-shipping-cost-center',
    templateUrl: 'assets/templates/shipping/shipping.cost-center.component.html',
    providers: [
        CostCenterService
    ]
})

/**
 * Shipping Cost Center component.
 */
export default class ShippingCostCenterComponent {

    @Output() onError: EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Cost Center 1.
     */
    costCenter1Input: string;
    costCenter1: CostCenterInfo;
    @Output() costCenter1Change: EventEmitter<CostCenterInfo> = new EventEmitter<CostCenterInfo>();
    costCenter1Events: EventEmitter<any> = new EventEmitter<any>();
    costCenter1Suggestions: CostCenterInfo[] = [];

    /**
     * Cost Center 2
     */
    costCenter2Input: string;
    @Output() costCenter2Change: EventEmitter<CostCenterInfo> = new EventEmitter<CostCenterInfo>();
    costCenter2Events: EventEmitter<any> = new EventEmitter<any>();
    costCenter2Suggestions: CostCenterInfo[] = [];

    /**
     * Cost Center 3.
     */
    costCenter3Input: string;
    @Output() costCenter3Change: EventEmitter<CostCenterInfo> = new EventEmitter<CostCenterInfo>();
    costCenter3Events: EventEmitter<any> = new EventEmitter<any>();
    costCenter3Suggestions: CostCenterInfo[] = [];

    /**
     * @constructor
     * @param {AddressService} costCenterService the cost center information service
     */
    constructor(private costCenterService: CostCenterService) {
        this.bindEvents();
        this.costCenterService.getDefaultCostCenter().subscribe(
            (response: SortedPagedResults<CostCenterInfo>) => {
                for (let i = 0; i < response.ItemList.length; i++) {
                    if (response.ItemList[i].IsDefault) {
                        this.costCenter1 = response.ItemList[i];
                        this.costCenter1Input = this.costCenter1.Name;
                        break;
                    }
                }
            },
            (error: any) => {
                this.onError.emit(error);
            }
        );
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        this.costCenter1Events.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.costCenter1Suggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.costCenter1 = event.data;
                    this.costCenter1Change.emit(this.costCenter1);
                    this.costCenter1Input = this.costCenter1.Name;
                    break;

                case SuggestEvents.CLEARED:
                    this.costCenter1 = null;
                    this.costCenter1Change.emit(null);
                    this.costCenter2Events.emit({ type: SuggestEvents.CLEARED });
                    this.costCenter3Events.emit({ type: SuggestEvents.CLEARED });
                    this.costCenter1Input = '';
                    break;

                case SuggestEvents.SHOW:
                    this.costCenter1Input = event.data.Name;
                    break;
            }
        });

        this.costCenter2Events.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.costCenter2Suggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.costCenter2Change.emit(event.data);
                    this.costCenter2Input = event.data.Name;
                    break;

                case SuggestEvents.CLEARED:
                    this.costCenter2Change.emit(null);
                    this.costCenter2Input = '';
                    break;

                case SuggestEvents.SHOW:
                    this.costCenter2Input = event.data.Name;
                    break;
            }
        });

        this.costCenter3Events.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.ERROR:
                    this.onError.emit(event.data);
                    break;

                case SuggestEvents.CHANGED:
                    this.costCenter3Suggestions = event.data;
                    break;

                case SuggestEvents.SELECTED:
                    this.costCenter3Change.emit(event.data);
                    this.costCenter3Input = event.data.Name;
                    break;

                case SuggestEvents.CLEARED:
                    this.costCenter3Change.emit(null);
                    this.costCenter3Input = '';
                    break;

                case SuggestEvents.SHOW:
                    this.costCenter3Input = event.data.Name;
                    break;
            }
        });
    }

    /**
     * Map Cost Center API call.
     * @param {CostCenterService} costCenterService the cost center to be wrapped
     * @returns {function(string): Observable<CostCenterInfo>}
     */
    public mapCostCenter1(costCenterService: CostCenterService) {
        return (term: string) => {
            return costCenterService.getFilteredCostCenterByLevelAndFastQuery(1, term, 0, MAX_AC_RESULTS);
        }
    }

    /**
     * Map Cost Center API call.
     * @param {CostCenterService} costCenterService the cost center to be wrapped
     * @returns {function(string): Observable<CostCenterInfo>}
     */
    public mapCostCenter23(costCenterService: CostCenterService) {
        return (term: string) => {
            return Observable.merge(
                costCenterService.getFilteredCostCenterByLevelAndFastQuery(2, term, 0, MAX_AC_RESULTS),
                costCenterService.getFilteredCostCenterByLevelAndFastQuery(3, term, 0, MAX_AC_RESULTS)
            ).take(MAX_AC_RESULTS);
        }
    }
}