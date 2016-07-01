"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var Observable_1 = require("rxjs/Observable");
var SuggestDirective = (function () {
    /**
     * @constructor
     * @param {ElementRef} el the element to be bound on
     */
    function SuggestDirective(el) {
        var _this = this;
        /**
         * Suggestion list to be stored.
         * @type {Array}
         */
        this.suggestions = [];
        /**
         * Offset of selected / active suggestion.
         * @type {number}
         */
        this.offset = 0;
        /**
         * True if some selection is active.
         * @type {boolean}
         */
        this.selected = false;
        //noinspection TypeScriptUnresolvedFunction
        Observable_1.Observable.fromEvent(el.nativeElement, 'keyup')
            .filter(function (keyEvent) { return keyEvent.keyCode === 13 || keyEvent.keyCode === 27
            || keyEvent.keyCode === 40 || keyEvent.keyCode === 38; })
            .subscribe(function (keyEvent) { return _this.navigate(keyEvent); });
        //noinspection TypeScriptUnresolvedFunction
        Observable_1.Observable.fromEvent(el.nativeElement, 'keyup')
            .filter(function (keyEvent) { return keyEvent.keyCode !== 13 && keyEvent.keyCode !== 27
            && keyEvent.keyCode !== 40 && keyEvent.keyCode !== 38; })
            .map(function () { return el.nativeElement.value; })
            .do(function () {
            _this.suggestions = [];
            _this.events.emit({
                type: SuggestEvents.CHANGED,
                data: _this.suggestions
            });
        })
            .filter(function (term) { return !!term; })
            .distinctUntilChanged()
            .debounceTime(400)
            .switchMap(function (term) { return (term.length > 1) ? _this.mapper(el.nativeElement.value) : []; })
            .subscribe(function (item) {
            _this.suggestions.push(item);
            _this.offset = 0;
            _this.events.emit({
                type: SuggestEvents.CHANGED,
                data: _this.suggestions
            });
        }, function (error) { return _this.events.emit({
            type: SuggestEvents.ERROR,
            data: error
        }); });
    }
    /**
     * Initializes the events.
     */
    SuggestDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.events.subscribe(function (event) {
            switch (event.type) {
                case SuggestEvents.SELECTED:
                    _this.suggestions = [];
                    _this.selected = true;
                    _this.events.emit({
                        type: SuggestEvents.CHANGED,
                        data: _this.suggestions
                    });
                    break;
                case SuggestEvents.CLEARED:
                    _this.selected = false;
                    _this.suggestions = [];
                    _this.events.emit({
                        type: SuggestEvents.CHANGED,
                        data: _this.suggestions
                    });
            }
        });
    };
    /**
     * Executed on operator keys (arrow keys, enter, esc).
     * @param {KeyboardEvent} keyEvent the keyboard event
     */
    SuggestDirective.prototype.navigate = function (keyEvent) {
        keyEvent.preventDefault();
        var keyCode = keyEvent.keyCode;
        if (keyCode === 27) {
            this.events.emit({
                type: SuggestEvents.CLEARED
            });
        }
        if (this.suggestions.length === 0) {
            return;
        }
        if (!this.selected || keyCode === 40 && (this.offset + 1) >= this.suggestions.length) {
            this.offset = 0;
            this.selected = true;
        }
        else if (keyCode === 40) {
            this.offset++;
        }
        else if (keyCode === 38 && (this.offset - 1) < 0) {
            this.offset = this.suggestions.length - 1;
        }
        else if (keyCode === 38) {
            this.offset--;
        }
        else if (keyCode === 13) {
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
    };
    __decorate([
        core_1.Input('fpSuggest'), 
        __metadata('design:type', Function)
    ], SuggestDirective.prototype, "mapper", void 0);
    __decorate([
        core_1.Input('fpSuggestEvents'), 
        __metadata('design:type', core_1.EventEmitter)
    ], SuggestDirective.prototype, "events", void 0);
    SuggestDirective = __decorate([
        core_1.Directive({
            selector: '[fpSuggest]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SuggestDirective);
    return SuggestDirective;
}());
exports.SuggestDirective = SuggestDirective;
/**
 * Suggest message queue events.
 */
(function (SuggestEvents) {
    SuggestEvents[SuggestEvents["ERROR"] = 0] = "ERROR";
    SuggestEvents[SuggestEvents["CHANGED"] = 1] = "CHANGED";
    SuggestEvents[SuggestEvents["SELECTED"] = 2] = "SELECTED";
    SuggestEvents[SuggestEvents["CLEARED"] = 3] = "CLEARED";
    SuggestEvents[SuggestEvents["SHOW"] = 4] = "SHOW";
})(exports.SuggestEvents || (exports.SuggestEvents = {}));
var SuggestEvents = exports.SuggestEvents;
