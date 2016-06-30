import {bootstrap} from '@angular/platform-browser-dynamic';
import './rxjs-operators';
import 'jquery';
import 'bootstrap';

import {initUi} from '../assets/js/ui';

import AppComponent from './components/app.component';

//noinspection TypeScriptValidateTypes
bootstrap(AppComponent);
initUi();