import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {ControlGroup, FormBuilder} from "@angular/common";
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import ShortcutService from "../services/shortcut.service";
import ShortcutInfo from "../models/shortcut-info";

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
        ShortcutService
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
     * Shortcuts to display on main page.
     */
    private shortcuts:Array<ShortcutInfo>;

    /**
     * The last used shortcut.
     */
    private lastShortcut:ShortcutInfo;

    /**
     * Shortcut suggestions.
     */
    private shortcutSuggestions:Array<ShortcutInfo>;

    /**
     * @constructor
     * @param {FormBuilder} formBuilder the form builder
     * @param {ShortcutService} shortcutService the shortcut client
     */
    constructor(private formBuilder:FormBuilder,
                private shortcutService:ShortcutService) {
        this.shortcuts = [];
        this.shortcutSuggestions = [];
        this.searchForm = formBuilder.group({
            'search': ['']
        });
    }

    /**
     * Initialize the change events.
     */
    public ngAfterViewInit() {
        this.shortcutService.getAll()
            .take(4)
            .subscribe(
                (r:ShortcutInfo) => this.shortcuts.push(r),
                (error:Error) => console.warn(error)); // TODO error handling

        this.shortcutService.getLast()
            .subscribe(
                (r:ShortcutInfo) => this.lastShortcut = r,
                (error:Error) => console.warn(error)); // TODO error handling


        this.searchForm.controls['search'].valueChanges
            .filter((term:string) => !!term)
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe((term:string) => {
                this.shortcutSuggestions = [];
                this.shortcutService.getFilteredByName(term)
                    .take(9)
                    .subscribe(
                        (r:ShortcutInfo) => this.shortcutSuggestions.push(r),
                        (error:Error) => console.warn(error)); // TODO error handling
            });
    }

    public lastRate() {
        console.log('last rate'); // TODO implement
    }
}
