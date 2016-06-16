import {Component, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {FormBuilder, ControlGroup, Control} from "@angular/common";

import {SuggestDirective, SuggestEvents} from "../directives/suggest.directive";
import ModelFormatter from "../services/model-formatter.service";
import CostCenterService from "../services/cost-center.service";
import CostCenterInfo from "../models/cost-center-info";

@Component({
    selector: 'fp-shipping-cost-center',
    templateUrl: 'app/templates/shipping.cost-center.component.html',
    directives: [
        SuggestDirective
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        ModelFormatter,
        CostCenterService
    ]
})

/**
 * Shipping Cost Center component.
 */
export default class ShippingCostCenterComponent {

    /**
     * Updated when error occurred.
     * @type {EventEmitter<Error>}
     */
    @Output()
    public onError:EventEmitter<Error> = new EventEmitter<Error>();

    /**
     * Updated when cost center level 1 has been changed.
     * @type {EventEmitter<CostCenterInfo>}
     */
    @Output()
    public costCenter1Change:EventEmitter<CostCenterInfo> = new EventEmitter<CostCenterInfo>();

    /**
     * The form for cost center.
     */
    private costCenterForm:ControlGroup;

    /**
     * Cost Center 1 events.
     * @type {EventEmitter<any>}
     */
    private costCenter1Events:EventEmitter<any> = new EventEmitter<any>();

    /**
     * The actual cost center level 1.
     */
    private costCenter1:CostCenterInfo;

    /**
     * Cost Center 1 suggestions.
     */
    private costCenter1Suggestions:CostCenterInfo[];

    /**
     * @constructor
     * @param {ModelFormatter} modelFormatter the model formatting service
     * @param {AddressService} costCenterService the cost center information service
     * @param {FormBuilder} formBuilder the form builder from angular2
     */
    constructor(private modelFormatter:ModelFormatter,
                private costCenterService:CostCenterService,
                private formBuilder:FormBuilder) {
        this.costCenter1Suggestions = [];
        this.costCenterForm = formBuilder.group({
            'costCenter1': ['']
        });

        this.bindEvents();
    }

    /**
     * Bind all events.
     */
    private bindEvents() {
        const costCenter1Control = <Control> this.costCenterForm.controls['costCenter1'];

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
                    costCenter1Control.updateValue(this.modelFormatter.costCenterInfo(this.costCenter1));
                    break;

                case SuggestEvents.CLEARED:
                    this.costCenter1Change.emit(null);
                    costCenter1Control.updateValue('');
                    break;

                case SuggestEvents.SHOW:
                    costCenter1Control.updateValue(this.modelFormatter.costCenterInfo(event.data), {emitEvent: false});
                    break;
            }
        });
    }

    /**
     * Map Cost Center API call.
     * @param {CostCenterService} costCenterService the cost center to be wrapped
     * @returns {function(string): Observable<CostCenterInfo>}
     */
    public mapCostCenter1(costCenterService:CostCenterService) {
        return (term:string) => {
            return costCenterService.getFilteredCostCenterByLevelAndName(1, term);
        }
    }

    public selectCostCenter1(costCenter:CostCenterInfo) {
        this.costCenter1Events.emit({
            type: SuggestEvents.SELECTED,
            data: costCenter
        });
    }

    public clearCostCenter1() {
        this.costCenter1Events.emit({
            type: SuggestEvents.CLEARED
        });
    }
}