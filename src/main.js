"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
require('./rxjs-operators');
require('jquery');
require('bootstrap');
var ui_1 = require('../assets/js/ui');
var app_component_1 = require('./components/app.component');
//noinspection TypeScriptValidateTypes
platform_browser_dynamic_1.bootstrap(app_component_1.default);
ui_1.initUi();
