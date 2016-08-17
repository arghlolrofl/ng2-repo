import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import AppComponent from './components/app.component';
import DashboardComponent from './components/dashboard/dashboard.component';
import AdministrationComponent from './components/administration/administration.component';
import ProfileComponent from './components/profile/profile.component';
import ShippingComponent from './components/shipping/shipping.component';
import {routing, appRoutingProviders} from './router/app.routes';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        AdministrationComponent,
        ProfileComponent,
        ShippingComponent
    ],
    providers: [
        appRoutingProviders
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}