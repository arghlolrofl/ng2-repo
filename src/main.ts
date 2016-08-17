import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode, NgModule} from '@angular/core';
import './rxjs-operators';
import 'jquery';
import 'bootstrap';

import {DEBUG_MODE} from './config';
import {AppModule} from './AppModule';

if (!DEBUG_MODE) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);