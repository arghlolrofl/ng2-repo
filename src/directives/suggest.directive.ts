import {Directive, ElementRef, Input, EventEmitter, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

@Directive({
    selector: '[fpSuggest]'
})

/**
 * Suggest (Autocomplete) directive.
 */
export class SuggestDirective implements OnInit {

    /**
     * Maps the API logic.
     */
    @Input('fpSuggest') mapper: (term: string) => any;

    /**
     * The event and message queue.
     */
    @Input('fpSuggestEvents') events: EventEmitter<any>;

    /**
     * Suggestion list to be stored.
     * @type {Array}
     */
    suggestions: any[] = [];

    /**
     * Offset of selected / active suggestion.
     * @type {number}
     */
    offset: number = 0;

    /**
     * True if some selection is active.
     * @type {boolean}
     */
    selected = false;

    /**
     * Element actions.
     */
    el: ElementRef;

    /**
     * @constructor
     * @param {ElementRef} el the element to be bound on
     */
    constructor(el: ElementRef) {
        this.el = el;
        //noinspection TypeScriptUnresolvedFunction
        Observable.fromEvent(el.nativeElement, 'keyup')
            .filter((keyEvent: KeyboardEvent) => keyEvent.keyCode === KeyCodes.CR || keyEvent.keyCode === KeyCodes.ESC
                || keyEvent.keyCode === KeyCodes.UP || keyEvent.keyCode === KeyCodes.DOWN)
            .subscribe((keyEvent: KeyboardEvent) => this.navigate(keyEvent));

        //noinspection TypeScriptUnresolvedFunction
        Observable.fromEvent(el.nativeElement, 'keyup')
            .filter((keyEvent: KeyboardEvent) => keyEvent.keyCode !== KeyCodes.CR && keyEvent.keyCode !== KeyCodes.ESC
                && keyEvent.keyCode !== KeyCodes.UP && keyEvent.keyCode !== KeyCodes.DOWN)
            .map(() => el.nativeElement.value)
            .do(() => {
                this.suggestions = [];
                this.events.emit({
                    type: SuggestEvents.CHANGED,
                    data: this.suggestions
                });
            })
            .filter((term) => !!term)
            .distinctUntilChanged()
            .debounceTime(400)
            .switchMap((term) => (term.length > 1) ? this.mapper(el.nativeElement.value) : [])
            .subscribe(
            (item) => {
                this.suggestions.push(item);
                this.offset = 0;

                this.events.emit({
                    type: SuggestEvents.CHANGED,
                    data: this.suggestions
                });
            },
            (error) => this.events.emit({
                type: SuggestEvents.ERROR,
                data: error
            }));
    }

    /**
     * Initializes the events.
     */
    ngOnInit() {
        this.events.subscribe((event) => {
            switch (event.type) {
                case SuggestEvents.SELECTED:
                    this.suggestions = [];
                    this.selected = true;
                    this.events.emit({
                        type: SuggestEvents.CHANGED,
                        data: this.suggestions
                    });
                    break;

                case SuggestEvents.CLEARED:
                    this.selected = false;
                    this.suggestions = [];
                    this.events.emit({
                        type: SuggestEvents.CHANGED,
                        data: this.suggestions
                    });
                    break;
            }
        });

        this.initAutoclose();
    }

    /**
     * Check if mouse entered the component or leaves it.
     */
    initAutoclose() {
        this.el.nativeElement.addEventListener('blur', () => {
            setTimeout(() => {
                this.suggestions = [];
                this.events.emit({
                    type: SuggestEvents.CHANGED,
                    data: this.suggestions
                });
            }, 300);
        });
    }

    /**
     * Executed on operator keys (arrow keys, enter, esc).
     * @param {KeyboardEvent} keyEvent the keyboard event
     */
    private navigate(keyEvent: KeyboardEvent) {
        keyEvent.preventDefault();
        const keyCode = keyEvent.keyCode;

        if (keyCode === KeyCodes.ESC) {
            this.events.emit({
                type: SuggestEvents.CLEARED
            });
        }

        if (this.suggestions.length === 0) {
            return;
        }

        if (!this.selected || keyCode === KeyCodes.DOWN && (this.offset + 1) >= this.suggestions.length) {
            this.offset = 0;
            this.selected = true;
        } else if (keyCode === KeyCodes.DOWN) {
            this.offset++;
        } else if (keyCode === KeyCodes.UP && (this.offset - 1) < 0) {
            this.offset = this.suggestions.length - 1;
        } else if (keyCode === KeyCodes.UP) {
            this.offset--;
        } else if (keyCode === KeyCodes.CR) {
            this.events.emit({
                type: SuggestEvents.SELECTED,
                data: this.suggestions[this.offset]
            });
        }

        if (keyCode !== KeyCodes.ESC && keyCode !== KeyCodes.CR) {
            this.events.emit({
                type: SuggestEvents.SHOW,
                data: this.suggestions[this.offset]
            });
        }
    }
}

/**
 * Suggest message queue events.
 */
export enum SuggestEvents {
    ERROR = 0,
    CHANGED = 1,
    SELECTED = 2,
    CLEARED = 3,
    SHOW = 4
}

/**
 * Keycodes with special meanings.
 */
enum KeyCodes {
    CR   = 13,
    ESC  = 27,
    UP   = 38,
    DOWN = 40
}

