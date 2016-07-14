import {enableProdMode} from '@angular/core';
import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import './rxjs-operators';
import 'jquery';
import 'bootstrap';

import {DEBUG_MODE} from './config';
import AppComponent from './components/app.component';

if (!DEBUG_MODE) {
    enableProdMode();
}
//noinspection TypeScriptValidateTypes
bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms()
]);