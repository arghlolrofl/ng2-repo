import {Component, ViewChild, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {MODAL_DIRECTIVES, ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';

import ShortcutService from "../../services/shortcut.service";
import ShortcutInfo from "../../models/shortcut-info";

@Component({
    selector: 'fp-shipping-product-calculation-shortcuts',
    templateUrl: 'app/templates/shipping/shipping.product-calculation.shortcuts.component.html',
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
    @Output() shortcutChange:EventEmitter<ShortcutInfo> = new EventEmitter();

    /**
     * Modal dialog for sender
     */
    @ViewChild('modalSearch') modalSearch:ModalComponent;

    /**
     * Shortcuts.
     */
    shortcuts:Array<ShortcutInfo> = [];
    shortcutPlaceholder:Array<number> = Array(4).fill(0);
    lastShortcut:ShortcutInfo;
    shortcutSuggestions:Array<ShortcutInfo> = [];
    displayedShortcutSuggestions:Array<ShortcutInfo> = [];
    searchInput:string = '';
    searchInputChange:EventEmitter<string> = new EventEmitter();

    /**
     * @constructor
     * @param {ShortcutService} shortcutService the shortcut client
     */
    constructor(private shortcutService:ShortcutService) {
        this.shortcutChange.subscribe(() => {
            if (this.modalSearch.visible) {
                this.modalSearch.close();
            }
        });
    }

    /**
     * Initialize the change events.
     */
    public ngAfterViewInit() {
        const shortcutObservable = this.shortcutService.getAll().share();
        shortcutObservable
            .take(4)
            .subscribe(
                (r:ShortcutInfo) => {
                    this.shortcuts.push(r);
                    this.shortcutPlaceholder.splice(0, 1);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        shortcutObservable
            .subscribe(
                (r:ShortcutInfo) => {
                    this.shortcutSuggestions.push(r);
                    this.displayedShortcutSuggestions.push(r);
                },
                (error:Error) => console.warn(error)); // TODO error handling

        this.shortcutService.getLast()
            .subscribe(
                (r:ShortcutInfo) => this.lastShortcut = r,
                (error:Error) => console.warn(error)); // TODO error handling

        this.searchInputChange.subscribe((term:string) => this.searchInput = term);

        this.searchInputChange
            .distinctUntilChanged()
            .debounceTime(400)
            .subscribe((term:string) => {
                this.displayedShortcutSuggestions = this.shortcutSuggestions.filter(
                    (r:ShortcutInfo) => r.DisplayName.toLowerCase().indexOf(term.toLowerCase()) === 0);
            });
    }

    /**
     * Select last rate.
     */
    public lastRate() {
        console.log('last rate'); // TODO implement
    }
}
