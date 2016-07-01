// import 'rxjs/Rx'; // adds ALL RxJS statics & operators to Observable
"use strict";
// See node_module/rxjs/Rxjs.js
// Import just the rxjs statics and operators we need for THIS app.
// Statics
require('rxjs/add/observable/throw');
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/merge');
require('rxjs/add/observable/timer');
require('rxjs/add/observable/range');
require('rxjs/add/observable/empty');
// Operators
require('rxjs/add/operator/catch');
require('rxjs/add/operator/debounceTime');
require('rxjs/add/operator/distinctUntilChanged');
require('rxjs/add/operator/do');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/concatMap');
require('rxjs/add/operator/take');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/filter');
require('rxjs/add/operator/timeout');
require('rxjs/add/operator/retry');
require('rxjs/add/operator/retryWhen');
require('rxjs/add/operator/first');
require('rxjs/add/operator/zip');
