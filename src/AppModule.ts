import {NgModule, ErrorHandler, Provider} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule} from '@angular/http';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Ng2Bs3ModalModule} from 'ng2-bs3-modal/ng2-bs3-modal';

import {routing, appRoutingProviders} from './router/app.routes';
import {SuggestDirective} from "./directives/suggest.directive";

import LoadingAnimationComponent from './components/common/loading-animation.component';
import AppComponent from './components/app.component';
import UserPropertiesComponent from './components/user-properties.component';
import DashboardComponent from './components/dashboard/dashboard.component';
import AdministrationComponent from './components/administration/administration.component';

import SettingsComponent from './components/administration/settings/settings.component';
import SettingsAccountLevelsComponent from './components/administration/settings/settings.account-levels';
import SettingsAmountPerLabelComponent from './components/administration/settings/settings.amount-per-label';
import SettingsBalanceWarningLevelComponent from './components/administration/settings/settings.balance-warning-level';

import CostAccountComponent from './components/administration/cost-account/cost-account.component';
import CostAccountTableComponent from './components/administration/cost-account/cost-account.table';
import CostAccountTablePagingComponent from './components/administration/cost-account/cost-account.table.paging';
import CostAccountTableFilterComponent from './components/administration/cost-account/cost-account.table.filter';
import CostAccountTableItemDetailsComponent from './components/administration/cost-account/cost-account.item-details';

import AccountCustomerComponent from './components/administration/users/users.component';
import AccountCustomerTableComponent from './components/administration/users/users.table';
import AccountCustomerTablePagingComponent from './components/administration/users/users.table.paging';
import AccountCustomerTableFilterComponent from './components/administration/users/users.table.filter';
import AccountCustomerTableItemDetailsComponent from './components/administration/users/users.details';

import ProfileComponent from './components/profile/profile.component';

import ShippingComponent from './components/shipping/shipping.component';
import ShippingSenderComponent from "./components/shipping/shipping.sender.component";
import ShippingOptionsComponent from "./components/shipping/shipping.options.component";
import ShippingProductCalculationComponent from "./components/shipping/shipping.product-calculation.component";
import ShippingRecipientComponent from "./components/shipping/shipping.recipient.component";
import ShippingCostCenterComponent from "./components/shipping/shipping.cost-center.component";
import ShippingAdditionalInformationComponent from "./components/shipping/shipping.additional-information.component";
import ShippingSenderAddComponent from "./components/shipping/shipping.sender.add.component";
import ShippingRecipientAddComponent from "./components/shipping/shipping.recipient.add.component";
import ShippingProductCalculationShortcutsComponent from "./components/shipping/shipping.product-calculation.shortcuts.component";
import ShippingLabelComponent from "./components/shipping/shipping.label.component";
import CustomErrorHandler from "./hooks/custom-error-handler"
import NotificationService from "./services/notification.service"

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
            deps: [Http]
        }),
        Ng2Bs3ModalModule,
        routing
    ],
    declarations: [
        LoadingAnimationComponent,

        SuggestDirective,
        AppComponent,
        UserPropertiesComponent,
        DashboardComponent,
        AdministrationComponent,

        SettingsComponent,
        SettingsAccountLevelsComponent,
        SettingsAmountPerLabelComponent,
        SettingsBalanceWarningLevelComponent,

        CostAccountComponent,
        CostAccountTableComponent,
        CostAccountTablePagingComponent,
        CostAccountTableFilterComponent,
        CostAccountTableItemDetailsComponent,

        AccountCustomerComponent,
        AccountCustomerTableComponent,
        AccountCustomerTablePagingComponent,
        AccountCustomerTableFilterComponent,
        AccountCustomerTableItemDetailsComponent,

        ProfileComponent,

        ShippingComponent,
        ShippingSenderComponent,
        ShippingSenderAddComponent,
        ShippingOptionsComponent,
        ShippingProductCalculationComponent,
        ShippingProductCalculationShortcutsComponent,
        ShippingRecipientComponent,
        ShippingRecipientAddComponent,
        ShippingCostCenterComponent,
        ShippingAdditionalInformationComponent,
        ShippingLabelComponent
    ],
    providers: [
        appRoutingProviders,
        NotificationService,
        [{provide:ErrorHandler, useClass:CustomErrorHandler}]
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}