import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

import CostAccountFilter from '../../../models/cost-account/cost-account-filter';

@Component({
    selector: 'fp-administration-users-table-filter',
    templateUrl: 'assets/templates/administration/users/users.table.filter.html',
    styles: [
        '.height-40 { height: 40px; }'
    ]
})

export default class UsersTableFilterComponent {
    //#region Input

    @Input() numberFilter: string;
    @Input() nameFilter: string;
    @Input() levelFilter: string;
    @Input() selectedIsActiveFilter: number;

    //#endregion

    //#region Output

    @Output() applyFilterRequested: EventEmitter<CostAccountFilter> = new EventEmitter<CostAccountFilter>();

    //#endregion

    //#region Properties

    get NumberFilter(): string { return this.numberFilter; }
    set NumberFilter(val: string) {
        this.numberFilter = val;
    }

    get NameFilter(): string { return this.nameFilter; }
    set NameFilter(val: string) {
        this.nameFilter = val;
    }

    get LevelFilter(): string { return this.levelFilter; }
    set LevelFilter(val: string) {
        this.levelFilter = val;
    }

    get SelectedIsActiveFilter(): number { let x = +this.selectedIsActiveFilter; if (isNaN(x)) return 2; }
    set SelectedIsActiveFilter(val: number) {
        this.selectedIsActiveFilter = +val;
    }

    //#endregion

    /**
     * Emits an event, that a new filter should be applyed
     */
    private applyFilter(): void {
        let filter = new CostAccountFilter();

        if (this.hasValue(this.numberFilter))
            filter.Number = this.numberFilter;

        if (this.hasValue(this.nameFilter))
            filter.Name = this.nameFilter;

        if (this.hasValue(this.levelFilter))
            filter.Level = this.levelFilter;

        if (this.selectedIsActiveFilter != null) {
            let isActiveValue = +this.selectedIsActiveFilter;
            if (isActiveValue === 0) {
                filter.IsActive = false;
            } else if (isActiveValue === 1) {
                filter.IsActive = true;
            }
        }

        this.applyFilterRequested.emit(filter);
    }

    private hasValue(text: string) {
        return typeof text != 'undefined' && text != null;
    }
}