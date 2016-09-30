import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'fp-administration-cost-account-table-paging',
    templateUrl: 'assets/templates/administration/cost-account/cost-account.table.paging.html',
    styles: [
        '.paging-control { background-color: #eee; padding-top: 5px; padding-bottom: 0; }',
        '.paging-status { width: 100%; text-align: center; }',
        '.icon-button { background-color: #eee; }'
    ]
})

export default class CostAccountTablePagingComponent {
    @Input()
    resultCount: number;

    @Input()
    totalResultCount: number;

    @Output()
    nextPageRequested: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    previousPageRequested: EventEmitter<number> = new EventEmitter<number>();

    @Output()
    resultCountChanged: EventEmitter<number> = new EventEmitter<number>();


    public get ResultCount(): number {
        return this.resultCount;
    }
    public set ResultCount(val: number) {
        this.resultCount = val;
        this.resultCountChanged.emit(this.resultCount);
    }

    public get TotalResultCount(): number { return this.totalResultCount; }
    public set TotalResultCount(val: number) {
        this.totalResultCount = val;
    }


    public get DisplayedResultCount(): number {
        if (this.resultCount > this.totalResultCount)
            return this.totalResultCount;

        return this.resultCount;
    }

    private currentPage: number = 1;
    public get CurrentPage(): number { return this.currentPage; }

    private goToNextPage() {

    }

    private goToPreviousPage() {
        if (this.currentPage <= 1)
            return;

        this.previousPageRequested.emit(
    }
}