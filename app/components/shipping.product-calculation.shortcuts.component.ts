import {Component, ViewChild, AfterViewInit, EventEmitter} from '@angular/core';
import {NgModel, ControlGroup, FormBuilder} from "@angular/common";
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import ShortcutsService from "../services/shortcuts.service";

@Component({
    selector: 'fp-shipping-product-calculation-shortcuts',
    templateUrl: 'app/templates/shipping.product-calculation.shortcuts.component.html',
    directives: [
        MODAL_DIRECTIVES
    ],
    pipes: [
        TranslatePipe
    ],
    providers: [
        ShortcutsService
    ]
})

/**
 * Shipping Sender component.
 */
export default class ShippingProductCalculationShortcutsComponent implements AfterViewInit {

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalSearch')
    private modalSearch:ModalComponent;

    /**
     * Search form.
     */
    private searchForm:ControlGroup;

    /**
     * @constructor
     */
    constructor(private formBuilder:FormBuilder,
                private shortcutsService:ShortcutsService) {
        this.searchForm = formBuilder.group({
            'search': ['']
        })
    }

    /**
     * Initialize the change events.
     */
    public ngAfterViewInit() {
        this.searchForm.controls['search'].valueChanges
            .filter((term) => !!term)
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe((term) => {
                console.log('filter for ' + term); // TODO implement filter logic
            });
    }
}
