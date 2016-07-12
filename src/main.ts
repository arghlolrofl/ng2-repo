import {bootstrap} from '@angular/platform-browser-dynamic';
import {disableDeprecatedForms, provideForms} from '@angular/forms';
import './rxjs-operators';
import 'jquery';
import 'bootstrap';

import AppComponent from './components/app.component';

//noinspection TypeScriptValidateTypes
bootstrap(AppComponent, [
    disableDeprecatedForms(),
    provideForms()
]);