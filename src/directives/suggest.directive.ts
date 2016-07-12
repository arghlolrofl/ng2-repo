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
    @Input('fpSuggest')
    public mapper:(term:string) => any;

    /**
     * The event and message queue.
     */
    @Input('fpSuggestEvents')
    public events:EventEmitter<any>;

    /**
     * Suggestion list to be stored.
     * @type {Array}
     */
    private suggestions:any[] = [];

    /**
     * Offset of selected / active suggestion.
     * @type {number}
     */
    private offset:number = 0;

    /**
     * True if some selection is active.
     * @type {boolean}
     */
    private selected = false;

    /**
     * @constructor
     * @param {ElementRef} el the element to be bound on
     */
    constructor(el:ElementRef) {
        //noinspection TypeScriptUnresolvedFunction
        Observable.fromEvent(el.nativeElement, 'keyup')
            .filter((keyEvent:KeyboardEvent) => keyEvent.keyCode === 13 || keyEvent.keyCode === 27
                                                || keyEvent.keyCode === 40 || keyEvent.keyCode === 38)
            .subscribe((keyEvent:KeyboardEvent) => this.navigate(keyEvent));

        //noinspection TypeScriptUnresolvedFunction
        Observable.fromEvent(el.nativeElement, 'keyup')
            .filter((keyEvent:KeyboardEvent) => keyEvent.keyCode !== 13 && keyEvent.keyCode !== 27
                                                && keyEvent.keyCode !== 40 && keyEvent.keyCode !== 38)
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
            }
        });
    }

    /**
     * Executed on operator keys (arrow keys, enter, esc).
     * @param {KeyboardEvent} keyEvent the keyboard event
     */
    private navigate(keyEvent:KeyboardEvent) {
        keyEvent.preventDefault();
        const keyCode = keyEvent.keyCode;

        if (keyCode === 27) {
            this.events.emit({
                type: SuggestEvents.CLEARED
            });
        }

        if (this.suggestions.length === 0) {
            return;
        }

        if (!this.selected || keyCode === 40 && (this.offset + 1) >= this.suggestions.length) {
            this.offset = 0;
            this.selected = true;
        } else if (keyCode === 40) {
            this.offset++;
        } else if (keyCode === 38 && (this.offset - 1) < 0) {
            this.offset = this.suggestions.length - 1;
        } else if (keyCode === 38) {
            this.offset--;
        } else if (keyCode === 13) {
            this.events.emit({
                type: SuggestEvents.SELECTED,
                data: this.suggestions[this.offset]
            });
        }

        if (keyCode !== 27 && keyCode !== 13) {
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