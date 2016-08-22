import {enableProdMode, NgModule} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import './rxjs-operators';

import {DEBUG_MODE} from './config';
import {AppModule} from './AppModule';

if (!DEBUG_MODE) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);