import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
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
     * Shortcut has been selected or changed.
     * @type {EventEmitter}
     */
    @Output()
    public shortcutChange:EventEmitter<ShortcutInfo> = new EventEmitter();

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
     * Shortcut placeholder.
     */
    private shortcutPlaceholder:Array<number>;

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
        this.shortcutPlaceholder = Array(4).fill(0);
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
                (r:ShortcutInfo) => {
                    this.shortcuts.push(r);
                    this.shortcutPlaceholder.splice(0, 1);
                },
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

    /**
     * Select last rate.
     */
    public lastRate() {
        console.log('last rate'); // TODO implement
    }

    /**
     * Select shortcut.
     * @param {ShortcutInfo} shortcut the shortcut to be selected
     */
    public selectShortcut(shortcut:ShortcutInfo) {
        this.shortcutChange.emit(shortcut);
    }
}
